import { useState, useCallback, useMemo } from 'react'
import {
  useSensor,
  useSensors,
  PointerSensor,
  pointerWithin,
  rectIntersection,
} from '@dnd-kit/core'
import { useTaskContext } from '../context/TaskContext'

/**
 * Encapsulates board-level DnD logic and modal state.
 * Used by Board.jsx to keep the component lean.
 */
export function useKanban() {
  const { tasks, columns, moveTask, addTask, updateTask, deleteTask } = useTaskContext()

  // ── DnD ────────────────────────────────────────────────────────────────────

  const [activeTaskId, setActiveTaskId] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Require 8px movement before starting drag (prevents accidental drags)
      activationConstraint: { distance: 8 },
    }),
  )

  const handleDragStart = useCallback(({ active }) => {
    setActiveTaskId(active.id)
  }, [])

  const handleDragEnd = useCallback(
    ({ active, over }) => {
      setActiveTaskId(null)
      if (!over || active.id === over.id) return

      const activeTask = tasks.find((t) => t.id === active.id)
      if (!activeTask) return

      const overIsColumn = columns.some((c) => c.id === over.id)
      const targetColumnId = overIsColumn
        ? over.id
        : (tasks.find((t) => t.id === over.id)?.columnId ?? activeTask.columnId)

      // Tasks already in target column (excluding the dragged one)
      const targetColTasks = tasks
        .filter((t) => t.columnId === targetColumnId && t.id !== active.id)
        .sort((a, b) => a.order - b.order)

      let targetIndex
      if (overIsColumn) {
        targetIndex = targetColTasks.length
      } else {
        const overIdx = targetColTasks.findIndex((t) => t.id === over.id)
        targetIndex = overIdx >= 0 ? overIdx : targetColTasks.length
      }

      moveTask(active.id, targetColumnId, targetIndex)
    },
    [tasks, columns, moveTask],
  )

  const handleDragCancel = useCallback(() => {
    setActiveTaskId(null)
  }, [])

  /**
   * Custom collision detection:
   * 1. pointerWithin  — uses actual cursor position (most accurate)
   * 2. rectIntersection — fallback when pointer leaves all droppables
   *
   * Replaces closestCorners which confused adjacent column borders.
   */
  const collisionDetection = useCallback((args) => {
    const pointerHits = pointerWithin(args)
    if (pointerHits.length > 0) return pointerHits
    return rectIntersection(args)
  }, [])

  const activeTask = useMemo(
    () => (activeTaskId ? tasks.find((t) => t.id === activeTaskId) ?? null : null),
    [activeTaskId, tasks],
  )

  // ── Modal ──────────────────────────────────────────────────────────────────

  const [modal, setModal] = useState({
    open: false,
    mode: 'add',    // 'add' | 'edit'
    task: null,
    columnId: null,
  })

  /** @param {string} columnId */
  const openAdd = useCallback((columnId) => {
    setModal({ open: true, mode: 'add', task: null, columnId })
  }, [])

  /** @param {import('../types').Task} task */
  const openEdit = useCallback((task) => {
    setModal({ open: true, mode: 'edit', task, columnId: task.columnId })
  }, [])

  const closeModal = useCallback(() => {
    setModal((m) => ({ ...m, open: false }))
  }, [])

  const handleSubmit = useCallback(
    (data) => {
      if (modal.mode === 'add') {
        addTask({ ...data, columnId: modal.columnId })
      } else if (modal.task) {
        updateTask(modal.task.id, data)
      }
      closeModal()
    },
    [modal, addTask, updateTask, closeModal],
  )

  return {
    // DnD
    sensors,
    collisionDetection,
    activeTask,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    // Modal
    modal,
    openAdd,
    openEdit,
    closeModal,
    handleSubmit,
    // Task actions (pass-through for convenience)
    deleteTask,
  }
}
