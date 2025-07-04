import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
  count?: number
  height?: string
  width?: string
  circle?: boolean
}

export function Skeleton({ className, count = 1, height, width, circle = false }: SkeletonProps) {
  const skeletons = Array.from({ length: count }).map((_, i) => (
    <div
      key={i}
      className={cn("animate-pulse bg-gray-200 dark:bg-gray-700", circle ? "rounded-full" : "rounded", className)}
      style={{
        height: height || "1rem",
        width: width || "100%",
      }}
    />
  ))

  return <>{skeletons}</>
}

export function CardSkeleton() {
  return (
    <div className="border rounded-lg p-4 bg-card">
      <div className="space-y-3">
        <Skeleton height="200px" className="rounded-md" />
        <Skeleton height="1.5rem" width="70%" />
        <Skeleton height="1rem" width="90%" />
        <Skeleton height="1rem" width="60%" />
      </div>
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton height="64px" width="64px" circle />
      <div className="space-y-2">
        <Skeleton height="1.5rem" width="150px" />
        <Skeleton height="1rem" width="100px" />
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-muted p-4">
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} height="1.5rem" />
          ))}
        </div>
      </div>
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton key={colIndex} height="1rem" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
