'use client'

import React from 'react'

interface SkeletonProps {
  className?: string
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className = 'w-full h-12' }, ref) => (
    <div
      ref={ref}
      className={`bg-muted animate-pulse rounded-[12px] ${className}`}
      aria-busy="true"
      aria-label="Loading"
    />
  )
)
Skeleton.displayName = 'Skeleton'

export const SkeletonCard = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className = '' }, ref) => (
    <div
      ref={ref}
      className={`bg-white border border-border rounded-[12px] shadow-sm p-6 space-y-4 ${className}`}
    >
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="space-y-2 pt-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    </div>
  )
)
SkeletonCard.displayName = 'SkeletonCard'

export const SkeletonStat = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className = '' }, ref) => (
    <div
      ref={ref}
      className={`bg-white border border-border rounded-[12px] shadow-sm p-6 space-y-3 ${className}`}
    >
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  )
)
SkeletonStat.displayName = 'SkeletonStat'
