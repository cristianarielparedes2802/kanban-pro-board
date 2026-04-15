import { createContext, useContext, useMemo, useCallback, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import {
  DEFAULT_COLUMNS,
  DEFAULT_LABELS,
  DEFAULT_TASKS,
  MOCK_USER,
} from '../types/index'

// ─── Context definitions ──────────────────────────────────────────────────────

const TaskContext   = createContext(null)
const AuthContext   = createContext(null)

// ─── Auth Provider ────────────────────────────────────────────────────────────

/**
 * Simulated auth with localStorage persistence.
 * Replace `loginMock` with a real API call when ready.
 */
export function AuthProvider({ children }) {
  const [user, setUser, removeUser] = useLocalStorage('kanban_user', null)

  /** @param {string} email @param {string} password */
  const login = useCallback((email, password) => {
    // Mock validation – any non-empty credentials pass
    if (!email.trim() || !password.trim()) {
      return { ok: false, error: 'Credentials are required.' }
    }
    // Simulate a token check
    const fakeToken = btoa(`${email}:${Date.now()}`)
    setUser({ ...MOCK_USER, email, token: fakeToken })
    return { ok: true }
  }, [setUser])

  const logout = useCallback(() => {
    removeUser()
  }, [removeUser])

  const value = useMemo(
    () => ({ user, login, logout, isAuthenticated: !!user }),
    [user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ─── Task Provider ────────────────────────────────────────────────────────────

export function TaskProvider({ children }) {
  const [tasks,   setTasks]   = useLocalStorage('kanban_tasks',   DEFAULT_TASKS)
  const [columns] = useLocalStorage('kanban_columns', DEFAULT_COLUMNS)
  const [labels]  = useLocalStorage('kanban_labels',  DEFAULT_LABELS)
  const [filter,  setFilter]  = useLocalStorage('kanban_filter',  { labelId: null, priority: null, search: '' })
  const [theme,   setTheme]   = useLocalStorage('kanban_theme',   'dark')

  // ── Task CRUD ──────────────────────────────────────────────────────────────

  /** @param {Omit<import('../types').Task, 'id' | 'createdAt' | 'order'>} data */
  const addTask = useCallback((data) => {
    setTasks((prev) => {
      const colTasks = prev.filter((t) => t.columnId === data.columnId)
      return [
        ...prev,
        {
          ...data,
          id: `task-${Date.now()}`,
          createdAt: new Date().toISOString(),
          order: colTasks.length,
        },
      ]
    })
  }, [setTasks])

  /** @param {string} id @param {Partial<import('../types').Task>} updates */
  const updateTask = useCallback((id, updates) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    )
  }, [setTasks])

  /** @param {string} id */
  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [setTasks])

  /**
   * Moves a task to a new column and recalculates order.
   * @param {string} taskId
   * @param {import('../types').ColumnId} targetColumnId
   * @param {number} targetIndex  - desired position in target column
   */
  const moveTask = useCallback((taskId, targetColumnId, targetIndex) => {
    setTasks((prev) => {
      const task = prev.find((t) => t.id === taskId)
      if (!task) return prev

      // Remove from original list, insert at target position
      const others = prev.filter((t) => t.id !== taskId)
      const targetColTasks = others
        .filter((t) => t.columnId === targetColumnId)
        .sort((a, b) => a.order - b.order)

      targetColTasks.splice(targetIndex, 0, { ...task, columnId: targetColumnId })

      // Re-assign order within the target column
      const reordered = targetColTasks.map((t, i) => ({ ...t, order: i }))

      // Merge back: keep tasks of other columns untouched
      const rest = others.filter((t) => t.columnId !== targetColumnId)
      return [...rest, ...reordered]
    })
  }, [setTasks])

  // ── Derived / filtered tasks ───────────────────────────────────────────────

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filter.labelId && !task.labelIds.includes(filter.labelId)) return false
      if (filter.priority && task.priority !== filter.priority) return false
      if (filter.search) {
        const q = filter.search.toLowerCase()
        if (!task.title.toLowerCase().includes(q) &&
            !task.description.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [tasks, filter])

  /** Tasks indexed by columnId for O(1) lookup in Board rendering */
  const tasksByColumn = useMemo(() => {
    return filteredTasks.reduce((acc, task) => {
      if (!acc[task.columnId]) acc[task.columnId] = []
      acc[task.columnId].push(task)
      acc[task.columnId].sort((a, b) => a.order - b.order)
      return acc
    }, {})
  }, [filteredTasks])

  // ── Theme ──────────────────────────────────────────────────────────────────

  // Sync theme to <html data-theme="..."> so CSS variables apply
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }, [setTheme])

  // ─────────────────────────────────────────────────────────────────────────

  const value = useMemo(
    () => ({
      tasks,
      filteredTasks,
      tasksByColumn,
      columns,
      labels,
      filter,
      setFilter,
      theme,
      toggleTheme,
      addTask,
      updateTask,
      deleteTask,
      moveTask,
    }),
    [
      tasks, filteredTasks, tasksByColumn, columns, labels,
      filter, setFilter, theme, toggleTheme,
      addTask, updateTask, deleteTask, moveTask,
    ],
  )

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

// ─── Custom hooks ─────────────────────────────────────────────────────────────

/** @returns {ReturnType<typeof TaskProvider> extends React.ReactElement ? never : import('../types')} */
export function useTaskContext() {
  const ctx = useContext(TaskContext)
  if (!ctx) throw new Error('useTaskContext must be used inside <TaskProvider>')
  return ctx
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
