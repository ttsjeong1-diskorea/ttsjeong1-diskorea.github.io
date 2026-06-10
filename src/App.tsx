import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, BookOpen, Award, Sparkles, Send, ExternalLink, Briefcase, 
  Layers, Globe, Search, Building, ChevronRight, Quote, HeartPulse, 
  Mail, Calendar, GraduationCap, ArrowUpRight, Compass, ShieldAlert
} from 'lucide-react';
import { PROFILE_DATA, PUBLICATIONS_DATA } from './data/profileData';
import BreathingTimer from './components/BreathingTimer';
import ResearchChat from './components/ResearchChat';

export default function App() {
  const [profile] = useState(PROFILE_DATA);
  const [publications] = useState(PUBLICATIONS_DATA);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedPubId, setExpandedPubId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"research" | "somatic">("research");

  const filteredPublications = publications.filter(pub => {
    const matchesCategory = selectedCategory === "All" || pub.category === selectedCategory;
    const matchesSearch = pub.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pub.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pub.journal.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ["All", "Journal Paper", "Technical Report", "Book"];


  return (
    <div className="min-h-screen bg-neutral-50/50 text-gray-800 font-sans selection:bg-brand-100 selection:text-brand-800">
      
      {/* Premium Top Navigation header banner */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-green-600 flex items-center justify-center shadow-xs">
              <Compass className="w-5.5 h-5.5 text-white animate-spin-slow" />
            </div>
            <div>
              <span className="font-serif font-bold text-base sm:text-lg tracking-tight text-gray-900 block">
                정택수 개인연구소
              </span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold block font-mono">
                Somatic Breathing & Leadership Academy
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <a
              href="https://soom4u.co.kr/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100/80 px-3 py-1.5 rounded-lg transition-all"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">분당동 수련원 공식 홈</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            
            <a 
              href="#ai-chat-section"
              className="text-xs font-medium text-gray-500 hover:text-brand-700 transition-colors"
            >
              AI 상담소
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-12">
        
        {/* Profile Hero Section */}
        <section className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs relative">
          
          {/* Cover gradient design */}
          <div className="h-44 bg-gradient-to-r from-gray-900 via-slate-800 to-brand-800 relative">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
            <div className="absolute bottom-4 right-6 text-white/50 text-[10px] font-mono tracking-widest hidden sm:block uppercase">
              EST. Kouksundo 20+ Years / Corporate CEO
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10 -mt-16 relative z-10">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              
              {/* Profile Image card area (Constructed with custom visual design) */}
              <div className="relative shrink-0 mx-auto lg:mx-0">
                <div className="w-36 h-36 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-500 p-1 shadow-md bg-white">
                  <div className="w-full h-full rounded-xl bg-slate-900 flex flex-col items-center justify-center text-center px-2 relative overflow-hidden">
                    {/* Abstract Zen circle backdrop */}
                    <div className="absolute w-24 h-24 rounded-full border border-dashed border-brand-500/10 animate-spin-slow pointer-events-none" />
                    
                    <User className="w-12 h-12 text-brand-100 mb-1" />
                    <span className="font-serif font-black text-xl text-white tracking-widest">
                      정 택 수
                    </span>
                    <span className="text-[10px] text-gray-300 font-mono tracking-wider">
                      Taeksu Jeong
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio Details */}
              <div className="flex-1 text-center lg:text-left space-y-3">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-serif text-gray-900 font-bold tracking-tight">
                    정택수 <span className="font-sans text-xl font-normal text-gray-500">대체의학 연구가 & 경영인</span>
                  </h1>
                  <p className="text-sm font-medium text-brand-700 flex items-center justify-center lg:justify-start gap-1.5 mt-1">
                    <GraduationCap className="w-4.5 h-4.5" />
                    <span>전통 국선도 천선원 이사·분당동 수련원 원장</span>
                  </p>
                </div>

                <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-4xl">
                  {profile?.biography}
                </p>

                {/* Email and Meta contact bar */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-mono text-gray-500 mt-2">
                  <span className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200/40">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span>{profile?.email}</span>
                  </span>
                  <span className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200/40">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>Since 2004 Studio Open</span>
                  </span>
                </div>
              </div>
            </div>

            {/* List of active dual roles */}
            <div className="mt-8 pt-8 border-t border-gray-100">
              <span className="text-[10px] font-mono font-bold uppercase text-gray-400 tracking-wider block mb-4">
                현재 역임 및 이력사항 (Executive & Somatic History)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {profile?.titles.map((role, idx) => {
                  const isCurrent = role.startsWith("현)");
                  return (
                    <div 
                      key={idx}
                      className={`p-3.5 rounded-xl border transition-all flex items-center gap-3 ${
                        isCurrent 
                          ? 'bg-brand-50/20 border-brand-100 text-brand-950 shadow-2xs' 
                          : 'bg-gray-50/50 border-gray-100 text-gray-600'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isCurrent ? 'bg-brand-100 text-brand-700' : 'bg-gray-200 text-gray-400'
                      }`}>
                        {isCurrent ? <Award className="w-4.5 h-4.5" /> : <Briefcase className="w-4.5 h-4.5" />}
                      </div>
                      <span className="text-xs sm:text-sm font-semibold tracking-tight">{role}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </section>

        {/* Bento Grid: Core Research Focus */}
        <section className="space-y-4">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-xs text-brand-700 font-mono tracking-wider font-bold block uppercase">
              Primary Academic Subjects
            </span>
            <h2 className="text-2xl sm:text-3xl text-gray-900 font-serif font-bold tracking-tight">
              핵심 연구 및 학술 관심 분야
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile?.researchInterests.map((interest, idx) => (
              <div 
                key={idx} 
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-3xs flex items-start gap-4 hover:border-brand-100 transition-colors"
              >
                <div className="p-3 bg-brand-50 text-brand-700 rounded-xl">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-gray-900 font-serif">
                    Research Topic #{idx + 1}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {interest}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Split Section: Publications vs. Breathing Lab */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="col-span-1 lg:col-span-7 space-y-8">
            
            {/* Visual selector tabs */}
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                id="tab-button-research"
                onClick={() => setActiveTab("research")}
                className={`flex-1 py-3 text-center sm:text-sm text-xs font-semibold rounded-lg transition-all ${
                  activeTab === "research"
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                📑 통합 학술 연구 · 저서 목록 ({publications.length})
              </button>
              <button
                id="tab-button-somatic"
                onClick={() => setActiveTab("somatic")}
                className={`flex-1 py-3 text-center sm:text-sm text-xs font-semibold rounded-lg transition-all ${
                  activeTab === "somatic"
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                🧘 아날로그 복식 호흡 수련 가이드
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "research" ? (
                <motion.div
                  key="research"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-3xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-serif font-bold text-gray-900">
                          대표 학술 저작 아카이브
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">정택수 원장과 공동 연구진의 논문/저서를 카테고리별로 검색하세요.</p>
                      </div>

                      {/* Simple query search bar */}
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                        <input
                          id="publications-search-input"
                          type="text"
                          placeholder="논문 키워드 검색..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9 pr-4 py-1.5 border border-gray-200 rounded-xl text-xs focus:outline-hidden focus:border-brand-600 bg-gray-50 text-gray-850"
                        />
                      </div>
                    </div>

                    {/* Categories tag filter */}
                    <div className="flex flex-wrap gap-1.5">
                      {categories.map((cat) => (
                        <button
                          id={`cat-filter-${cat}`}
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`text-xs px-3 py-1.5 rounded-full transition-all font-medium ${
                            selectedCategory === cat
                              ? 'bg-slate-900 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {cat === "All" ? "전체보기" : cat}
                        </button>
                      ))}
                    </div>

                    {/* List area */}
                    <div className="space-y-4 pt-2">
                      {filteredPublications.length === 0 ? (
                        <div className="p-10 text-center text-gray-400 text-sm">
                          연구 목록이 비어 있습니다. 다른 키워드를 입력해 주십시오.
                        </div>
                      ) : (
                        filteredPublications.map((pub) => {
                          const isExpanded = expandedPubId === pub.id;
                          return (
                            <div 
                              key={pub.id}
                              className="border border-gray-105 rounded-xl p-4 hover:border-brand-200 transition-all bg-white shadow-3xs"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <span className="text-[10px] font-mono font-bold bg-brand-50 text-brand-700 px-2 py-0.5 rounded">
                                    {pub.category} ({pub.year})
                                  </span>
                                  <h4 className="text-sm sm:text-base font-serif font-bold text-gray-900 mt-2 hover:text-brand-800 transition-colors">
                                    {pub.title}
                                  </h4>
                                  <p className="text-xs text-gray-500 mt-1">
                                    저자: {pub.authors} | 학술단체: {pub.journal}
                                  </p>
                                </div>
                              </div>

                              {/* Toggle expand abstract button */}
                              <div className="mt-3 flex items-center justify-between">
                                <button
                                  id={`expand-abstract-${pub.id}`}
                                  onClick={() => setExpandedPubId(isExpanded ? null : pub.id)}
                                  className="text-xs font-semibold text-brand-700 hover:text-brand-900 flex items-center gap-1"
                                >
                                  <span>{isExpanded ? '초록 닫기 (Hide Abstract)' : '초록 국문요약 펼치기 (Show Abstract)'}</span>
                                  <ChevronRight className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                </button>
                                
                                <a
                                  href={pub.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-gray-400 hover:text-gray-900 flex items-center gap-1"
                                >
                                  <span>상세 정보</span>
                                  <ArrowUpRight className="w-3.5 h-3.5" />
                                </a>
                              </div>

                              {/* Expandable abstract container */}
                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-150/60 mt-3 text-xs leading-relaxed text-gray-600 font-sans">
                                      <p className="font-semibold text-gray-800 mb-1 flex items-center gap-1">
                                        <Quote className="w-3 h-3 text-brand-600" />
                                        학술 요약 (Abstract)
                                      </p>
                                      {pub.abstract}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="somatic"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <BreathingTimer />
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Right sidebar: AI adviser section */}
          <div id="ai-chat-section" className="col-span-1 lg:col-span-5 space-y-4">
            <div className="bg-white p-4.5 rounded-2xl border border-gray-100 shadow-3xs">
              <h3 className="text-sm font-semibold uppercase text-brand-700 tracking-wider font-mono flex items-center gap-1.5 mb-1">
                <Sparkles className="w-4 h-4 fill-current animate-pulse text-brand-600" />
                Somatic Hybrid Adviser
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                전통 단전호흡의 생리학적 지표, 행공 효과, 기업 경영 중의 자율신경계 리셋을 즉각적으로 질의하고 피드백 받으실 수 있는 지능형 의학 상담 채널입니다.
              </p>
            </div>

            <ResearchChat />
          </div>

        </div>

      </main>

      {/* Decorative calm quote block */}
      <footer className="bg-white border-t border-gray-100 py-12 mt-16 text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-3">
          <p className="font-serif italic text-lg text-gray-600 leading-normal">
            "숨은 내 안의 소우주와 대자연을 연결하는 가교이자 체류입니다. 들이쉼과 내쉼의 세련된 이완 속에서 현대인의 탁한 스트레스는 가라앉고, 삶의 명징한 기운과 평정심이 세워집니다."
          </p>
          <div className="text-xs font-semibold text-gray-400 font-mono tracking-wider">
            — 국선도 분당동 수련원장 · 이사 정택수
          </div>
          <div className="pt-6 border-t border-gray-100/60 mt-6 text-[11px] text-gray-400 font-mono">
            &copy; 2026 TAESU JEONG. All Academic Somatic Research Rights Reserved. / <a href="https://soom4u.co.kr/" target="_blank" rel="noopener" className="underline hover:text-brand-800">soom4u.co.kr</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

