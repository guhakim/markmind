"use client"

import { useState } from "react"
import { ExternalLink, Bell, Trash2, Edit3 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Bookmark } from "@/lib/types"

interface BookmarkCardProps {
  bookmark: Bookmark
  onDelete: (id: string) => void
  onEdit: (bookmark: Bookmark) => void
}

function getFaviconUrl(url: string) {
  try {
    const { hostname } = new URL(url.startsWith("http") ? url : `https://${url}`)
    return `https://www.google.com/s2/favicons?sz=64&domain_url=https://${hostname}`
  } catch {
    return null
  }
}

export function BookmarkCard({ bookmark, onDelete, onEdit }: BookmarkCardProps) {
  const [faviconError, setFaviconError] = useState(false)
  const faviconUrl = getFaviconUrl(bookmark.url)

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "쇼핑": "bg-pink-500/20 text-pink-400 border-pink-500/30",
      "기술": "bg-blue-500/20 text-blue-400 border-blue-500/30",
      "뉴스": "bg-orange-500/20 text-orange-400 border-orange-500/30",
      "엔터테인먼트": "bg-purple-500/20 text-purple-400 border-purple-500/30",
      "교육": "bg-green-500/20 text-green-400 border-green-500/30",
      "비즈니스": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      "소셜": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      "기타": "bg-gray-500/20 text-gray-400 border-gray-500/30",
    }
    return colors[category] || colors["기타"]
  }

  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* 파비콘 */}
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-secondary flex items-center justify-center overflow-hidden">
            {faviconUrl && !faviconError ? (
              <img
                src={faviconUrl}
                alt=""
                className="w-6 h-6 object-contain"
                onError={() => setFaviconError(true)}
              />
            ) : (
              <span className="text-lg font-bold text-muted-foreground">
                {bookmark.title.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          
          {/* 콘텐츠 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate text-sm">
                  {bookmark.title}
                </h3>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {bookmark.url}
                </p>
              </div>
              
              {/* 알림 배지 */}
              {bookmark.notifications > 0 && (
                <div className="relative flex-shrink-0">
                  <Bell className="w-4 h-4 text-muted-foreground" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                    {bookmark.notifications > 9 ? "9+" : bookmark.notifications}
                  </span>
                </div>
              )}
            </div>
            
            {/* 설명 */}
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
              {bookmark.description}
            </p>
            
            {/* 카테고리 & 태그 */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <Badge 
                variant="outline" 
                className={`text-[10px] px-2 py-0.5 ${getCategoryColor(bookmark.category)}`}
              >
                {bookmark.category}
              </Badge>
              {bookmark.tags.slice(0, 2).map((tag) => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="text-[10px] px-2 py-0.5 bg-secondary/50"
                >
                  {tag}
                </Badge>
              ))}
              {bookmark.tags.length > 2 && (
                <span className="text-[10px] text-muted-foreground">
                  +{bookmark.tags.length - 2}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* 액션 버튼들 (호버 시 표시) */}
        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7 bg-secondary/80 hover:bg-secondary"
            onClick={() => onEdit(bookmark)}
          >
            <Edit3 className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7 bg-secondary/80 hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => onDelete(bookmark.id)}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7 bg-secondary/80 hover:bg-primary hover:text-primary-foreground"
            asChild
          >
            <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3 h-3" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
