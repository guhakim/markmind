"use client"

import { useState, useMemo } from "react"
import { CategorySidebar, CATEGORIES } from "@/components/category-sidebar"
import { BookmarkCard } from "@/components/bookmark-card"
import { Header } from "@/components/header"
import { AddBookmarkDialog } from "@/components/add-bookmark-dialog"
import { Button } from "@/components/ui/button"
import { Plus, Sparkles } from "lucide-react"
import { SAMPLE_BOOKMARKS, type Bookmark } from "@/lib/types"
import { cn } from "@/lib/utils"

export default function Home() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(SAMPLE_BOOKMARKS)
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter((bookmark) => {
      if (activeCategory !== "all" && bookmark.category !== activeCategory) return false
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        return (
          bookmark.title.toLowerCase().includes(query) ||
          bookmark.description.toLowerCase().includes(query) ||
          bookmark.tags.some(tag => tag.toLowerCase().includes(query)) ||
          bookmark.url.toLowerCase().includes(query)
        )
      }
      return true
    })
  }, [bookmarks, activeCategory, searchQuery])

  const totalNotifications = useMemo(
    () => bookmarks.reduce((sum, b) => sum + b.notifications, 0),
    [bookmarks]
  )

  const handleAddBookmark = (bookmark: Bookmark) => {
    setBookmarks(prev => [bookmark, ...prev])
  }

  const handleDeleteBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id))
  }

  const handleEditBookmark = (bookmark: Bookmark) => {
    console.log("Edit bookmark:", bookmark)
  }

  return (
    <div className="flex h-dvh bg-background overflow-hidden">
      {/* 사이드바 — 태블릿(md) 이상에서 표시 */}
      <div className="hidden md:flex">
        <CategorySidebar
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          bookmarks={bookmarks}
        />
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddBookmark={handleAddBookmark}
          totalNotifications={totalNotifications}
        />

        {/* 모바일 카테고리 칩 */}
        <div className="md:hidden flex gap-2 overflow-x-auto px-3 py-2.5 border-b border-border scrollbar-hide shrink-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors touch-manipulation",
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* 콘텐츠 영역 */}
        <main className="flex-1 overflow-y-auto overscroll-contain p-3 md:p-6">
          <div className="mb-4 md:mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-foreground">
              {activeCategory === "all" ? "모든 북마크" : activeCategory}
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              {filteredBookmarks.length}개의 북마크
              {searchQuery && ` • "${searchQuery}" 검색 결과`}
            </p>
          </div>

          {filteredBookmarks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
              {filteredBookmarks.map((bookmark) => (
                <BookmarkCard
                  key={bookmark.id}
                  bookmark={bookmark}
                  onDelete={handleDeleteBookmark}
                  onEdit={handleEditBookmark}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">북마크가 없습니다</h3>
              <p className="text-sm text-muted-foreground max-w-sm mb-6">
                {searchQuery
                  ? `"${searchQuery}"에 대한 검색 결과가 없습니다`
                  : "새로운 북마크를 추가하면 AI가 자동으로 분석하여 정리해 드립니다"
                }
              </p>
              {!searchQuery && <AddBookmarkDialog onAdd={handleAddBookmark} />}
            </div>
          )}

          {/* 모바일 FAB 아래 여백 */}
          <div className="h-24 sm:hidden" />
        </main>
      </div>

      {/* 모바일 FAB */}
      <MobileFAB onAdd={handleAddBookmark} />
    </div>
  )
}

function MobileFAB({ onAdd }: { onAdd: (bookmark: Bookmark) => void }) {
  return (
    <div className="fixed bottom-6 right-4 sm:hidden z-30" style={{ bottom: "max(1.5rem, env(safe-area-inset-bottom, 1.5rem))" }}>
      <AddBookmarkDialog
        onAdd={onAdd}
        trigger={
          <Button
            size="icon"
            className="w-14 h-14 rounded-full shadow-lg shadow-primary/25 touch-manipulation"
          >
            <Plus className="w-6 h-6" />
          </Button>
        }
      />
    </div>
  )
}
