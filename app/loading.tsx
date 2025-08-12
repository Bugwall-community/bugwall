import { Navigation } from "@/components/navigation"
import { StatsOverviewSkeleton, VulnerabilityListSkeleton } from "@/components/loading-skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-muted rounded-lg w-64 mx-auto" />
            <div className="h-6 bg-muted rounded w-96 mx-auto" />
            <div className="flex gap-4 justify-center">
              <div className="h-10 bg-muted rounded w-32" />
              <div className="h-10 bg-muted rounded w-24" />
            </div>
          </div>
        </div>

        <div className="mb-12">
          <StatsOverviewSkeleton />
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="h-8 bg-muted rounded w-48 animate-pulse" />
            <div className="h-8 bg-muted rounded w-20 animate-pulse" />
          </div>
          <VulnerabilityListSkeleton />
        </div>
      </main>
    </div>
  )
}
