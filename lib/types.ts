export interface Bookmark {
  id: string
  url: string
  title: string
  description: string
  category: string
  tags: string[]
  favicon: string | null
  notifications: number
  createdAt: Date
  lastVisited: Date | null
}

export interface Category {
  id: string
  name: string
  icon: string
  count: number
}

export const CATEGORIES = [
  { id: "all", name: "전체", icon: "Grid3X3" },
  { id: "shopping", name: "쇼핑", icon: "ShoppingBag" },
  { id: "tech", name: "기술", icon: "Code" },
  { id: "news", name: "뉴스", icon: "Newspaper" },
  { id: "entertainment", name: "엔터테인먼트", icon: "Film" },
  { id: "education", name: "교육", icon: "GraduationCap" },
  { id: "business", name: "비즈니스", icon: "Briefcase" },
  { id: "social", name: "소셜", icon: "Users" },
  { id: "other", name: "기타", icon: "MoreHorizontal" },
] as const

export const SAMPLE_BOOKMARKS: Bookmark[] = [
  {
    id: "1",
    url: "https://www.coupang.com",
    title: "쿠팡",
    description: "로켓배송으로 유명한 대한민국 최대 이커머스 플랫폼. 생필품부터 전자제품까지 다양한 상품을 빠르게 배송받을 수 있습니다.",
    category: "쇼핑",
    tags: ["이커머스", "로켓배송", "온라인쇼핑"],
    favicon: "https://www.coupang.com/favicon.ico",
    notifications: 5,
    createdAt: new Date("2024-01-15"),
    lastVisited: new Date("2024-03-20"),
  },
  {
    id: "2",
    url: "https://www.musinsa.com",
    title: "무신사",
    description: "MZ세대가 선호하는 국내 1위 패션 플랫폼. 스트릿 패션부터 명품까지 다양한 브랜드를 만날 수 있습니다.",
    category: "쇼핑",
    tags: ["패션", "의류", "MZ"],
    favicon: "https://www.musinsa.com/favicon.ico",
    notifications: 12,
    createdAt: new Date("2024-02-01"),
    lastVisited: new Date("2024-03-19"),
  },
  {
    id: "3",
    url: "https://github.com",
    title: "GitHub",
    description: "전 세계 개발자들이 사용하는 코드 호스팅 플랫폼. 오픈소스 프로젝트 협업과 버전 관리에 필수적인 서비스입니다.",
    category: "기술",
    tags: ["개발", "오픈소스", "Git"],
    favicon: "https://github.com/favicon.ico",
    notifications: 3,
    createdAt: new Date("2024-01-10"),
    lastVisited: new Date("2024-03-21"),
  },
  {
    id: "4",
    url: "https://www.notion.so",
    title: "Notion",
    description: "노트, 문서, 위키, 프로젝트 관리를 하나로 통합한 올인원 워크스페이스. 팀 협업에 최적화된 생산성 도구입니다.",
    category: "비즈니스",
    tags: ["생산성", "노트", "협업"],
    favicon: "https://www.notion.so/favicon.ico",
    notifications: 0,
    createdAt: new Date("2024-02-15"),
    lastVisited: new Date("2024-03-18"),
  },
  {
    id: "5",
    url: "https://www.netflix.com",
    title: "Netflix",
    description: "전 세계 최대 스트리밍 서비스. 영화, 드라마, 다큐멘터리 등 다양한 오리지널 콘텐츠를 제공합니다.",
    category: "엔터테인먼트",
    tags: ["스트리밍", "영화", "드라마"],
    favicon: "https://www.netflix.com/favicon.ico",
    notifications: 8,
    createdAt: new Date("2024-01-20"),
    lastVisited: new Date("2024-03-21"),
  },
  {
    id: "6",
    url: "https://www.yna.co.kr",
    title: "연합뉴스",
    description: "대한민국 대표 종합 뉴스 통신사. 정치, 경제, 사회, 문화 등 전 분야의 최신 뉴스를 실시간으로 제공합니다.",
    category: "뉴스",
    tags: ["뉴스", "시사", "속보"],
    favicon: "https://www.yna.co.kr/favicon.ico",
    notifications: 24,
    createdAt: new Date("2024-02-10"),
    lastVisited: new Date("2024-03-21"),
  },
  {
    id: "7",
    url: "https://www.udemy.com",
    title: "Udemy",
    description: "전 세계 최대 온라인 강의 플랫폼. 프로그래밍, 디자인, 비즈니스 등 20만 개 이상의 강좌를 제공합니다.",
    category: "교육",
    tags: ["온라인강의", "자기계발", "기술"],
    favicon: "https://www.udemy.com/favicon.ico",
    notifications: 2,
    createdAt: new Date("2024-01-25"),
    lastVisited: new Date("2024-03-15"),
  },
  {
    id: "8",
    url: "https://www.instagram.com",
    title: "Instagram",
    description: "사진과 영상 기반의 소셜 미디어 플랫폼. 릴스, 스토리 등 다양한 콘텐츠 형식으로 소통할 수 있습니다.",
    category: "소셜",
    tags: ["SNS", "사진", "릴스"],
    favicon: "https://www.instagram.com/favicon.ico",
    notifications: 15,
    createdAt: new Date("2024-02-05"),
    lastVisited: new Date("2024-03-21"),
  },
]
