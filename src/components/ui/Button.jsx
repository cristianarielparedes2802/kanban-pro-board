import React, { memo } from 'react'

const VARIANTS = {
  primary:  'bg-amber-500 hover:bg-amber-400 text-zinc-900 font-semibold',
  ghost:    'bg-transparent hover:bg-zinc-700/60 text-zinc-400 hover:text-zinc-200',
  danger:   'bg-transparent hover:bg-red-500/10 text-zinc-500 hover:text-red-400',
  outline:  'border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-zinc-100 bg-transparent',
}

const SIZES = {
  sm:  'px-3 py-1.5 text-xs rounded-lg',
  md:  'px-4 py-2 text-sm rounded-xl',
  lg:  'px-5 py-2.5 text-sm rounded-xl',
  icon:'p-1.5 rounded-lg',
}

/**
 * @param {{ variant?: keyof VARIANTS, size?: keyof SIZES } & React.ButtonHTMLAttributes<HTMLButtonElement>} props
 */
const Button = memo(function Button({
  variant = 'outline',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-1.5
        transition-all duration-150 cursor-pointer
        disabled:opacity-40 disabled:cursor-not-allowed
        ${VARIANTS[variant]} ${SIZES[size]} ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
})

export default Button
