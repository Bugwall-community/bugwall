"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

interface GiscusCommentsProps {
  repo: string
  repoId: string
  category: string
  categoryId: string
  mapping?: string
  term?: string
  reactionsEnabled?: boolean
  emitMetadata?: boolean
  inputPosition?: "top" | "bottom"
  lang?: string
}

export function GiscusComments({
  repo,
  repoId,
  category,
  categoryId,
  mapping = "pathname",
  term,
  reactionsEnabled = true,
  emitMetadata = false,
  inputPosition = "bottom",
  lang = "zh-CN",
}: GiscusCommentsProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!ref.current) return

    ref.current.innerHTML = ""
    setIsLoading(true)
    setError(null)

    const scriptElem = document.createElement("script")
    scriptElem.src = "https://giscus.app/client.js"
    scriptElem.async = true
    scriptElem.crossOrigin = "anonymous"

    scriptElem.setAttribute("data-repo", repo)
    scriptElem.setAttribute("data-repo-id", repoId)
    scriptElem.setAttribute("data-category", category)
    scriptElem.setAttribute("data-category-id", categoryId)
    scriptElem.setAttribute("data-mapping", mapping)
    if (term) scriptElem.setAttribute("data-term", term)
    scriptElem.setAttribute("data-strict", "0")
    scriptElem.setAttribute("data-reactions-enabled", reactionsEnabled ? "1" : "0")
    scriptElem.setAttribute("data-emit-metadata", emitMetadata ? "1" : "0")
    scriptElem.setAttribute("data-input-position", inputPosition)
    scriptElem.setAttribute("data-theme", resolvedTheme === "dark" ? "dark" : "light")
    scriptElem.setAttribute("data-lang", lang)
    scriptElem.setAttribute("data-loading", "lazy")

    scriptElem.onload = () => {
      setIsLoading(false)
    }

    scriptElem.onerror = () => {
      setError("评论系统加载失败，请检查网络连接")
      setIsLoading(false)
    }

    ref.current.appendChild(scriptElem)

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://giscus.app") return

      if (event.data.giscus?.discussion) {
        setIsLoading(false)
      }

      if (event.data.giscus?.error) {
        setError(`Giscus错误: ${event.data.giscus.error}`)
        setIsLoading(false)
      }
    }

    window.addEventListener("message", handleMessage)

    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [
    repo,
    repoId,
    category,
    categoryId,
    mapping,
    term,
    reactionsEnabled,
    emitMetadata,
    inputPosition,
    lang,
    resolvedTheme,
  ])

  useEffect(() => {
    const iframe = document.querySelector<HTMLIFrameElement>("iframe.giscus-frame")
    if (!iframe) return

    const theme = resolvedTheme === "dark" ? "dark" : "light"
    iframe.contentWindow?.postMessage(
      {
        giscus: {
          setConfig: {
            theme: theme,
          },
        },
      },
      "https://giscus.app",
    )
  }, [resolvedTheme])

  return (
    <div className="space-y-4">
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-muted-foreground">加载评论系统...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-red-700 dark:text-red-300">{error}</span>
          </div>
        </div>
      )}

      <div ref={ref} />
    </div>
  )
}
