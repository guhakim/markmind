"use client"

import { signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { useFirebaseAuth } from "@/components/firebase-auth-provider"
import { Sparkles, BookmarkCheck, Brain, Zap, Shield } from "lucide-react"
import { useState, useEffect } from "react"

const PREVIEW_BOOKMARKS = [
  { title: "ChatGPT", url: "https://chatgpt.com", domain: "chatgpt.com", description: "OpenAI가 개발한 대화형 AI 서비스입니다. 글쓰기·코딩·번역·분석 등 다양한 작업을 도와줍니다.", category: "AI", color: "bg-violet-500/20 text-violet-400 border-violet-500/30" },
  { title: "Figma", url: "https://figma.com", domain: "figma.com", description: "브라우저 기반 UI/UX 디자인 협업 툴로, 팀원들이 실시간으로 함께 디자인 작업을 할 수 있습니다.", category: "디자인", color: "bg-rose-500/20 text-rose-400 border-rose-500/30" },
  { title: "GitHub", url: "https://github.com", domain: "github.com", description: "전 세계 개발자들이 코드를 저장·공유·협업하는 플랫폼으로, 오픈소스 프로젝트의 중심지입니다.", category: "기술", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { title: "Midjourney", url: "https://midjourney.com", domain: "midjourney.com", description: "텍스트 프롬프트로 고품질 이미지를 생성하는 AI 서비스입니다.", category: "AI", color: "bg-violet-500/20 text-violet-400 border-violet-500/30" },
  { title: "Notion", url: "https://notion.so", domain: "notion.so", description: "노트·문서·프로젝트 관리를 하나로 통합한 올인원 생산성 워크스페이스입니다.", category: "비즈니스", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
  { title: "Dribbble", url: "https://dribbble.com", domain: "dribbble.com", description: "전 세계 디자이너들이 작품을 공유하는 포트폴리오 커뮤니티입니다.", category: "디자인", color: "bg-rose-500/20 text-rose-400 border-rose-500/30" },
] as const

const FEATURES = [
  {
    icon: Brain,
    title: "AI 자동 분석",
    desc: "북마크를 저장하면 AI가 내용을 분석하고 카테고리를 자동으로 분류해드립니다",
  },
  {
    icon: BookmarkCheck,
    title: "스마트 정리",
    desc: "태그, 카테고리, 검색으로 수백 개의 북마크도 빠르게 찾을 수 있습니다",
  },
  {
    icon: Zap,
    title: "빠른 저장",
    desc: "URL만 입력하면 제목, 설명, 썸네일을 자동으로 불러와 즉시 저장됩니다",
  },
  {
    icon: Shield,
    title: "안전한 보관",
    desc: "Google 계정으로 로그인하여 내 북마크를 안전하게 보관하고 어디서든 접근하세요",
  },
]

export default function LoginPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useFirebaseAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // 마운트 시 1회만 — redirect 로그인 후 결과 처리
  useEffect(() => {
    getRedirectResult(auth).catch((e: unknown) => {
      const code = (e as { code?: string }).code
      if (code === "auth/unauthorized-domain") {
        setError("이 도메인에서는 로그인이 허용되지 않습니다. 관리자에게 문의해주세요.")
      } else if (code === "auth/network-request-failed") {
        setError("네트워크 연결을 확인한 후 다시 시도해주세요.")
      } else if (code) {
        setError("로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
      }
    })
  }, [])

  // 로그인 완료 시 메인으로 이동
  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/")
    }
  }, [user, authLoading, router])

  async function handleGoogleLogin() {
    setLoading(true)
    setError("")
    try {
      // 팝업 시도 → 팝업 차단 시 redirect 폴백
      await signInWithPopup(auth, googleProvider)
      router.push("/")
    } catch (e: unknown) {
      const code = (e as { code?: string }).code
      if (code === "auth/popup-blocked" || code === "auth/popup-cancelled-by-user") {
        // 모바일 등 팝업 차단 환경 → redirect 방식으로 전환
        try {
          await signInWithRedirect(auth, googleProvider)
        } catch {
          setError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.")
          setLoading(false)
        }
      } else if (code === "auth/unauthorized-domain") {
        setError("이 도메인에서는 로그인이 허용되지 않습니다. 관리자에게 문의해주세요.")
        setLoading(false)
      } else if (code === "auth/network-request-failed") {
        setError("네트워크 연결을 확인한 후 다시 시도해주세요.")
        setLoading(false)
      } else {
        setError("로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
        setLoading(false)
      }
    }
  }

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      {/* 헤더 */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-border/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-sm shadow-primary/30">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg text-foreground">MarkMind</span>
        </div>
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="h-9 px-4 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </header>

      {/* 히어로 섹션 */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          AI 기반 북마크 관리
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight mb-4 max-w-2xl">
          북마크를{" "}
          <span className="text-primary">AI</span>가{" "}
          알아서 정리해드립니다
        </h1>

        <p className="text-base md:text-lg text-muted-foreground max-w-md mb-8 leading-relaxed">
          URL 하나만 저장하세요. AI가 자동으로 분석하고, 카테고리를 분류하고, 나중에 쉽게 찾을 수 있도록 정리해드립니다.
        </p>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="flex items-center gap-3 h-13 px-7 py-3.5 rounded-2xl bg-white text-gray-700 font-semibold text-base border border-gray-200 hover:bg-gray-50 hover:shadow-md transition-all shadow-sm disabled:opacity-60"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? "로그인 중..." : "Google로 무료 시작하기"}
        </button>

        <p className="text-xs text-muted-foreground mt-3">
          신용카드 불필요 · 무료로 시작
        </p>
        {error && (
          <p className="text-xs text-red-500 mt-2 max-w-xs text-center">{error}</p>
        )}
      </section>

      {/* 미리보기 — 실제 북마크 카드와 동일한 디자인 */}
      <section className="px-6 pb-12 flex justify-center">
        <div className="w-full max-w-3xl rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
          <div className="bg-secondary/50 px-4 py-3 flex items-center gap-2 border-b border-border">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 mx-3 h-6 rounded-md bg-background/80 flex items-center px-3">
              <span className="text-xs text-muted-foreground">markmind-nu.vercel.app</span>
            </div>
          </div>
          <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
            {PREVIEW_BOOKMARKS.map((item) => (
              <div key={item.url} className="overflow-hidden border border-border/50 bg-card rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-secondary flex items-center justify-center overflow-hidden">
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${item.domain}&sz=64`}
                      alt=""
                      className="w-6 h-6 object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground truncate text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{item.url}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{item.description}</p>
                <div className="mt-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${item.color}`}>
                    {item.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 기능 섹션 */}
      <section className="px-6 pb-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-2">
            왜 MarkMind인가요?
          </h2>
          <p className="text-muted-foreground text-center text-sm mb-10">
            단순한 북마크를 넘어, 지식을 체계적으로 관리하세요
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map((f) => {
              const Icon = f.icon
              return (
              <div key={f.title} className="bg-card border border-border rounded-2xl p-5 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm mb-1">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="px-6 pb-16">
        <div className="max-w-md mx-auto bg-primary/5 border border-primary/15 rounded-3xl p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/25">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">지금 바로 시작하세요</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Google 계정 하나로 모든 기능을 무료로 이용할 수 있습니다
          </p>
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 h-12 px-6 rounded-xl bg-white text-gray-700 font-semibold text-sm border border-gray-200 hover:bg-gray-50 hover:shadow-md transition-all shadow-sm disabled:opacity-60"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? "로그인 중..." : "Google로 무료 시작하기"}
          </button>
          <p className="text-[11px] text-muted-foreground mt-3">
            로그인하면 이용약관 및 개인정보처리방침에 동의하는 것으로 간주됩니다
          </p>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="border-t border-border px-6 py-6 text-center">
        <p className="text-xs text-muted-foreground">
          © 2025 MarkMind · AI 북마크 정리 서비스
        </p>
      </footer>
    </div>
  )
}
