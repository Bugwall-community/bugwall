import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedCounter } from "@/components/animated-counter"
import { Shield, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import type { Vulnerability } from "@/lib/types"

interface StatsOverviewProps {
  vulnerabilities: Vulnerability[]
}

export function StatsOverview({ vulnerabilities }: StatsOverviewProps) {
  const stats = {
    total: vulnerabilities.length,
    unresolved: vulnerabilities.filter((v) => v.frontmatter.status === "unresolved").length,
    resolved: vulnerabilities.filter((v) => v.frontmatter.status === "resolved").length,
    archived: vulnerabilities.filter((v) => v.frontmatter.status === "archived").length,
    critical: vulnerabilities.filter((v) => ["IV", "V"].includes(v.frontmatter.level)).length,
  }

  const cards = [
    {
      title: "总漏洞数",
      value: stats.total,
      icon: Shield,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      percentage: 100,
    },
    {
      title: "未修复",
      value: stats.unresolved,
      icon: AlertTriangle,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-950/20",
      percentage: stats.total > 0 ? (stats.unresolved / stats.total) * 100 : 0,
    },
    {
      title: "已修复",
      value: stats.resolved,
      icon: CheckCircle,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      percentage: stats.total > 0 ? (stats.resolved / stats.total) * 100 : 0,
    },
    {
      title: "高危漏洞",
      value: stats.critical,
      icon: Clock,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
      percentage: stats.total > 0 ? (stats.critical / stats.total) * 100 : 0,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card
            key={card.title}
            className="stats-card hover:shadow-md transition-all duration-200 hover:-translate-y-1"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <AnimatedCounter value={card.value} duration={1.5} />
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                <div className={`w-2 h-2 rounded-full ${card.color.replace("text-", "bg-")}`} />
                <span>{card.percentage.toFixed(1)}% 占比</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
