import { getAllVulnerabilities, getCategories } from "@/lib/markdown"
import { Navigation } from "@/components/navigation"
import { SearchAndFilter } from "@/components/search-and-filter"
import { Suspense } from "react"

interface SearchParams {
  search?: string
  category?: string
  status?: string
  level?: string
  dateFrom?: string
  dateTo?: string
}

interface VulnerabilitiesPageProps {
  searchParams: SearchParams
}

export default async function VulnerabilitiesPage({ searchParams }: VulnerabilitiesPageProps) {
  const vulnerabilities = await getAllVulnerabilities()
  const categories = getCategories()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">漏洞列表</h1>
          <p className="text-muted-foreground">共 {vulnerabilities.length} 个漏洞记录</p>
        </div>

        <Suspense fallback={<div>加载中...</div>}>
          <SearchAndFilter vulnerabilities={vulnerabilities} categories={categories} searchParams={searchParams} />
        </Suspense>
      </main>
    </div>
  )
}
