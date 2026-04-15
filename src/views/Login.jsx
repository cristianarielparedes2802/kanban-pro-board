import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/TaskContext'

export default function Login() {
  const { login }   = useAuth()
  const navigate    = useNavigate()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise((r) => setTimeout(r, 400))
    const result = login(email, password)
    setLoading(false)
    if (result.ok) {
      navigate('/', { replace: true })
    } else {
      setError(result.error)
    }
  }

  const inputStyle = {
    width: '100%',
    backgroundColor: 'var(--k-bg-input)',
    border: '1px solid var(--k-border-input)',
    borderRadius: '0.75rem',
    padding: '0.75rem 1rem',
    fontSize: '0.875rem',
    color: 'var(--k-text-1)',
    outline: 'none',
    transition: 'border-color 0.15s',
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-200"
      style={{ backgroundColor: 'var(--k-bg-page)' }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(var(--k-text-1) 1px, transparent 1px), linear-gradient(90deg, var(--k-text-1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-2xl mb-4">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-400">
              <rect x="3" y="3" width="7" height="18" rx="1"/>
              <rect x="14" y="3" width="7" height="10" rx="1"/>
              <rect x="14" y="17" width="7" height="4" rx="1"/>
            </svg>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--k-text-1)' }}>
            Kanban Board
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--k-text-3)' }}>
            Inicia sesión para continuar
          </p>
        </div>

        {/* Form */}
        <div
          className="rounded-2xl p-6 border shadow-2xl shadow-black/20"
          style={{ backgroundColor: 'var(--k-bg-modal)', borderColor: 'var(--k-border)' }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--k-text-2)' }}>
                Email
              </label>
              <input
                type="email"
                style={inputStyle}
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={e => e.target.style.borderColor = 'rgba(240,165,0,0.5)'}
                onBlur={e  => e.target.style.borderColor = 'var(--k-border-input)'}
                required
                autoComplete="email"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--k-text-2)' }}>
                Contraseña
              </label>
              <input
                type="password"
                style={inputStyle}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={e => e.target.style.borderColor = 'rgba(240,165,0,0.5)'}
                onBlur={e  => e.target.style.borderColor = 'var(--k-border-input)'}
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-1 py-2.5 rounded-xl text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-900 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verificando…' : 'Ingresar'}
            </button>
          </form>

          <p className="mt-4 text-center text-xs" style={{ color: 'var(--k-text-4)' }}>
            Demo: cualquier email y contraseña funcionan
          </p>
        </div>
      </div>
    </div>
  )
}
