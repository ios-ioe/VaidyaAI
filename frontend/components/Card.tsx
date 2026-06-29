import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`bg-white border border-border rounded-[12px] shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}
      {...props}
    />
  )
)
Card.displayName = 'Card'

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`px-6 py-4 border-b border-border ${className}`}
      {...props}
    />
  )
)
CardHeader.displayName = 'CardHeader'

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`p-6 ${className}`}
      {...props}
    />
  )
)
CardContent.displayName = 'CardContent'

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`px-6 py-4 border-t border-border flex gap-3 justify-end ${className}`}
      {...props}
    />
  )
)
CardFooter.displayName = 'CardFooter'
