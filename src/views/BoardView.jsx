import React, { useCallback } from 'react'
import { useAuth, useTaskContext } from '../context/TaskContext'
import Board from '../components/Board'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

// ── Filter bar ─────────────────────────────────────────────────────────────────

function FilterBar() {
  const { labels, filter, setFilter } = useTaskContext()

  const setLabel    = useCallback((id)  => setFilter((f) => ({ ...f, labelId:  f.labelId  === id  ? null : id  })), [setFilter])
  const setPriority = useCallback((val) => setFilter((f) => ({ ...f, priority: f.priority === val ? null : val })), [setFilter])
  const setSearch   = useCallback((e)   => { const v = e.target.value; setFilter((f) => ({ ...f, search: v })) }, [setFilter])
  const clearAll    = useCallback(()    => setFilter({ labelId: null, priority: null, search: '' }), [setFilter])

  const isActive = filter.labelId || filter.priority || filter.search

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: 'var(--k-text-4)' }}
          width="13" height="13" viewBox="0 0 16 16" fill="currentColor"
        >
          <path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z"/>
        </svg>
        <input
          type="text"
          placeholder="Search…"
          value={filter.search}
          onChange={setSearch}
          className="rounded-xl pl-8 pr-3 py-1.5 text-xs transition-colors w-36 outline-none"
          style={{
            backgroundColor: 'var(--k-bg-input)',
            border: '1px solid var(--k-border-input)',
            color: 'var(--k-text-1)',
          }}
        />
      </div>

      {/* Label filters */}
      <div className="flex items-center gap-1.5">
        {labels.map((label) => (
          <button
            key={label.id}
            onClick={() => setLabel(label.id)}
            className={`transition-all duration-150 rounded cursor-pointer ${
              filter.labelId === label.id ? 'ring-2 ring-white/30 scale-105' : 'opacity-50 hover:opacity-80'
            }`}
          >
            <Badge color={label.color}>{label.name}</Badge>
          </button>
        ))}
      </div>

      {/* Priority filters */}
      <div
        className="flex items-center gap-1 rounded-xl p-1 border"
        style={{ backgroundColor: 'var(--k-bg-input)', borderColor: 'var(--k-border-input)' }}
      >
        {[
          { val: 'high',   label: 'High',   dot: 'bg-red-400',   active: 'bg-red-500/20 text-red-300 border-red-500/30'       },
          { val: 'medium', label: 'Medium', dot: 'bg-amber-400', active: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
          { val: 'low',    label: 'Low',    dot: 'bg-slate-400', active: 'bg-zinc-600/40 text-zinc-300 border-zinc-500/30'    },
        ].map(({ val, label, dot, active }) => (
          <button
            key={val}
            onClick={() => setPriority(val)}
            className={`
              flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium
              border transition-all duration-150 cursor-pointer
              ${filter.priority === val ? active : 'border-transparent hover:bg-black/10'}
            `}
            style={filter.priority !== val ? { color: 'var(--k-text-3)' } : {}}
          >
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
            {label}
          </button>
        ))}
      </div>

      {/* Clear */}
      {isActive && (
        <button
          onClick={clearAll}
          className="text-xs transition-colors underline underline-offset-2 cursor-pointer hover:text-amber-400"
          style={{ color: 'var(--k-text-3)' }}
        >
          Clear
        </button>
      )}
    </div>
  )
}

// ── Board header ───────────────────────────────────────────────────────────────

function BoardHeader() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme, tasks, filteredTasks } = useTaskContext()
  const isFiltered = filteredTasks.length !== tasks.length

  return (
    <header
      className="flex items-center justify-between px-6 py-4 border-b backdrop-blur sticky top-0 z-30 transition-colors duration-200"
      style={{
        backgroundColor: 'var(--k-header-bg)',
        borderColor: 'var(--k-border)',
      }}
    >
      {/* Logo + title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-400">
            <rect x="3" y="3" width="7" height="18" rx="1"/>
            <rect x="14" y="3" width="7" height="10" rx="1"/>
            <rect x="14" y="17" width="7" height="4" rx="1"/>
          </svg>
        </div>
        <div>
          <h1 className="text-sm font-semibold leading-none" style={{ color: 'var(--k-text-1)' }}>
            Kanban Board
          </h1>
          <p className="text-[10px] mt-0.5 font-mono" style={{ color: 'var(--k-text-4)' }}>
            {isFiltered ? `${filteredTasks.length} / ${tasks.length} tasks` : `${tasks.length} tasks`}
          </p>
        </div>
      </div>

      {/* Filters */}
      <FilterBar />

      {/* Right: theme toggle + user */}
      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          className="w-8 h-8 flex items-center justify-center rounded-xl border transition-all duration-150 cursor-pointer hover:border-amber-500/40"
          style={{ backgroundColor: 'var(--k-bg-input)', borderColor: 'var(--k-border)', color: 'var(--k-text-2)' }}
        >
          {theme === 'dark' ? (
            /* Sun icon */
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-1.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM8 0a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1A.75.75 0 0 1 8 0Zm0 13.5a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1A.75.75 0 0 1 8 13.5ZM2.343 2.343a.75.75 0 0 1 1.061 0l.707.707a.749.749 0 0 1-1.06 1.06l-.707-.707a.75.75 0 0 1 0-1.06Zm9.193 9.193a.75.75 0 0 1 1.06 0l.708.707a.75.75 0 0 1-1.061 1.06l-.707-.707a.749.749 0 0 1 0-1.06ZM16 8a.75.75 0 0 1-.75.75h-1a.75.75 0 0 1 0-1.5h1A.75.75 0 0 1 16 8ZM2.5 8a.75.75 0 0 1-.75.75h-1a.75.75 0 0 1 0-1.5h1A.75.75 0 0 1 2.5 8Z"/>
            </svg>
          ) : (
            /* Moon icon */
            <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
              <path d="M9.598 1.591a.749.749 0 0 1 .785-.175 7.001 7.001 0 1 1-8.967 8.967.75.75 0 0 1 .961-.96 5.5 5.5 0 0 0 7.046-7.046.75.75 0 0 1 .175-.786Zm1.616 1.945a7 7 0 0 1-7.678 7.678 5.499 5.499 0 1 0 7.678-7.678Z"/>
            </svg>
          )}
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/20 flex items-center justify-center">
            <span className="text-[10px] font-bold text-amber-400 font-mono">
              {user?.avatar ?? '?'}
            </span>
          </div>
          <span className="text-xs hidden sm:block" style={{ color: 'var(--k-text-2)' }}>
            {user?.name}
          </span>
        </div>

        <button
          onClick={logout}
          className="text-xs px-3 py-1.5 rounded-lg border transition-colors cursor-pointer hover:text-red-400 hover:border-red-500/30"
          style={{ color: 'var(--k-text-3)', borderColor: 'var(--k-border)' }}
        >
          Sign out
        </button>
      </div>
    </header>
  )
}

// ── Main view ──────────────────────────────────────────────────────────────────

export default function BoardView() {
  return (
    <div
      className="flex flex-col min-h-screen transition-colors duration-200"
      style={{ backgroundColor: 'var(--k-bg-page)' }}
    >
      <BoardHeader />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Board />
      </main>
    </div>
  )
}
