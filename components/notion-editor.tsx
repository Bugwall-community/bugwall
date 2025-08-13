"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Bold, Italic, Code, List, ListOrdered, Quote, Heading1, Heading2, Heading3, Eye, EyeOff } from "lucide-react"
import { processMarkdownClient } from "@/lib/client-markdown"

interface NotionEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function NotionEditor({ value, onChange, placeholder = "开始输入...", className = "" }: NotionEditorProps) {
  const [content, setContent] = useState(value)
  const [isPreview, setIsPreview] = useState(false)
  const [previewHtml, setPreviewHtml] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [cursorPosition, setCursorPosition] = useState(0)

  useEffect(() => {
    setContent(value)
  }, [value])

  useEffect(() => {
    if (isPreview) {
      processMarkdownClient(content).then(setPreviewHtml)
    }
  }, [content, isPreview])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    const cursorPos = e.target.selectionStart

    // Handle markdown shortcuts
    const processedValue = handleMarkdownShortcuts(newValue, cursorPos)

    setContent(processedValue.content)
    onChange(processedValue.content)

    // Restore cursor position if it changed
    if (processedValue.newCursorPos !== cursorPos) {
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.setSelectionRange(processedValue.newCursorPos, processedValue.newCursorPos)
        }
      }, 0)
    }
  }

  const handleMarkdownShortcuts = (text: string, cursorPos: number) => {
    const lines = text.split("\n")
    const currentLineIndex = text.substring(0, cursorPos).split("\n").length - 1
    const currentLine = lines[currentLineIndex]
    const lineStart = text.substring(0, cursorPos).lastIndexOf("\n") + 1

    // Handle heading shortcuts
    if (currentLine.match(/^#{1,6}\s$/)) {
      const headingLevel = currentLine.match(/^(#{1,6})\s$/)?.[1] || "#"
      const newLine = `${headingLevel} `
      lines[currentLineIndex] = newLine
      const newContent = lines.join("\n")
      return {
        content: newContent,
        newCursorPos: lineStart + newLine.length,
      }
    }

    // Handle list shortcuts
    if (currentLine === "- " || currentLine === "* ") {
      lines[currentLineIndex] = "- "
      const newContent = lines.join("\n")
      return {
        content: newContent,
        newCursorPos: lineStart + 2,
      }
    }

    // Handle numbered list shortcuts
    if (currentLine.match(/^\d+\.\s$/)) {
      const newContent = lines.join("\n")
      return {
        content: newContent,
        newCursorPos: cursorPos,
      }
    }

    // Handle blockquote shortcuts
    if (currentLine === "> ") {
      lines[currentLineIndex] = "> "
      const newContent = lines.join("\n")
      return {
        content: newContent,
        newCursorPos: lineStart + 2,
      }
    }

    // Handle code block shortcuts
    if (currentLine === "```") {
      lines[currentLineIndex] = "```\n\n```"
      const newContent = lines.join("\n")
      return {
        content: newContent,
        newCursorPos: lineStart + 4,
      }
    }

    return {
      content: text,
      newCursorPos: cursorPos,
    }
  }

  const insertMarkdown = (before: string, after = "") => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)

    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end)
    setContent(newText)
    onChange(newText)

    // Set cursor position after the inserted text
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + before.length + selectedText.length + after.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle Tab for indentation
    if (e.key === "Tab") {
      e.preventDefault()
      insertMarkdown("  ")
    }

    // Handle Ctrl/Cmd shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "b":
          e.preventDefault()
          insertMarkdown("**", "**")
          break
        case "i":
          e.preventDefault()
          insertMarkdown("*", "*")
          break
        case "k":
          e.preventDefault()
          insertMarkdown("[", "](url)")
          break
        case "`":
          e.preventDefault()
          insertMarkdown("`", "`")
          break
      }
    }
  }

  return (
    <div className={`border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => insertMarkdown("# ")} className="h-8 w-8 p-0">
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => insertMarkdown("## ")} className="h-8 w-8 p-0">
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => insertMarkdown("### ")} className="h-8 w-8 p-0">
            <Heading3 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => insertMarkdown("**", "**")} className="h-8 w-8 p-0 ml-2">
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => insertMarkdown("*", "*")} className="h-8 w-8 p-0">
            <Italic className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => insertMarkdown("`", "`")} className="h-8 w-8 p-0">
            <Code className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => insertMarkdown("- ")} className="h-8 w-8 p-0 ml-2">
            <List className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => insertMarkdown("1. ")} className="h-8 w-8 p-0">
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => insertMarkdown("> ")} className="h-8 w-8 p-0">
            <Quote className="h-4 w-4" />
          </Button>
        </div>

        <Button variant="ghost" size="sm" onClick={() => setIsPreview(!isPreview)} className="h-8 px-3">
          {isPreview ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
          {isPreview ? "编辑" : "预览"}
        </Button>
      </div>

      {/* Editor/Preview Area */}
      <div className="relative">
        {isPreview ? (
          <div
            className="p-4 min-h-[300px] prose prose-gray dark:prose-invert max-w-none markdown-content"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        ) : (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full min-h-[300px] p-4 bg-transparent border-none outline-none resize-none font-mono text-sm leading-relaxed"
            style={{
              fontFamily:
                'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            }}
          />
        )}
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <span>
            {content.length} 字符 | {content.split("\n").length} 行
          </span>
          <span className="text-gray-400 dark:text-gray-500">
            支持 Markdown 语法 | 快捷键: Ctrl+B (粗体), Ctrl+I (斜体), Ctrl+K (链接)
          </span>
        </div>
      </div>
    </div>
  )
}
