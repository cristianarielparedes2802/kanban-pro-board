import React, { memo } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useTaskContext } from '../../context/TaskContext'
import { PRIORITY_CONFIG } from '../../types/index'
import Badge from '../ui/Badge'

const BoardCard = memo(function BoardCard({ taskId, onEdit, onDelete }) {
  const { tasks, labels } = useTaskContext()
  const task = tasks.find((t) => t.id === taskId)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: taskId })

  if (!task) return null

  const taskLabels = labels.filter((l) => task.labelIds.includes(l.id))
  const priority   = PRIORITY_CONFIG[task.priority]

  return (
    <article
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.35 : 1,
        backgroundColor: 'var(--k-bg-card)',
        borderColor: isDragging ? 'rgba(240,165,0,0.4)' : 'var(--k-border)',
      }}
      {...attributes}
      {...listeners}
      className={`
        group relative select-none rounded-xl p-4 border
        cursor-grab active:cursor-grabbing
        transition-all duration-150
        ${isDragging ? 'shadow-2xl ring-1 ring-amber-500/25' : 'hover:shadow-lg hover:shadow-black/20'}
      `}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 min-w-0">
          <span
            className={`mt-[5px] w-1.5 h-1.5 rounded-full flex-shrink-0 ${priority.dot}`}
            title={`Prioridad: ${priority.label}`}
          />
          <h3
            className="text-sm font-medium leading-snug break-words"
            style={{ color: 'var(--k-text-1)' }}
          >
            {task.title}
          </h3>
        </div>

        {/* Actions — visible on hover */}
        <div className="flex gap-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-100">
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onEdit?.(task) }}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--k-text-3)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--k-text-1)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--k-text-3)'}
            title="Editar"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61zm1.414 1.06a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354l-1.086-1.086zM11.189 6.25 9.75 4.81l-6.286 6.287a.25.25 0 0 0-.064.108l-.558 1.953 1.953-.558a.249.249 0 0 0 .108-.064z"/>
            </svg>
          </button>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onDelete?.(task.id) }}
            className="p-1.5 rounded-lg transition-colors hover:text-red-400 hover:bg-red-500/10"
            style={{ color: 'var(--k-text-3)' }}
            title="Eliminar"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11 1.75V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75ZM4.496 6.675l.66 6.6a.25.25 0 0 0 .249.225h5.19a.25.25 0 0 0 .249-.225l.66-6.6a.75.75 0 0 1 1.492.149l-.66 6.6A1.748 1.748 0 0 1 10.595 15h-5.19a1.75 1.75 0 0 1-1.741-1.575l-.66-6.6a.75.75 0 1 1 1.492-.15ZM6.5 1.75V3h3V1.75a.25.25 0 0 0-.25-.25h-2.5a.25.25 0 0 0-.25.25Z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p
          className="mt-2 text-xs leading-relaxed line-clamp-2"
          style={{ color: 'var(--k-text-3)' }}
        >
          {task.description}
        </p>
      )}

      {/* Labels */}
      {taskLabels.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {taskLabels.map((label) => (
            <Badge key={label.id} color={label.color}>{label.name}</Badge>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between">
        <span className="font-mono text-[10px]" style={{ color: 'var(--k-text-4)' }}>
          {new Date(task.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
        </span>
        <span className={`font-mono text-[10px] ${priority.class}`}>
          {priority.label}
        </span>
      </div>
    </article>
  )
})

export default BoardCard
