"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { VulnerabilityCard } from "@/components/vulnerability-card"
import { searchVulnerabilities } from "@/lib/search"
import type { Vulnerability, FilterOptions } from "@/lib/types"
import { Search, X, CalendarIcon, Filter, SortAsc, SortDesc } from "lucide-react"
import { format, subDays, subMonths } from "date-fns"
import { zhCN } from "date-fns/locale"

interface SearchAndFilterProps {
  vulnerabilities: Vulnerability[]
  categories: string[]
  searchParams: {
    search?: string
    category?: string
    status?: string
    level?: string
    dateFrom?: string
    dateTo?: string
    sort?: string
  }
}

type SortOption = "date-desc" | "date-asc" | "level-desc" | "level-asc" | "title-asc" | "title-desc"

export function SearchAndFilter({ vulnerabilities, categories, searchParams }: SearchAndFilterProps) {
  const router = useRouter()
  const urlSearchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState(searchParams.search || "")
  const [sortBy, setSortBy] = useState<SortOption>((searchParams.sort as SortOption) || "date-desc")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    category: searchParams.category,
    status: searchParams.status as any,
    level: searchParams.level as any,
    dateFrom: searchParams.dateFrom,
    dateTo: searchParams.dateTo,
  })

  const datePresets = [
    { label: "最近7天", value: () => ({ from: subDays(new Date(), 7), to: new Date() }) },
    { label: "最近30天", value: () => ({ from: subDays(new Date(), 30), to: new Date() }) },
    { label: "最近3个月", value: () => ({ from: subMonths(new Date(), 3), to: new Date() }) },
    { label: "最近6个月", value: () => ({ from: subMonths(new Date(), 6), to: new Date() }) },
  ]

  const filteredAndSortedVulnerabilities = useMemo(() => {
    let result = vulnerabilities

    // Apply search
    if (searchQuery.trim()) {
      result = searchVulnerabilities(result, searchQuery)
    }

    // Apply filters
    if (filters.category) {
      result = result.filter((v) => v.frontmatter.category === filters.category)
    }

    if (filters.status) {
      result = result.filter((v) => v.frontmatter.status === filters.status)
    }

    if (filters.level) {
      result = result.filter((v) => v.frontmatter.level === filters.level)
    }

    if (filters.dateFrom) {
      result = result.filter((v) => v.frontmatter.discoveredAt >= filters.dateFrom!)
    }

    if (filters.dateTo) {
      result = result.filter((v) => v.frontmatter.discoveredAt <= filters.dateTo!)
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.frontmatter.discoveredAt).getTime() - new Date(a.frontmatter.discoveredAt).getTime()
        case "date-asc":
          return new Date(a.frontmatter.discoveredAt).getTime() - new Date(b.frontmatter.discoveredAt).getTime()
        case "level-desc":
          const levelOrder = { V: 5, IV: 4, III: 3, II: 2, I: 1 }
          return levelOrder[b.frontmatter.level] - levelOrder[a.frontmatter.level]
        case "level-asc":
          const levelOrderAsc = { V: 5, IV: 4, III: 3, II: 2, I: 1 }
          return levelOrderAsc[a.frontmatter.level] - levelOrderAsc[b.frontmatter.level]
        case "title-asc":
          return a.frontmatter.title.localeCompare(b.frontmatter.title, "zh-CN")
        case "title-desc":
          return b.frontmatter.title.localeCompare(a.frontmatter.title, "zh-CN")
        default:
          return 0
      }
    })

    return result
  }, [vulnerabilities, searchQuery, filters, sortBy])

  const updateURL = (newFilters: FilterOptions, newSearch?: string, newSort?: SortOption) => {
    const params = new URLSearchParams()

    if (newSearch?.trim()) {
      params.set("search", newSearch)
    }

    if (newSort && newSort !== "date-desc") {
      params.set("sort", newSort)
    }

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      }
    })

    const queryString = params.toString()
    router.push(`/vulnerabilities${queryString ? `?${queryString}` : ""}`)
  }

  const handleSearch = () => {
    updateURL(filters, searchQuery, sortBy)
  }

  const handleFilterChange = (key: keyof FilterOptions, value: string | undefined) => {
    const newFilters = { ...filters, [key]: value || undefined }
    setFilters(newFilters)
    updateURL(newFilters, searchQuery, sortBy)
  }

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort)
    updateURL(filters, searchQuery, newSort)
  }

  const handleDatePreset = (preset: { from: Date; to: Date }) => {
    const newFilters = {
      ...filters,
      dateFrom: format(preset.from, "yyyy-MM-dd"),
      dateTo: format(preset.to, "yyyy-MM-dd"),
    }
    setFilters(newFilters)
    updateURL(newFilters, searchQuery, sortBy)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setFilters({})
    setSortBy("date-desc")
    router.push("/vulnerabilities")
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length + (searchQuery ? 1 : 0)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== (searchParams.search || "")) {
        updateURL(filters, searchQuery, sortBy)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索漏洞ID、标题、描述、分类... (支持中文)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch}>搜索</Button>
          <Button
            variant="outline"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            高级筛选
          </Button>
        </div>

        {/* Basic Filters */}
        <div className="flex flex-wrap gap-4">
          <Select
            value={filters.category || "all"}
            onValueChange={(value) => handleFilterChange("category", value === "all" ? undefined : value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="选择分类" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有分类</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.status || "all"}
            onValueChange={(value) => handleFilterChange("status", value === "all" ? undefined : value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="选择状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有状态</SelectItem>
              <SelectItem value="unresolved">未修复</SelectItem>
              <SelectItem value="resolved">已修复</SelectItem>
              <SelectItem value="not-applicable">不适用</SelectItem>
              <SelectItem value="archived">已归档</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.level || "all"}
            onValueChange={(value) => handleFilterChange("level", value === "all" ? undefined : value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="选择等级" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有等级</SelectItem>
              <SelectItem value="V">等级 V (最高)</SelectItem>
              <SelectItem value="IV">等级 IV</SelectItem>
              <SelectItem value="III">等级 III</SelectItem>
              <SelectItem value="II">等级 II</SelectItem>
              <SelectItem value="I">等级 I (最低)</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="排序方式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">
                <div className="flex items-center gap-2">
                  <SortDesc className="h-3 w-3" />
                  最新发现
                </div>
              </SelectItem>
              <SelectItem value="date-asc">
                <div className="flex items-center gap-2">
                  <SortAsc className="h-3 w-3" />
                  最早发现
                </div>
              </SelectItem>
              <SelectItem value="level-desc">等级从高到低</SelectItem>
              <SelectItem value="level-asc">等级从低到高</SelectItem>
              <SelectItem value="title-asc">标题 A-Z</SelectItem>
              <SelectItem value="title-desc">标题 Z-A</SelectItem>
            </SelectContent>
          </Select>

          {activeFiltersCount > 0 && (
            <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2 bg-transparent">
              <X className="h-4 w-4" />
              清除筛选 ({activeFiltersCount})
            </Button>
          )}
        </div>

        {showAdvancedFilters && (
          <div className="p-4 border rounded-lg bg-muted/20 space-y-4">
            <h3 className="font-medium">高级筛选选项</h3>

            {/* 日期范围筛选 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">发现时间范围</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {datePresets.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="outline"
                    size="sm"
                    onClick={() => handleDatePreset(preset.value())}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>

              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[200px] justify-start text-left font-normal bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateFrom
                        ? format(new Date(filters.dateFrom), "yyyy年MM月dd日", { locale: zhCN })
                        : "开始日期"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateFrom ? new Date(filters.dateFrom) : undefined}
                      onSelect={(date) => handleFilterChange("dateFrom", date ? format(date, "yyyy-MM-dd") : undefined)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[200px] justify-start text-left font-normal bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateTo
                        ? format(new Date(filters.dateTo), "yyyy年MM月dd日", { locale: zhCN })
                        : "结束日期"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateTo ? new Date(filters.dateTo) : undefined}
                      onSelect={(date) => handleFilterChange("dateTo", date ? format(date, "yyyy-MM-dd") : undefined)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            显示 {filteredAndSortedVulnerabilities.length} 个结果
            {searchQuery && (
              <span className="ml-2">
                搜索: "<span className="font-medium">{searchQuery}</span>"
              </span>
            )}
          </p>
        </div>

        {filteredAndSortedVulnerabilities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedVulnerabilities.map((vulnerability) => (
              <VulnerabilityCard key={vulnerability.slug} vulnerability={vulnerability} searchTerm={searchQuery} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold mb-2">未找到匹配的漏洞</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? `没有找到包含 "${searchQuery}" 的漏洞` : "尝试调整搜索条件或清除筛选器"}
            </p>
            <Button variant="outline" onClick={clearFilters}>
              清除所有筛选
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
