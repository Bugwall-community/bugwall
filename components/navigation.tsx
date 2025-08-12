"use client"

import Link from "next/link"
import { Shield } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { GitHubContribute } from "@/components/github-contribute"

export function Navigation() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">漏洞追踪器</span>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                首页
              </Link>
              <Link
                href="/vulnerabilities"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                漏洞列表
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <GitHubContribute />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}
