import React from 'react'
import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { TaskProvider, useTaskContext } from '../context/TaskContext'
import { DEFAULT_TASKS, DEFAULT_COLUMNS, DEFAULT_LABELS } from '../types/index'

// ── Helper: component that exposes context values via data-testid ──────────────

function Inspector() {
  const { tasks, columns, labels, filteredTasks, tasksByColumn, filter } = useTaskContext()
  return (
    <div>
      <span data-testid="task-count">{tasks.length}</span>
      <span data-testid="col-count">{columns.length}</span>
      <span data-testid="label-count">{labels.length}</span>
      <span data-testid="filtered-count">{filteredTasks.length}</span>
      <span data-testid="todo-count">{tasksByColumn['todo']?.length ?? 0}</span>
      <span data-testid="filter-label">{filter.labelId ?? 'none'}</span>
    </div>
  )
}

function MutatorInspector() {
  const { tasks, addTask, updateTask, deleteTask, moveTask } = useTaskContext()
  return (
    <div>
      <span data-testid="task-count">{tasks.length}</span>
      <span data-testid="first-title">{tasks[0]?.title ?? ''}</span>
      <button data-testid="add-btn"    onClick={() => addTask({ title: 'New Task', description: '', priority: 'low', labelIds: [], columnId: 'todo' })} />
      <button data-testid="update-btn" onClick={() => updateTask(tasks[0]?.id, { title: 'Updated' })} />
      <button data-testid="delete-btn" onClick={() => deleteTask(tasks[0]?.id)} />
      <button data-testid="move-btn"   onClick={() => moveTask(tasks[0]?.id, 'done', 0)} />
    </div>
  )
}

// ── Test suite ─────────────────────────────────────────────────────────────────

describe('TaskContext — initial state', () => {
  beforeEach(() => window.localStorage.clear())

  it('loads default tasks on first render', () => {
    render(<TaskProvider><Inspector /></TaskProvider>)
    expect(screen.getByTestId('task-count').textContent).toBe(String(DEFAULT_TASKS.length))
  })

  it('loads all default columns', () => {
    render(<TaskProvider><Inspector /></TaskProvider>)
    expect(screen.getByTestId('col-count').textContent).toBe(String(DEFAULT_COLUMNS.length))
  })

  it('loads all default labels', () => {
    render(<TaskProvider><Inspector /></TaskProvider>)
    expect(screen.getByTestId('label-count').textContent).toBe(String(DEFAULT_LABELS.length))
  })

  it('groups tasks by column correctly', () => {
    render(<TaskProvider><Inspector /></TaskProvider>)
    const expected = DEFAULT_TASKS.filter((t) => t.columnId === 'todo').length
    expect(screen.getByTestId('todo-count').textContent).toBe(String(expected))
  })

  it('starts with no active filters', () => {
    render(<TaskProvider><Inspector /></TaskProvider>)
    expect(screen.getByTestId('filtered-count').textContent).toBe(String(DEFAULT_TASKS.length))
    expect(screen.getByTestId('filter-label').textContent).toBe('none')
  })
})

describe('TaskContext — CRUD operations', () => {
  beforeEach(() => window.localStorage.clear())

  it('addTask increases the task count by 1', () => {
    render(<TaskProvider><MutatorInspector /></TaskProvider>)
    const before = Number(screen.getByTestId('task-count').textContent)

    act(() => screen.getByTestId('add-btn').click())

    expect(Number(screen.getByTestId('task-count').textContent)).toBe(before + 1)
  })

  it('updateTask changes the task title', () => {
    render(<TaskProvider><MutatorInspector /></TaskProvider>)

    act(() => screen.getByTestId('update-btn').click())

    expect(screen.getByTestId('first-title').textContent).toBe('Updated')
  })

  it('deleteTask decreases the task count by 1', () => {
    render(<TaskProvider><MutatorInspector /></TaskProvider>)
    const before = Number(screen.getByTestId('task-count').textContent)

    act(() => screen.getByTestId('delete-btn').click())

    expect(Number(screen.getByTestId('task-count').textContent)).toBe(before - 1)
  })

  it('moveTask moves a task to the "done" column', () => {
    // Track the 'done' column count instead of array position.
    // After moveTask, the tasks array is re-ordered as [...rest, ...reordered],
    // so the moved task is no longer at tasks[0] — it ends up at the end.
    function MoveInspector() {
      const { tasksByColumn, moveTask } = useTaskContext()
      const firstTodoTask = tasksByColumn['todo']?.[0]
      return (
        <div>
          <span data-testid="done-count">{tasksByColumn['done']?.length ?? 0}</span>
          <button
            data-testid="move-btn"
            onClick={() => firstTodoTask && moveTask(firstTodoTask.id, 'done', 0)}
          />
        </div>
      )
    }
    render(<TaskProvider><MoveInspector /></TaskProvider>)

    const before = Number(screen.getByTestId('done-count').textContent)
    act(() => screen.getByTestId('move-btn').click())

    expect(Number(screen.getByTestId('done-count').textContent)).toBe(before + 1)
  })
})
