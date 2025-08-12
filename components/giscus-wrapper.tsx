"use client"

import { GiscusComments } from "./giscus-comments"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"

interface GiscusWrapperProps {
  slug: string
}

export function GiscusWrapper({ slug }: GiscusWrapperProps) {
  const [debugMode, setDebugMode] = useState(false)

  const giscusConfig = {
    repo: process.env.NEXT_PUBLIC_GISCUS_REPO || "",
    repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID || "",
    category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY || "",
    categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || "",
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)
      setDebugMode(urlParams.get("debug") === "giscus")
    }
  }, [])

  const isConfigured =
    giscusConfig.repo &&
    giscusConfig.repoId &&
    giscusConfig.category &&
    giscusConfig.categoryId &&
    giscusConfig.repo !== "your-username/your-repo"

  // 如果没有配置giscus，显示配置提示
  if (!isConfigured) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            评论系统配置
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-muted-foreground">
              <p className="mb-2">评论系统需要配置 Giscus</p>
              <p className="text-sm">请按照以下步骤配置：</p>
            </div>

            <div className="text-left space-y-2 text-sm bg-muted/20 p-4 rounded-lg">
              <p className="font-medium mb-2">当前配置状态：</p>
              <div className="space-y-1 font-mono text-xs">
                <div className="flex justify-between">
                  <span>NEXT_PUBLIC_GISCUS_REPO:</span>
                  <span className={giscusConfig.repo ? "text-green-600" : "text-red-600"}>
                    {giscusConfig.repo || "未设置"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>NEXT_PUBLIC_GISCUS_REPO_ID:</span>
                  <span className={giscusConfig.repoId ? "text-green-600" : "text-red-600"}>
                    {giscusConfig.repoId ? "已设置" : "未设置"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>NEXT_PUBLIC_GISCUS_CATEGORY:</span>
                  <span className={giscusConfig.category ? "text-green-600" : "text-red-600"}>
                    {giscusConfig.category || "未设置"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>NEXT_PUBLIC_GISCUS_CATEGORY_ID:</span>
                  <span className={giscusConfig.categoryId ? "text-green-600" : "text-red-600"}>
                    {giscusConfig.categoryId ? "已设置" : "未设置"}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-left space-y-2 text-sm bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="font-medium text-blue-800 dark:text-blue-200">配置步骤：</p>
              <ol className="list-decimal list-inside space-y-1 text-blue-700 dark:text-blue-300">
                <li>
                  访问{" "}
                  <a
                    href="https://giscus.app"
                    className="underline hover:no-underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    giscus.app
                  </a>
                </li>
                <li>选择你的 GitHub 仓库并启用 Discussions</li>
                <li>获取配置信息并在 Vercel 项目设置中添加环境变量</li>
                <li>重新部署项目</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          评论讨论
          <button
            onClick={() => setDebugMode(!debugMode)}
            className="ml-auto text-xs text-muted-foreground hover:text-foreground"
          >
            {debugMode ? "隐藏调试" : "显示调试"}
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {debugMode && (
          <div className="mb-4 p-3 bg-muted/50 rounded-lg text-xs font-mono space-y-1">
            <div>Repo: {giscusConfig.repo}</div>
            <div>RepoId: {giscusConfig.repoId}</div>
            <div>Category: {giscusConfig.category}</div>
            <div>CategoryId: {giscusConfig.categoryId}</div>
            <div>Term: vulnerability-{slug}</div>
            <div>Mapping: specific</div>
          </div>
        )}

        <GiscusComments
          repo={giscusConfig.repo}
          repoId={giscusConfig.repoId}
          category={giscusConfig.category}
          categoryId={giscusConfig.categoryId}
          mapping="specific"
          term={`vulnerability-${slug}`}
          reactionsEnabled={true}
          emitMetadata={false}
          inputPosition="top"
          lang="zh-CN"
        />
      </CardContent>
    </Card>
  )
}
