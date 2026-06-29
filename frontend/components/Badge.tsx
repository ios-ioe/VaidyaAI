import React from 'react'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'vata' | 'pitta' | 'kapha' | 'risk' | 'default'
  children: React.ReactNode
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ variant = 'default', className = '', ...props }, ref) => {
    const variantClasses = {
      vata: 'bg-blue-50 border border-blue-200 text-blue-700',
      pitta: 'bg-red-50 border border-red-200 text-red-700',
      kapha: 'bg-[#E8F3EC] border border-[#A8D5BB] text-sage',
      risk: 'bg-risk-bg border border-[#E4B8C0] text-risk',
      default: 'bg-parchment border border-border text-ink',
    }

    return (
      <div
        ref={ref}
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium font-jakarta ${variantClasses[variant]} ${className}`}
        {...props}
      />
    )
  }
)

Badge.displayName = 'Badge'
