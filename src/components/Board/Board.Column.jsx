import React, { memo, useMemo } from 'react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { useTaskContext } from '../../context/TaskContext'
import BoardCard from './Board.Card'

const BoardColumn = memo(function BoardColumn({ column, onAddTask, onEditTask, onDeleteTask }) {
  const { tasksByColumn } = useTaskContext()
  const tasks   = tasksByColumn[column.id] ?? []
  const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks])

  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  return (
    <div className="flex flex-col w-72 flex-shrink-0">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-3 px-0.5">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: column.accentVar }}
          />
          <h2 className={`text-xs font-semibold tracking-widest uppercase ${column.accentClass}`}>
            {column.title}
          </h2>
          <span
            className="font-mono text-[10px] rounded-full px-2 py-0.5 border"
            style={{
              color: 'var(--k-text-4)',
              backgroundColor: 'var(--k-bg-card)',
              borderColor: 'var(--k-border)',
            }}
          >
            {tasks.length}
          </span>
        </div>

        <button
          onClick={() => onAddTask?.(column.id)}
          className="w-6 h-6 flex items-center justify-center rounded-lg transition-colors hover:text-amber-400"
          style={{ color: 'var(--k-text-4)' }}
          title={`Agregar tarea en ${column.title}`}
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <path d="M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z"/>
          </svg>
        </button>
      </div>

      {/* Colored accent bar */}
      <div
        className="h-0.5 rounded-full mb-3 opacity-50"
        style={{ backgroundColor: column.accentVar }}
      />

      {/* ── Drop zone ── */}
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className="flex-1 flex flex-col gap-2.5 min-h-32 p-2.5 rounded-2xl border transition-all duration-200"
          style={{
            backgroundColor: isOver ? 'rgba(240,165,0,0.04)' : 'var(--k-col-bg)',
            borderColor: isOver ? 'rgba(240,165,0,0.35)' : 'var(--k-col-border)',
          }}
        >
          {tasks.map((task) => (
            <BoardCard
              key={task.id}
              taskId={task.id}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}

          {tasks.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center py-10 gap-2">
              <div
                className="w-8 h-8 rounded-xl border-2 border-dashed opacity-20"
                style={{ borderColor: column.accentVar }}
              />
              <p className="text-xs" style={{ color: 'var(--k-text-4)' }}>Sin tareas</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  )
})

export default BoardColumn
