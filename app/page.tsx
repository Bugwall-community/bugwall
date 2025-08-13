import { getAllVulnerabilities, getCategories } from "@/lib/markdown"
import { Navigation } from "@/components/navigation"
import { StatsOverview } from "@/components/stats-overview"
import { VulnerabilityCard } from "@/components/vulnerability-card"
import { BackToTop } from "@/components/back-to-top"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, TrendingUp, Clock, Sparkles } from "lucide-react"

export default async function HomePage() {
  const vulnerabilities = await getAllVulnerabilities()
  const categories = getCategories()

  // Get recent vulnerabilities (last 5)
  const recentVulnerabilities = vulnerabilities.slice(0, 5)

  // Get unresolved vulnerabilities
  const unresolvedVulnerabilities = vulnerabilities.filter((v) => v.frontmatter.status === "unresolved").slice(0, 3)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-3xl" />
          <div className="py-16 px-8">
            <div className="flex items-center justify-center mb-4 hero-title">
              <Sparkles className="h-8 w-8 text-primary mr-2" />
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">BUGWALL</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed hero-subtitle">
              BUGWALL Community提供的CWALL BUG追踪器
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center hero-buttons">
              <Button asChild size="lg" className="group">
                <Link href="/vulnerabilities">
                  查看所有漏洞
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="group bg-transparent">
                <Link href="/vulnerabilities?status=unresolved">
                  <TrendingUp className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  未修复漏洞
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mb-12 stats-section">
          <StatsOverview vulnerabilities={vulnerabilities} />
        </div>

        {/* Recent Vulnerabilities */}
        {recentVulnerabilities.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-semibold">最近发现的漏洞</h2>
              </div>
              <Button variant="ghost" asChild className="group">
                <Link href="/vulnerabilities">
                  查看全部
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 vulnerability-cards">
              {recentVulnerabilities.map((vulnerability) => (
                <div key={vulnerability.slug} className="vulnerability-card">
                  <VulnerabilityCard vulnerability={vulnerability} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Categories Overview */}
        {categories.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-6">漏洞分类</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category, index) => {
                const categoryCount = vulnerabilities.filter((v) => v.frontmatter.category === category).length
                return (
                  <Link
                    key={category}
                    href={`/vulnerabilities?category=${encodeURIComponent(category)}`}
                    className="group p-4 border rounded-lg hover:bg-muted/50 transition-all duration-200 hover:shadow-md hover:-translate-y-1"
                  >
                    <div className="font-medium group-hover:text-primary transition-colors">{category}</div>
                    <div className="text-sm text-muted-foreground">{categoryCount} 个漏洞</div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* Empty State */}
        {vulnerabilities.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-semibold mb-2">暂无漏洞记录</h2>
            <p className="text-muted-foreground mb-6">
              在 <code className="bg-muted px-2 py-1 rounded">bugs/</code> 目录下添加 Markdown 文件来开始追踪漏洞
            </p>
            <Button variant="outline">
              <Link href="/vulnerabilities">查看示例</Link>
            </Button>
          </div>
        )}
      </main>

      <BackToTop />
    </div>
  )
}
