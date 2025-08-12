"use client"

import { useEffect, useRef } from "react"
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

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return

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

    ref.current.appendChild(scriptElem)
  }, [repo, repoId, category, categoryId, mapping, term, reactionsEnabled, emitMetadata, inputPosition, lang])

  // Update theme when it changes
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

  return <div ref={ref} />
}
