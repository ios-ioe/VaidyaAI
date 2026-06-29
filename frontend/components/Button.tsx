import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', ...props }, ref) => {
    const baseClasses = 'font-jakarta font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maroon disabled:opacity-50 disabled:cursor-not-allowed'
    
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm rounded-md',
      md: 'px-4 py-2.5 text-base rounded-lg',
      lg: 'px-6 py-3 text-lg rounded-lg',
    }

    const variantClasses = {
      primary: 'bg-maroon text-white hover:bg-[#5A1620] active:bg-[#491218] shadow-sm hover:shadow-md',
      secondary: 'bg-white border-2 border-gold text-ink hover:bg-parchment active:bg-[#E8DDD0]',
      ghost: 'bg-transparent text-ink hover:bg-parchment active:bg-[#E8DDD0] border border-transparent hover:border-border',
    }

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
