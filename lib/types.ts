export interface VulnerabilityFrontmatter {
  id: string
  title: string
  status: "unresolved" | "resolved" | "not-applicable" | "archived"
  level: "I" | "II" | "III" | "IV" | "V"
  discoveredAt: string
  category: string
  description?: string
  tags?: string[]
}

export interface Vulnerability {
  slug: string
  frontmatter: VulnerabilityFrontmatter
  content: string
  htmlContent: string
}

export interface FilterOptions {
  category?: string
  status?: VulnerabilityFrontmatter["status"]
  level?: VulnerabilityFrontmatter["level"]
  dateFrom?: string
  dateTo?: string
  search?: string
}
