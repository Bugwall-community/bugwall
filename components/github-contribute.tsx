"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Github, Plus, ExternalLink } from "lucide-react"
import { toast } from "sonner"

interface VulnerabilityForm {
  id: string
  title: string
  description: string
  level: "I" | "II" | "III" | "IV" | "V"
  category: string
  tags: string[]
  discoveredAt: string
}

export function GitHubContribute() {
  const [form, setForm] = useState<VulnerabilityForm>({
    id: "",
    title: "",
    description: "",
    level: "I",
    category: "",
    tags: [],
    discoveredAt: new Date().toISOString().split("T")[0],
  })
  const [tagInput, setTagInput] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }))
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const generateMarkdown = () => {
    return `---
id: "${form.id}"
title: "${form.title}"
description: "${form.description}"
level: "${form.level}"
status: "unresolved"
category: "${form.category}"
tags: [${form.tags.map((tag) => `"${tag}"`).join(", ")}]
discoveredAt: "${form.discoveredAt}"
---

# ${form.title}

## 漏洞描述

${form.description}

## 影响范围

请描述此漏洞的影响范围...

## 复现步骤

1. 步骤一
2. 步骤二
3. 步骤三

## 修复建议

请提供修复建议...

## 参考链接

- [相关链接1](https://example.com)
- [相关链接2](https://example.com)
`
  }

  const handleSubmitToGitHub = () => {
    const markdown = generateMarkdown()
    const filename = `${form.id.toLowerCase().replace(/[^a-z0-9]/g, "-")}.md`

    // 创建GitHub issue的URL
    const issueTitle = `新漏洞提交: ${form.title}`
    const issueBody = `## 漏洞信息

**ID**: ${form.id}
**等级**: ${form.level}
**分类**: ${form.category}
**标签**: ${form.tags.join(", ")}

## 建议的文件名
\`bugs/${filename}\`

## Markdown内容
\`\`\`markdown
${markdown}
\`\`\`

请将此内容保存为 \`bugs/${filename}\` 文件。`

    const githubUrl = `https://github.com/Bugwall-community/bugwall/issues/new?title=${encodeURIComponent(issueTitle)}&body=${encodeURIComponent(issueBody)}`

    window.open(githubUrl, "_blank")
    toast.success("已打开GitHub，请在仓库中创建Issue")
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Github className="h-4 w-4" />
          贡献漏洞
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            向GitHub贡献漏洞
          </DialogTitle>
          <DialogDescription>
            填写漏洞信息，我们将生成标准格式的Markdown文件，您可以通过GitHub Issue提交。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="id">漏洞ID *</Label>
              <Input
                id="id"
                placeholder="例如: CVE-2024-001"
                value={form.id}
                onChange={(e) => setForm((prev) => ({ ...prev, id: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="level">等级 *</Label>
              <Select value={form.level} onValueChange={(value: any) => setForm((prev) => ({ ...prev, level: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="I">I级 (最低)</SelectItem>
                  <SelectItem value="II">II级 (低)</SelectItem>
                  <SelectItem value="III">III级 (中)</SelectItem>
                  <SelectItem value="IV">IV级 (高)</SelectItem>
                  <SelectItem value="V">V级 (最高)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">漏洞标题 *</Label>
            <Input
              id="title"
              placeholder="例如: SQL注入漏洞"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">漏洞描述 *</Label>
            <Textarea
              id="description"
              placeholder="详细描述漏洞的具体情况..."
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">分类 *</Label>
              <Input
                id="category"
                placeholder="例如: Web安全"
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discoveredAt">发现时间</Label>
              <Input
                id="discoveredAt"
                type="date"
                value={form.discoveredAt}
                onChange={(e) => setForm((prev) => ({ ...prev, discoveredAt: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>标签</Label>
            <div className="flex gap-2">
              <Input
                placeholder="添加标签..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              />
              <Button type="button" variant="outline" size="sm" onClick={addTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {form.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                    {tag} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              取消
            </Button>
            <Button
              onClick={handleSubmitToGitHub}
              disabled={!form.id || !form.title || !form.description || !form.category}
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              提交到GitHub
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
