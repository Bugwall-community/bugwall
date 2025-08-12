import Fuse from "fuse.js"
import type { Vulnerability } from "./types"

export function createSearchIndex(vulnerabilities: Vulnerability[]) {
  const options = {
    keys: [
      { name: "frontmatter.id", weight: 0.3 },
      { name: "frontmatter.title", weight: 0.4 },
      { name: "frontmatter.description", weight: 0.2 },
      { name: "frontmatter.category", weight: 0.15 },
      { name: "frontmatter.tags", weight: 0.1 },
      { name: "content", weight: 0.05 },
    ],
    threshold: 0.4,
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 1,
    ignoreLocation: true,
    ignoreFieldNorm: true,
    useExtendedSearch: true,
  }

  return new Fuse(vulnerabilities, options)
}

export function searchVulnerabilities(vulnerabilities: Vulnerability[], query: string): Vulnerability[] {
  if (!query.trim()) {
    return vulnerabilities
  }

  const trimmedQuery = query.trim()

  // 如果查询看起来像ID（包含VUL-或类似格式），优先进行ID搜索
  if (/^[A-Z]+-\d+/i.test(trimmedQuery)) {
    const idMatches = vulnerabilities.filter((v) => v.frontmatter.id.toLowerCase().includes(trimmedQuery.toLowerCase()))
    if (idMatches.length > 0) {
      return idMatches
    }
  }

  const fuse = createSearchIndex(vulnerabilities)
  const results = fuse.search(trimmedQuery)

  return results.map((result) => result.item)
}

export function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm.trim()) return text

  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>')
}
