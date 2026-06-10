import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, BookOpen, User, Volume2, HelpCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { ChatMessage } from '../types';

const INITIAL_SUGGESTIONS = [
  {
    icon: "🧘",
    label: "초심자 호흡 자세",
    prompt: "국선도 단전호흡을 처음 하려는데, 힘을 잘 빼고 올바른 자세를 유지하며 들이쉬는 구체적 팁을 전해주세요."
  },
  {
    icon: "👔",
    label: "3분 오피스 호흡",
    prompt: "중요한 비즈니스 프레젠테이션이나 결재 회의 직전에 3분 동안 극도의 긴장을 리셋할 수 있는 간이 호흡법을 일러주세요."
  },
  {
    icon: "⚠️",
    label: "상기증(Sangi) 예방",
    prompt: "호흡을 들이쉴 때 가슴이 답답하거나 열감이 머리로 치솟는 '상기증'이 발생하는 이유와 안전한 자가 극복 팁은 무엇입니까?"
  },
  {
    icon: "📊",
    label: "대표 연구 논문 개요",
    prompt: "정택수 대표님이 수행해온 국선도 단전호흡의 인체 코르티솔(Cortisol) 호르몬 감소 효과 연구에 관한 개요를 학술 요약해주세요."
  }
];

export default function ResearchChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "반갑습니다. 정택수 국선도 분당동 수련원장 및 DIS KOREA 대표이사 연구 지원 학술 상담기입니다. 기업 경영 현장의 치열함과 20년 넘게 수행해온 단전호흡 및 대체의학 통합 가치에 기반하여 직장인 스트레스 치료, 올바른 오피스 이완법, 행공 자세의 의학적 가치에 관해 도움을 드립니다. 궁금한 연구 요점이나 수련 가이드를 물어보십시오.",
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    setErrorText("");

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error("서버와의 대화 연결에 실패했습니다.");
      }

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: "assistant",
        content: data.text || "죄송합니다. 답변을 받아들이지 못했습니다.",
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error("Chat fetch error:", err);
      setErrorText("Gemini API 키 오류 또는 서버 엔드포인트 연결 문제일 수 있습니다. .env 파일에 올바른 API 환경 변수가 할당되어 있는지 확인하시기 바랍니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "상담이 초기화되었습니다. 정택수 원장의 경영과 국선도 융합 철학, 그리고 호흡 소양에 대해 자유롭게 질의해주십시오.",
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setErrorText("");
  };

  return (
    <div id="ai-research-chat" className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[600px]">
      {/* Head section */}
      <div className="bg-gradient-to-r from-gray-900 to-slate-800 p-4 lg:px-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-brand-600/35 rounded-xl border border-brand-500/30 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-brand-100 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-white">정택수 마인드바디 어드바이저</span>
              <span className="text-[10px] bg-brand-600 px-1.5 py-0.5 rounded text-brand-100 font-mono font-bold tracking-wider uppercase">Gemini 3.5</span>
            </div>
            <p className="text-[11px] text-gray-300">국선도 천선원 이사·분당동 수련원장의 통합 스트레스 해소 요강 상담</p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-mono"
          title="대화 초기화"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Messages layout */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 bg-gradient-to-b from-gray-50/50 to-white space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 max-w-[85%] ${m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
          >
            {/* Avatar code */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
              m.role === "user" 
                ? 'bg-blue-50 border-blue-200 text-blue-700' 
                : 'bg-brand-50 border-brand-100 text-brand-700'
            }`}>
              {m.role === "user" ? <User className="w-4.5 h-4.5" /> : <Sparkles className="w-4.5 h-4.5" />}
            </div>

            {/* Bubble detail */}
            <div className="space-y-1">
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                m.role === "user"
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-none'
                  : 'bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200/50'
              }`}>
                {/* Safe newlines */}
                <p className="whitespace-pre-line">{m.content}</p>
              </div>
              <span className={`text-[10px] text-gray-400 block ${m.role === "user" ? "text-right" : "text-left"}`}>
                {m.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 max-w-[85%] mr-auto items-start">
            <div className="w-8 h-8 rounded-full bg-brand-50 border border-brand-100 text-brand-700 flex items-center justify-center animate-spin">
              <RefreshCw className="w-4.5 h-4.5" />
            </div>
            <div className="p-4 rounded-2xl bg-gray-100 text-gray-500 rounded-tl-none border border-gray-200/50 text-xs flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-600 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-600"></span>
              </span>
              정택수 원장의 학술 문헌 및 수련 기안을 조회하는 중입니다...
            </div>
          </div>
        )}

        {errorText && (
          <div className="p-3.5 bg-red-50 rounded-xl border border-红色-200 flex items-start gap-2.5 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p className="flex-1 leading-relaxed">{errorText}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggests tray cards */}
      {messages.length === 1 && (
        <div className="px-4 py-2 border-t border-gray-100 bg-gray-50/70">
          <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-2 block flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-brand-600" />
            인간 정택수 연구 테마 빠른 질의 추천
          </span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {INITIAL_SUGGESTIONS.map((s, idx) => (
              <button
                id={`suggestion-${idx}`}
                key={idx}
                onClick={() => handleSendMessage(s.prompt)}
                className="p-2 text-left bg-white rounded-lg border border-gray-100 hover:border-brand-600 hover:bg-brand-50/20 transition-all text-[11px] group"
              >
                <div className="flex items-center gap-1 mb-1">
                  <span>{s.icon}</span>
                  <span className="font-semibold text-gray-800 group-hover:text-brand-900 truncate">
                    {s.label}
                  </span>
                </div>
                <p className="text-gray-400 font-normal line-clamp-1 truncate">{s.prompt}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Inputs panel */}
      <div className="p-4 border-t border-gray-100 bg-white flex gap-2">
        <input
          id="chat-message-input"
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputMessage)}
          placeholder="단전호흡 부작용 예방법, 스트레스 해소에 궁금한 점을 적어주세요..."
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-brand-600 text-gray-800"
          disabled={isLoading}
        />
        <button
          id="chat-send-button"
          onClick={() => handleSendMessage(inputMessage)}
          disabled={isLoading || !inputMessage.trim()}
          className="bg-brand-700 hover:bg-brand-800 text-white rounded-xl p-2.5 px-4 text-sm font-semibold transition-colors flex items-center gap-1 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </div>
    </div>
  );
}
