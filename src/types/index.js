/**
 * @typedef {'todo' | 'in-progress' | 'review' | 'done'} ColumnId
 * @typedef {'low' | 'medium' | 'high'} Priority
 */

/**
 * @typedef {Object} Label
 * @property {string} id
 * @property {string} name
 * @property {string} color  - Tailwind bg class, e.g. "bg-violet-500"
 */

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {ColumnId} columnId
 * @property {string[]} labelIds
 * @property {Priority} priority
 * @property {string} createdAt   - ISO date string
 * @property {number} order        - Sort order within column (ascending)
 */

/**
 * @typedef {Object} Column
 * @property {ColumnId} id
 * @property {string} title
 * @property {string} accentVar    - CSS variable, e.g. "var(--color-col-todo)"
 * @property {string} accentClass  - Tailwind text class for accent color
 */

/**
 * @typedef {Object} KanbanUser
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} avatar
 */

// ─── Default seed data ──────────────────────────────────────────────────────

/** @type {Column[]} */
export const DEFAULT_COLUMNS = [
  { id: 'todo',        title: 'To Do',       accentVar: 'var(--color-col-todo)',     accentClass: 'text-indigo-400' },
  { id: 'in-progress', title: 'In Progress', accentVar: 'var(--color-col-progress)', accentClass: 'text-amber-400'  },
  { id: 'review',      title: 'In Review',   accentVar: 'var(--color-col-review)',   accentClass: 'text-purple-400' },
  { id: 'done',        title: 'Done',        accentVar: 'var(--color-col-done)',     accentClass: 'text-emerald-400'},
]

/** @type {Label[]} */
export const DEFAULT_LABELS = [
  { id: 'feat',    name: 'Feature',  color: 'bg-indigo-500'  },
  { id: 'bug',     name: 'Bug',      color: 'bg-red-500'     },
  { id: 'docs',    name: 'Docs',     color: 'bg-sky-500'     },
  { id: 'perf',    name: 'Perf',     color: 'bg-amber-500'   },
  { id: 'design',  name: 'Design',   color: 'bg-pink-500'    },
  { id: 'test',    name: 'Test',     color: 'bg-emerald-500' },
]

/** @type {Task[]} */
export const DEFAULT_TASKS = [
  {
    id: 'task-1', title: 'Diseñar sistema de autenticación',
    description: 'Definir flujo OAuth + JWT con refresh tokens.',
    columnId: 'todo', labelIds: ['feat', 'docs'], priority: 'high',
    createdAt: new Date().toISOString(), order: 0,
  },
  {
    id: 'task-2', title: 'Optimizar consultas de la API',
    description: 'Revisar N+1 queries en endpoint de usuarios.',
    columnId: 'todo', labelIds: ['perf', 'bug'], priority: 'medium',
    createdAt: new Date().toISOString(), order: 1,
  },
  {
    id: 'task-3', title: 'Implementar Drag & Drop en Kanban',
    description: 'Usar @dnd-kit con virtualización para listas largas.',
    columnId: 'in-progress', labelIds: ['feat'], priority: 'high',
    createdAt: new Date().toISOString(), order: 0,
  },
  {
    id: 'task-4', title: 'Setup CI/CD pipeline',
    description: 'GitHub Actions → build → test → deploy a Vercel.',
    columnId: 'in-progress', labelIds: ['docs'], priority: 'low',
    createdAt: new Date().toISOString(), order: 1,
  },
  {
    id: 'task-5', title: 'Review PR #42 – Dark Mode',
    description: 'Verificar contraste WCAG AA en todos los componentes.',
    columnId: 'review', labelIds: ['design', 'test'], priority: 'medium',
    createdAt: new Date().toISOString(), order: 0,
  },
  {
    id: 'task-6', title: 'Publicar documentación técnica',
    description: 'Generar Storybook y subir a GitHub Pages.',
    columnId: 'done', labelIds: ['docs'], priority: 'low',
    createdAt: new Date().toISOString(), order: 0,
  },
]

/** @type {KanbanUser} */
export const MOCK_USER = {
  id: 'user-1',
  name: 'Ariel Paredes',
  email: 'cristian.ariel.paredes2802@gmail.com',
  avatar: 'AP',
}

// ─── Priority config ─────────────────────────────────────────────────────────

export const PRIORITY_CONFIG = {
  high:   { label: 'Alta',   class: 'text-red-400',    dot: 'bg-red-400'    },
  medium: { label: 'Media',  class: 'text-amber-400',  dot: 'bg-amber-400'  },
  low:    { label: 'Baja',   class: 'text-slate-400',  dot: 'bg-slate-400'  },
}
