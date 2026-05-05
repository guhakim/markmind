"use client"

import { signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"
import { Sparkles, BookmarkCheck, Brain, Zap, Shield, Mail } from "lucide-react"
import { useState } from "react"

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

const GoogleIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

function ContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "485d4cfc-4305-43a5-8d82-098fd4edf867",
          subject: `[MarkMind 문의] ${name}`,
          name,
          email,
          message,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSent(true)
      } else {
        throw new Error("전송 실패")
      }
    } catch {
      window.location.href = `mailto:felpen@naver.com?subject=${encodeURIComponent(`[MarkMind 문의] ${name}`)}&body=${encodeURIComponent(`이름: ${name}\n이메일: ${email}\n\n${message}`)}`
      setSent(true)
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <div className="text-center py-8 bg-primary/5 border border-primary/20 rounded-2xl">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
          <Mail className="w-6 h-6 text-primary" />
        </div>
        <p className="font-semibold text-foreground">문의가 접수되었습니다!</p>
        <p className="text-sm text-muted-foreground mt-1">빠른 시일 내에 답변드리겠습니다.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-card border border-border rounded-2xl p-6">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">이름</label>
        <input
          required
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="홍길동"
          className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">이메일</label>
        <input
          required
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="example@email.com"
          className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">문의 내용</label>
        <textarea
          required
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="문의하실 내용을 작성해주세요"
          rows={4}
          className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={sending}
        className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
      >
        {sending ? "전송 중..." : "문의 보내기"}
      </button>
    </form>
  )
}

export function LandingPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleGoogleLogin() {
    setLoading(true)
    setError("")
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (e: unknown) {
      console.error(e)
      const code = (e as { code?: string }).code
      if (code === "auth/popup-blocked") {
        setError("팝업이 차단되었습니다. 브라우저 팝업 허용 후 다시 시도해주세요.")
      } else if (code === "auth/unauthorized-domain") {
        setError("이 도메인에서는 로그인이 허용되지 않습니다. Firebase 콘솔에서 도메인을 추가해주세요.")
      } else {
        setError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.")
      }
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh bg-background flex flex-col">
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
          className="flex items-center gap-3 px-7 py-3.5 rounded-2xl bg-white text-gray-700 font-semibold text-base border border-gray-200 hover:bg-gray-50 hover:shadow-md transition-all shadow-sm disabled:opacity-60"
        >
          <GoogleIcon />
          {loading ? "로그인 중..." : "Google로 무료 시작하기"}
        </button>
        <p className="text-xs text-muted-foreground mt-3">신용카드 불필요 · 무료로 시작</p>
        {error && (
          <p className="text-xs text-red-500 mt-2 max-w-xs text-center">{error}</p>
        )}
      </section>

      <section className="px-6 pb-12 flex justify-center">
        <div className="w-full max-w-3xl rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
          <div className="bg-secondary/50 px-4 py-3 flex items-center gap-2 border-b border-border">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 mx-3 h-6 rounded-md bg-background/80 flex items-center px-3">
              <span className="text-xs text-muted-foreground">markmind.com</span>
            </div>
          </div>
          <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { title: "ChatGPT", url: "https://chatgpt.com", desc: "OpenAI가 개발한 대화형 AI 서비스입니다.", tag: "AI", tagColor: "bg-violet-500/20 text-violet-400", favicon: "https://www.google.com/s2/favicons?domain=chatgpt.com&sz=64", iconBg: "" },
              { title: "Figma", url: "https://figma.com", desc: "웹 기반 UI/UX 디자인 협업 툴입니다.", tag: "디자인", tagColor: "bg-rose-500/20 text-rose-400", favicon: "https://www.google.com/s2/favicons?domain=figma.com&sz=64", iconBg: "" },
              { title: "GitHub", url: "https://github.com", desc: "전 세계 개발자들이 사용하는 코드 호스팅 플랫폼입니다.", tag: "기술", tagColor: "bg-blue-500/20 text-blue-400", favicon: "https://www.google.com/s2/favicons?domain=github.com&sz=64", iconBg: "" },
              { title: "Midjourney", url: "https://midjourney.com", desc: "텍스트로 고품질 이미지를 생성하는 AI 서비스입니다.", tag: "AI", tagColor: "bg-violet-500/20 text-violet-400", favicon: "https://www.google.com/s2/favicons?domain=midjourney.com&sz=64", iconBg: "" },
              { title: "Notion", url: "https://notion.so", desc: "노트, 문서, 프로젝트 관리를 하나로 통합한 워크스페이스입니다.", tag: "비즈니스", tagColor: "bg-cyan-500/20 text-cyan-400", favicon: "https://www.google.com/s2/favicons?domain=notion.so&sz=64", iconBg: "" },
              { title: "Dribbble", url: "https://dribbble.com", desc: "전 세계 디자이너들이 작품을 공유하는 커뮤니티입니다.", tag: "디자인", tagColor: "bg-rose-500/20 text-rose-400", favicon: "https://www.google.com/s2/favicons?domain=dribbble.com&sz=64", iconBg: "bg-[#ea4c89]" },
            ].map((item, i) => (
              <div key={i} className="bg-background rounded-xl p-3 border border-border">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className={`w-10 h-10 rounded-xl shrink-0 overflow-hidden flex items-center justify-center ${item.iconBg || "bg-white"} ${item.iconBg ? "" : "p-1.5"}`}>
                    <img src={item.favicon} alt="" className={item.iconBg ? "w-full h-full object-cover" : "w-full h-full object-contain"} onError={e => { (e.target as HTMLImageElement).style.display = "none" }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{item.title}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{item.url}</p>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground line-clamp-2 mb-2">{item.desc}</p>
                <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full ${item.tagColor}`}>
                  {item.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-2">왜 MarkMind인가요?</h2>
          <p className="text-muted-foreground text-center text-sm mb-10">단순한 북마크를 넘어, 지식을 체계적으로 관리하세요</p>
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

      <section className="px-6 pb-16">
        <div className="max-w-md mx-auto bg-primary/5 border border-primary/15 rounded-3xl p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/25">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">지금 바로 시작하세요</h3>
          <p className="text-sm text-muted-foreground mb-6">Google 계정 하나로 모든 기능을 무료로 이용할 수 있습니다</p>
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 h-12 px-6 rounded-xl bg-white text-gray-700 font-semibold text-sm border border-gray-200 hover:bg-gray-50 hover:shadow-md transition-all shadow-sm disabled:opacity-60"
          >
            <GoogleIcon />
            {loading ? "로그인 중..." : "Google로 무료 시작하기"}
          </button>
          <p className="text-[11px] text-muted-foreground mt-3">
            로그인하면 이용약관 및 개인정보처리방침에 동의하는 것으로 간주됩니다
          </p>
        </div>
      </section>

      {/* 문의하기 섹션 */}
      <section className="px-6 pb-16">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Mail className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">문의하기</h2>
          </div>
          <p className="text-sm text-muted-foreground text-center mb-8">궁금한 점이 있으시면 언제든지 문의해주세요</p>
          <ContactForm />
        </div>
      </section>

      <footer className="border-t border-border px-6 py-6 text-center">
        <p className="text-xs text-muted-foreground">© 2025 MarkMind · AI 북마크 정리 서비스</p>
      </footer>
    </div>
  )
}
