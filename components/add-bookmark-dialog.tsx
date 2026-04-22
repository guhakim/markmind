"use client"

import { useState } from "react"
import { Plus, Sparkles, Loader2, Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Bookmark } from "@/lib/types"

interface AddBookmarkDialogProps {
  onAdd: (bookmark: Bookmark) => void
  trigger?: React.ReactNode
}

export function AddBookmarkDialog({ onAdd, trigger }: AddBookmarkDialogProps) {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzed, setAnalyzed] = useState<Partial<Bookmark> | null>(null)

  const handleAnalyze = async () => {
    if (!url.trim()) return
    
    setIsAnalyzing(true)
    
    // AI 분석 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // URL에서 도메인 추출
    let domain = ""
    try {
      domain = new URL(url).hostname.replace("www.", "")
    } catch {
      domain = url
    }
    
    // 샘플 AI 분석 결과
    const mockAnalysis: Record<string, Partial<Bookmark>> = {
      "coupang.com": {
        title: "쿠팡",
        description: "로켓배송으로 유명한 대한민국 최대 이커머스 플랫폼. 생필품부터 전자제품까지 다양한 상품을 빠르게 배송받을 수 있습니다.",
        category: "쇼핑",
        tags: ["이커머스", "로켓배송", "온라인쇼핑"],
      },
      "github.com": {
        title: "GitHub",
        description: "전 세계 개발자들이 사용하는 코드 호스팅 플랫폼. 오픈소스 프로젝트 협업과 버전 관리에 필수적인 서비스입니다.",
        category: "기술",
        tags: ["개발", "오픈소스", "Git"],
      },
      "netflix.com": {
        title: "Netflix",
        description: "전 세계 최대 스트리밍 서비스. 영화, 드라마, 다큐멘터리 등 다양한 오리지널 콘텐츠를 제공합니다.",
        category: "엔터테인먼트",
        tags: ["스트리밍", "영화", "드라마"],
      },
    }
    
    const result = mockAnalysis[domain] || {
      title: domain.split(".")[0].charAt(0).toUpperCase() + domain.split(".")[0].slice(1),
      description: `${domain}에서 제공하는 서비스입니다. AI가 사이트를 분석하여 정보를 자동으로 추출했습니다.`,
      category: "기타",
      tags: ["웹사이트"],
    }
    
    setAnalyzed(result)
    setIsAnalyzing(false)
  }

  const handleSave = () => {
    if (!analyzed) return
    
    const newBookmark: Bookmark = {
      id: Date.now().toString(),
      url: url.startsWith("http") ? url : `https://${url}`,
      title: analyzed.title || "",
      description: analyzed.description || "",
      category: analyzed.category || "기타",
      tags: analyzed.tags || [],
      favicon: null,
      notifications: 0,
      createdAt: new Date(),
      lastVisited: null,
    }
    
    onAdd(newBookmark)
    setOpen(false)
    setUrl("")
    setAnalyzed(null)
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setUrl("")
      setAnalyzed(null)
      setIsAnalyzing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            북마크 추가
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI 북마크 추가
          </DialogTitle>
          <DialogDescription>
            URL을 입력하면 AI가 자동으로 사이트를 분석하여 정리합니다
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* URL 입력 */}
          <div className="space-y-2">
            <Label htmlFor="url">사이트 URL</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button 
                onClick={handleAnalyze} 
                disabled={!url.trim() || isAnalyzing}
                variant="secondary"
              >
                {isAnalyzing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-1" />
                    분석
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {/* AI 분석 결과 */}
          {isAnalyzing && (
            <div className="p-4 rounded-lg bg-secondary/50 border border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                </div>
                <div>
                  <p className="text-sm font-medium">AI가 사이트를 분석하고 있습니다...</p>
                  <p className="text-xs text-muted-foreground">카테고리, 설명, 태그를 자동으로 생성합니다</p>
                </div>
              </div>
            </div>
          )}
          
          {analyzed && !isAnalyzing && (
            <div className="space-y-3 p-4 rounded-lg bg-secondary/50 border border-primary/30">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">AI 분석 완료</span>
              </div>
              
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-muted-foreground">사이트명</span>
                  <p className="font-medium">{analyzed.title}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">카테고리</span>
                  <p className="text-sm">{analyzed.category}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">설명</span>
                  <p className="text-sm text-muted-foreground">{analyzed.description}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">태그</span>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {analyzed.tags?.map((tag) => (
                      <span 
                        key={tag} 
                        className="px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleSave} disabled={!analyzed}>
            저장하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
