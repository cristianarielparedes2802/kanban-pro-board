import React, { memo } from 'react'

/**
 * Small colored label badge.
 * @param {{ color: string, children: React.ReactNode, className?: string }} props
 * color is a Tailwind bg class, e.g. "bg-indigo-500"
 */
const Badge = memo(function Badge({ color = 'bg-zinc-600', children, className = '' }) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 px-1.5 py-0.5
        rounded text-[10px] font-medium tracking-wide uppercase
        text-white/90 ${color} ${className}
      `}
    >
      {children}
    </span>
  )
})

export default Badge
