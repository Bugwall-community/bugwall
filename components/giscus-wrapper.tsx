"use client"

import { GiscusComments } from "./giscus-comments"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle } from "lucide-react"

interface GiscusWrapperProps {
  slug: string
}

export function GiscusWrapper({ slug }: GiscusWrapperProps) {
  // 这些配置需要用户在GitHub上设置giscus后获得
  // 用户需要在项目设置中配置这些值
  const giscusConfig = {
    repo: process.env.NEXT_PUBLIC_GISCUS_REPO || "your-username/your-repo",
    repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID || "",
    category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY || "General",
    categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || "",
  }

  // 如果没有配置giscus，显示配置提示
  if (!giscusConfig.repoId || !giscusConfig.categoryId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            评论系统
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 space-y-4">
            <div className="text-muted-foreground">
              <p className="mb-2">评论系统尚未配置</p>
              <p className="text-sm">请按照以下步骤配置 Giscus 评论系统：</p>
            </div>
            <div className="text-left space-y-2 text-sm bg-muted/20 p-4 rounded-lg">
              <p>
                1. 访问{" "}
                <a
                  href="https://giscus.app"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  giscus.app
                </a>
              </p>
              <p>2. 按照指引配置你的 GitHub 仓库</p>
              <p>3. 获取配置信息并添加到环境变量：</p>
              <ul className="list-disc list-inside ml-4 space-y-1 font-mono text-xs">
                <li>NEXT_PUBLIC_GISCUS_REPO</li>
                <li>NEXT_PUBLIC_GISCUS_REPO_ID</li>
                <li>NEXT_PUBLIC_GISCUS_CATEGORY</li>
                <li>NEXT_PUBLIC_GISCUS_CATEGORY_ID</li>
              </ul>
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
        </CardTitle>
      </CardHeader>
      <CardContent>
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
