import React, { useCallback, useState } from 'react'
import { useAuth, useTaskContext } from '../context/TaskContext'
import Board from '../components/Board'
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
    <div className="flex flex-wrap items-center gap-2 md:gap-3">
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
          className="rounded-xl pl-8 pr-3 py-1.5 text-xs transition-colors outline-none w-full md:w-36"
          style={{
            backgroundColor: 'var(--k-bg-input)',
            border: '1px solid var(--k-border-input)',
            color: 'var(--k-text-1)',
          }}
        />
      </div>

      {/* Label filters */}
      <div className="flex flex-wrap items-center gap-1.5">
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
  const [filterOpen, setFilterOpen] = useState(false)
  const { user, logout }            = useAuth()
  const { theme, toggleTheme, tasks, filteredTasks, filter } = useTaskContext()

  const isFiltered      = filteredTasks.length !== tasks.length
  const hasActiveFilter = !!(filter.labelId || filter.priority || filter.search)

  return (
    <>
      {/* ── Main bar ── */}
      <header
        className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 border-b backdrop-blur sticky top-0 z-30 transition-colors duration-200"
        style={{ backgroundColor: 'var(--k-header-bg)', borderColor: 'var(--k-border)' }}
      >
        {/* Logo + title */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 bg-amber-500/10 border border-amber-500/20 rounded-xl flex-shrink-0">
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

        {/* FilterBar inline — desktop only */}
        <div className="hidden md:flex">
          <FilterBar />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">

          {/* Filter toggle — mobile only */}
          <button
            onClick={() => setFilterOpen((v) => !v)}
            title="Filters"
            className="relative md:hidden w-8 h-8 flex items-center justify-center rounded-xl border transition-all duration-150 cursor-pointer hover:border-amber-500/40"
            style={{
              backgroundColor: filterOpen ? 'var(--k-bg-card)' : 'var(--k-bg-input)',
              borderColor: filterOpen ? 'rgba(240,165,0,0.4)' : 'var(--k-border)',
              color: 'var(--k-text-2)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1 2.75A.75.75 0 0 1 1.75 2h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 2.75Zm3 5A.75.75 0 0 1 4.75 7h6.5a.75.75 0 0 1 0 1.5h-6.5A.75.75 0 0 1 4 7.75ZM7 12.75a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75Z"/>
            </svg>
            {/* Active filter dot */}
            {hasActiveFilter && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
            )}
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            className="w-8 h-8 flex items-center justify-center rounded-xl border transition-all duration-150 cursor-pointer hover:border-amber-500/40"
            style={{ backgroundColor: 'var(--k-bg-input)', borderColor: 'var(--k-border)', color: 'var(--k-text-2)' }}
          >
            {theme === 'dark' ? (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-1.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM8 0a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1A.75.75 0 0 1 8 0Zm0 13.5a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1A.75.75 0 0 1 8 13.5ZM2.343 2.343a.75.75 0 0 1 1.061 0l.707.707a.749.749 0 0 1-1.06 1.06l-.707-.707a.75.75 0 0 1 0-1.06Zm9.193 9.193a.75.75 0 0 1 1.06 0l.708.707a.75.75 0 0 1-1.061 1.06l-.707-.707a.749.749 0 0 1 0-1.06ZM16 8a.75.75 0 0 1-.75.75h-1a.75.75 0 0 1 0-1.5h1A.75.75 0 0 1 16 8ZM2.5 8a.75.75 0 0 1-.75.75h-1a.75.75 0 0 1 0-1.5h1A.75.75 0 0 1 2.5 8Z"/>
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
                <path d="M9.598 1.591a.749.749 0 0 1 .785-.175 7.001 7.001 0 1 1-8.967 8.967.75.75 0 0 1 .961-.96 5.5 5.5 0 0 0 7.046-7.046.75.75 0 0 1 .175-.786Zm1.616 1.945a7 7 0 0 1-7.678 7.678 5.499 5.499 0 1 0 7.678-7.678Z"/>
              </svg>
            )}
          </button>

          {/* User avatar */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-amber-400 font-mono">
                {user?.avatar ?? '?'}
              </span>
            </div>
            <span className="text-xs hidden lg:block" style={{ color: 'var(--k-text-2)' }}>
              {user?.name}
            </span>
          </div>

          {/* Sign out */}
          <button
            onClick={logout}
            className="hidden sm:flex text-xs px-3 py-1.5 rounded-lg border transition-colors cursor-pointer hover:text-red-400 hover:border-red-500/30"
            style={{ color: 'var(--k-text-3)', borderColor: 'var(--k-border)' }}
          >
            Sign out
          </button>
          {/* Sign out icon — xs only */}
          <button
            onClick={logout}
            title="Sign out"
            className="sm:hidden w-8 h-8 flex items-center justify-center rounded-xl border transition-colors cursor-pointer hover:text-red-400 hover:border-red-500/30"
            style={{ color: 'var(--k-text-3)', borderColor: 'var(--k-border)' }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 2.75C2 1.784 2.784 1 3.75 1h2.5a.75.75 0 0 1 0 1.5h-2.5a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h2.5a.75.75 0 0 1 0 1.5h-2.5A1.75 1.75 0 0 1 2 13.25Zm10.44 4.5-1.97-1.97a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l1.97-1.97H6.75a.75.75 0 0 1 0-1.5Z"/>
            </svg>
          </button>
        </div>
      </header>

      {/* ── Collapsible filter panel — mobile only ── */}
      {filterOpen && (
        <div
          className="md:hidden px-4 py-3 border-b transition-colors duration-200"
          style={{ backgroundColor: 'var(--k-bg-surface)', borderColor: 'var(--k-border)' }}
        >
          <FilterBar />
        </div>
      )}
    </>
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
