import React from 'react'

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3
  children: React.ReactNode
}

interface BodyProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
  size?: 'sm' | 'base' | 'lg'
}

interface LabelProps extends React.HTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level = 1, className = '', ...props }, ref) => {
    const headingClasses = {
      1: 'text-4xl font-bold text-ink',
      2: 'text-3xl font-bold text-ink',
      3: 'text-xl font-bold text-ink',
    }

    const Tag = `h${level}` as const

    return (
      <Tag
        ref={ref as any}
        className={`${headingClasses[level]} ${className}`}
        style={{ fontFamily: 'var(--font-fraunces-var)' }}
        {...props}
      />
    )
  }
)
Heading.displayName = 'Heading'

export const Body = React.forwardRef<HTMLParagraphElement, BodyProps>(
  ({ size = 'base', className = '', ...props }, ref) => {
    const sizeClasses = {
      sm: 'text-sm leading-6',
      base: 'text-base leading-7',
      lg: 'text-lg leading-8',
    }

    return (
      <p
        ref={ref}
        className={`text-ink ${sizeClasses[size]} ${className}`}
        style={{ fontFamily: 'var(--font-jakarta-var)' }}
        {...props}
      />
    )
  }
)
Body.displayName = 'Body'

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className = '', ...props }, ref) => (
    <label
      ref={ref}
      className={`text-sm font-medium text-ink ${className}`}
      style={{ fontFamily: 'var(--font-jakarta-var)' }}
      {...props}
    />
  )
)
Label.displayName = 'Label'
