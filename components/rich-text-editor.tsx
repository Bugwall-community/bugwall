"use client"

import type React from "react"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import Mathematics from "@tiptap/extension-mathematics"
import Placeholder from "@tiptap/extension-placeholder"
import { createLowlight } from "lowlight"
import { Button } from "@/components/ui/button"
import {
  Bold,
  Italic,
  Code,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Eye,
  EyeOff,
} from "lucide-react"
import { useState } from "react"
import { processMarkdownClient } from "@/lib/client-markdown"

// 创建lowlight实例
const lowlight = createLowlight()

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "开始编写漏洞描述...",
  className = "",
}: RichTextEditorProps) {
  const [showPreview, setShowPreview] = useState(false)
  const [previewContent, setPreviewContent] = useState("")

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // 禁用默认的代码块，使用lowlight版本
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: "plaintext",
      }),
      Mathematics,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const markdown = editor.getHTML()
      onChange(markdown)
    },
  })

  const handlePreview = async () => {
    if (!showPreview && content) {
      try {
        const processed = await processMarkdownClient(content)
        setPreviewContent(processed)
      } catch (error) {
        console.error("Preview error:", error)
        setPreviewContent("<p>预览生成失败</p>")
      }
    }
    setShowPreview(!showPreview)
  }

  if (!editor) {
    return null
  }

  const ToolbarButton = ({
    onClick,
    isActive = false,
    disabled = false,
    children,
  }: {
    onClick: () => void
    isActive?: boolean
    disabled?: boolean
    children: React.ReactNode
  }) => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={`h-8 w-8 p-0 ${isActive ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300" : ""}`}
    >
      {children}
    </Button>
  )

  return (
    <div className={`border border-gray-200 dark:border-gray-700 rounded-md ${className}`}>
      {/* 工具栏 */}
      <div className="editor-toolbar">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive("bold")}>
          <Bold className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive("italic")}>
          <Italic className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} isActive={editor.isActive("code")}>
          <Code className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive("heading", { level: 1 })}
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive("heading", { level: 3 })}
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
        >
          <List className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Undo className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Redo className="h-4 w-4" />
        </ToolbarButton>

        <div className="flex-1" />

        <ToolbarButton onClick={handlePreview} isActive={showPreview}>
          {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </ToolbarButton>
      </div>

      {/* 编辑器内容 */}
      <div className="relative">
        {!showPreview ? (
          <EditorContent editor={editor} />
        ) : (
          <div
            className="markdown-content p-4 min-h-[200px] bg-white dark:bg-gray-900"
            dangerouslySetInnerHTML={{ __html: previewContent }}
          />
        )}
      </div>

      {/* 帮助提示 */}
      <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-b-md">
        支持 Markdown 语法、LaTeX 数学公式 ($formula$) 和代码高亮
      </div>
    </div>
  )
}
