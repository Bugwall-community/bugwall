import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { VulnerabilityFrontmatter } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLevelColor(level: VulnerabilityFrontmatter["level"]): string {
  const colors = {
    I: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    II: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    III: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    IV: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    V: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  }
  return colors[level] || colors["I"]
}

export function getStatusColor(status: VulnerabilityFrontmatter["status"]): string {
  const colors = {
    unresolved: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    resolved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    "not-applicable": "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    archived: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  }
  return colors[status] || colors["unresolved"]
}

export function getStatusText(status: VulnerabilityFrontmatter["status"]): string {
  const texts = {
    unresolved: "未修复",
    resolved: "已修复",
    "not-applicable": "不适用",
    archived: "已归档",
  }
  return texts[status] || "未知"
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
