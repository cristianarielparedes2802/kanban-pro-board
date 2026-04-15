import React, { useState } from 'react'
import { useTaskContext } from '../../context/TaskContext'
import { PRIORITY_CONFIG } from '../../types/index'
import Badge from './Badge'

export default function TaskForm({ task, onSubmit, onCancel }) {
  const { labels } = useTaskContext()
  const [title,       setTitle]       = useState(task?.title       ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [priority,    setPriority]    = useState(task?.priority    ?? 'medium')
  const [labelIds,    setLabelIds]    = useState(task?.labelIds    ?? [])

  const toggleLabel = (id) =>
    setLabelIds((prev) => prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit({ title: title.trim(), description: description.trim(), priority, labelIds })
  }

  const inputStyle = {
    width: '100%',
    backgroundColor: 'var(--k-bg-input)',
    border: '1px solid var(--k-border-input)',
    borderRadius: '0.75rem',
    padding: '0.625rem 0.75rem',
    fontSize: '0.875rem',
    color: 'var(--k-text-1)',
    outline: 'none',
    transition: 'border-color 0.15s',
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Title */}
      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--k-text-2)' }}>
          Título <span className="text-red-400">*</span>
        </label>
        <input
          style={inputStyle}
          placeholder="Ej: Diseñar sistema de autenticación…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={e => e.target.style.borderColor = 'rgba(240,165,0,0.5)'}
          onBlur={e  => e.target.style.borderColor = 'var(--k-border-input)'}
          autoFocus
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--k-text-2)' }}>
          Descripción
        </label>
        <textarea
          style={{ ...inputStyle, resize: 'none', height: '5rem' }}
          placeholder="Detalles opcionales…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onFocus={e => e.target.style.borderColor = 'rgba(240,165,0,0.5)'}
          onBlur={e  => e.target.style.borderColor = 'var(--k-border-input)'}
        />
      </div>

      {/* Priority */}
      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--k-text-2)' }}>
          Prioridad
        </label>
        <div className="flex gap-2">
          {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
            <button
              key={key}
              type="button"
              onClick={() => setPriority(key)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                border transition-all duration-150 cursor-pointer
                ${priority === key ? `border-zinc-500 bg-zinc-700/50 ${cfg.class}` : ''}
              `}
              style={priority !== key ? { borderColor: 'var(--k-border)', color: 'var(--k-text-3)' } : {}}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </button>
          ))}
        </div>
      </div>

      {/* Labels */}
      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--k-text-2)' }}>
          Etiquetas
        </label>
        <div className="flex flex-wrap gap-1.5">
          {labels.map((label) => (
            <button
              key={label.id}
              type="button"
              onClick={() => toggleLabel(label.id)}
              className={`transition-all duration-150 cursor-pointer rounded ${
                labelIds.includes(label.id) ? 'ring-2 ring-white/30 scale-105' : 'opacity-50 hover:opacity-80'
              }`}
            >
              <Badge color={label.color}>{label.name}</Badge>
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl text-sm transition-colors cursor-pointer hover:bg-black/10"
          style={{ color: 'var(--k-text-2)' }}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={!title.trim()}
          className="px-4 py-2 rounded-xl text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-900 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {task ? 'Guardar cambios' : 'Crear tarea'}
        </button>
      </div>
    </form>
  )
}
