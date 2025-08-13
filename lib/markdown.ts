import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkMath from "remark-math"
import remarkGfm from "remark-gfm"
import remarkRehype from "remark-rehype"
import rehypeKatex from "rehype-katex"
import rehypeHighlight from "rehype-highlight"
import rehypeStringify from "rehype-stringify"
import type { Vulnerability, VulnerabilityFrontmatter } from "./types"

const bugsDirectory = path.join(process.cwd(), "bugs")

export async function getAllVulnerabilities(): Promise<Vulnerability[]> {
  // Create bugs directory if it doesn't exist
  if (!fs.existsSync(bugsDirectory)) {
    fs.mkdirSync(bugsDirectory, { recursive: true })
    return []
  }

  const fileNames = fs.readdirSync(bugsDirectory)
  const markdownFiles = fileNames.filter((name) => name.endsWith(".md"))

  const vulnerabilities = await Promise.all(
    markdownFiles.map(async (fileName) => {
      const slug = fileName.replace(/\.md$/, "")
      return await getVulnerabilityBySlug(slug)
    }),
  )

  // Sort by discovered date (newest first)
  return vulnerabilities
    .filter((v) => v !== null)
    .sort((a, b) => new Date(b.frontmatter.discoveredAt).getTime() - new Date(a.frontmatter.discoveredAt).getTime())
}

export async function getVulnerabilityBySlug(slug: string): Promise<Vulnerability | null> {
  try {
    const fullPath = path.join(bugsDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data, content } = matter(fileContents)

    // Process markdown content
    const processedContent = await unified()
      .use(remarkParse) // Parse markdown
      .use(remarkGfm) // GitHub flavored markdown
      .use(remarkMath) // Math support
      .use(remarkRehype, { allowDangerousHtml: true }) // Convert to HTML AST
      .use(rehypeKatex) // Process LaTeX math
      .use(rehypeHighlight, {
        detect: true,
        subset: false,
        ignoreMissing: true,
      }) // Syntax highlighting
      .use(rehypeStringify, { allowDangerousHtml: true }) // Convert to HTML string
      .process(content)

    const htmlContent = processedContent.toString()

    return {
      slug,
      frontmatter: data as VulnerabilityFrontmatter,
      content,
      htmlContent,
    }
  } catch (error) {
    console.error(`Error reading vulnerability ${slug}:`, error)
    return null
  }
}

export async function processMarkdown(content: string): Promise<string> {
  try {
    const processedContent = await unified()
      .use(remarkParse) // Parse markdown
      .use(remarkGfm) // GitHub flavored markdown
      .use(remarkMath) // Math support
      .use(remarkRehype, { allowDangerousHtml: true }) // Convert to HTML AST
      .use(rehypeKatex) // Process LaTeX math
      .use(rehypeHighlight, {
        detect: true,
        subset: false,
        ignoreMissing: true,
      }) // Syntax highlighting
      .use(rehypeStringify, { allowDangerousHtml: true }) // Convert to HTML string
      .process(content)

    return processedContent.toString()
  } catch (error) {
    console.error("Error processing markdown:", error)
    return `<p>处理Markdown时出错: ${error}</p>`
  }
}

export function getCategories(): string[] {
  if (!fs.existsSync(bugsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(bugsDirectory)
  const markdownFiles = fileNames.filter((name) => name.endsWith(".md"))

  const categories = new Set<string>()

  markdownFiles.forEach((fileName) => {
    try {
      const fullPath = path.join(bugsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, "utf8")
      const { data } = matter(fileContents)
      if (data.category) {
        categories.add(data.category)
      }
    } catch (error) {
      console.error(`Error reading file ${fileName}:`, error)
    }
  })

  return Array.from(categories).sort()
}
