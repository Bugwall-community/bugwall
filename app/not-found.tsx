"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Home, Search, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
            <h2 className="text-2xl font-semibold">页面未找到</h2>
            <p className="text-muted-foreground">抱歉，您访问的页面不存在或已被移动。</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                返回首页
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/vulnerabilities">
                <Search className="mr-2 h-4 w-4" />
                浏览漏洞
              </Link>
            </Button>
          </div>

          <div className="pt-8 border-t">
            <p className="text-sm text-muted-foreground mb-4">如果您认为这是一个错误，请检查URL是否正确。</p>
            <Button variant="ghost" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回上一页
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
