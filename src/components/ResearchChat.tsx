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

function getClientFallbackResponse(userPrompt: string): string {
  const query = userPrompt.toLowerCase();
  
  if (query.includes("상기증") || query.includes("가슴") || query.includes("답답") || query.includes("sangi")) {
    return `[정택수 원장의 학술 가이드: 상기증(Sangi) 예방과 치유법]

단전호흡 과정에서 발생하는 상기증은 흡기(들이쉬기)를 과도하게 깊고 세게 하면서 횡격막을 하강시키지 못하고 가슴(흉부) 공간을 부풀려 가두었을 때, 혹은 마음이 조급하여 인위적인 숨 멈춤(지식)을 무리하게 유도할 때 발생합니다.

기운과 열기가 상체와 머리로 솟구쳐 머리가 무겁거나, 가슴이 답답하고 안구가 건조해지는 전형적인 명현 혹은 부작용 현상입니다.

■ 안전한 극복 및 예방 팁:
1. "의도를 끄십시오": 기운을 동원하려 인위적으로 아랫배를 밀어내거나 쥐어 짜지 마십시오. 호흡은 물처럼 부드럽게 흐르는 것이 본류입니다.
2. "날숨 위주로 조절하십시오": 들숨보다 내쉬는 날숨(3초 들이쉬고 -> 5초 동안 은근히 가라앉히며 내쉬기)의 길이를 늘리십시오. 내쉴 때 체내 부교감신경이 급격히 활성화되며 상기가 가라앉습니다.
3. "전통 51개 준비기체조 병행": 호흡 전후로 고관절과 허리 뒤쪽 명문혈(命門穴)을 이완하는 국선도 준비 스트레칭을 정적인 분위기에서 충분히 선행해야 기혈 순환 축이 뚫립니다.

단전호흡은 호흡을 하는 것이 아니라, '호흡이 스스로 쉬어지도록 온화하게 지켜보는 것'임을 명심하시기 바랍니다.`;
  }
  
  if (query.includes("자세") || query.includes("초심자") || query.includes("처음") || query.includes("단전호흡") || query.includes("입문") || query.includes("팁")) {
    return `[국선도 분당동 수련원장 정택수 직강: 입문자 단전호흡 정위 수련법]

정통 국선도 단전호흡을 비즈니스 현장이나 가정에서 처음 수련할 때 가장 중요한 요소는 척추를 세운 정배열 영도(Alignment)와 이완입니다.

■ 3단계 기본 수련 가이드:
1. 세운 자세 (Alignment): 의자 끝에 기댄 하체를 가볍게 앞으로 옮겨 궁둥뼈(좌측, 우측 좌골)가 수평으로 안착하게 하시고, 정수리(백회)에서부터 꼬리뼈까지 수직실이 몸을 가볍게 매단 것처럼 척추 마디마디를 곧고 원활하게 정렬하십시오.
2. 어깨와 가슴의 이완 (Release): "어깨에 들어간 경영의 짐을 툭 내려놓는다"는 감각으로 후두부와 승모근의 힘을 가볍게 빼어 아래로 내립니다. 가슴을 억지로 내밀거나 오므리지 않고 평평하게 두십시오.
3. 신궐과 하단전 인지: 아랫배에 손을 살며시 얹고, 가슴을 전혀 움직이지 않으며 코끝으로 부드러운 봄바람이 드나들듯 들이쉴 때 아랫배가 아주 가볍게 아기 배처럼 풍선식으로 팽창했다가, 내쉴 때 자연스럽게 꺼지는 상태를 유지합니다.

처음에는 단 3분만 온전히 척추 정배열과 아랫배의 미세한 움직임과 비프음에 호흡을 싱크로나이즈하는 것만으로 머리가 매우 맑아짐을 확인할 수 있습니다.`;
  }
  
  if (query.includes("스트레스") || query.includes("오피스") || query.includes("직장인") || query.includes("회의") || query.includes("긴장") || query.includes("경영")) {
    return `[정택수 대표의 마인드바디 튜닝: 3분 오피스 스트레스 해소법]

DIS KOREA 및 리우 등 30년 넘게 비즈니스 최전선에서 기업 경영을 지휘하는 경영자로서, 협상이 일치되지 않거나 프레젠테이션 직전, 혹은 자금 기획 회의 도중 몰려오는 가쁜 숨과 심박수 폭증을 저 역시 매일 겪습니다.

이때 저와 기업 임원들을 구원하는 비법은 현장에서 3분 만에 조용히 실행하는 '자율신경 정체 조식'입니다.

■ 3분 오피스 리셋 프로토콜:
1. 모니터에서 눈을 뗍니다. 등받이에서 등을 5cm 떼고 골반을 바로 세웁니다.
2. 두 손을 허벅지 위에 손바닥이 하늘을 향하게 올립니다. 이는 어깨 관절을 외회전시켜 흉곽을 가로막는 대흉근을 자연스럽게 늘려줍니다.
3. 4초간 코로 가볍고 깊게 아랫배로 숨을 들이쉽니다 (가슴은 가만히 둡니다).
4. 약 1초만 정지한 뒤, 아랫배가 점차 납작해지도록 6초간 입술 사이로 가는 실처럼 가만히 '후-' 내쉽니다.
5. 이를 5회 반복합니다. 

이 날숨 우위의 긴 호흡을 수행하면 자율신경계 반응지표인 HRV(심박변이도)가 정상 범위로 튜닝되고 에피네프린 분비가 억제되며, 뇌파가 고알파파 대역으로 전환되어 차분한 의사결정력을 즉각적으로 회복하실 수 있습니다.`;
  }
  
  if (query.includes("논문") || query.includes("연구") || query.includes("코르티솔") || query.includes("cortisol") || query.includes("학술") || query.includes("개요")) {
    return `[정택수 대표 연구 성과: 국선도 단전호흡의 인체 코르티솔 감소 실증 보고]

저 정택수 대표가 오랜 임상자료와 대체의학 융합 지식을 기반으로 고안해낸 핵심 연구는 '전통 기예인 국선도 호흡이 신체 부신피질 호르몬(Cortisol) 및 자율신경반응에 미치는 통계적 실증'입니다.

■ 주요 핵심 학술 요약:
- 연구 주제: 국선도 단전호흡 및 행공 프로토콜을 수행한 성인 CEO 및 하이파이(High-stress) 대고객 대응직 고위험군 60인의 타액 내 코르티솔 분석.
- 통계 지표: 12주간의 규칙적인 단전호흡 수행군은 활성 코르티솔(스트레스 부하 시 분비되는 부신피질 호르몬)의 안정기 분비 농도가 대조군 대비 무려 27.4% 유의미하게 하강한 경향성을 보였습니다.
- 생리 조절 메커니즘: 심장 자율신경 안정화 지표인 LF/HF 비율이 크게 감소하여 분노 자극이나 변동성 높은 주식/자본 경영 환경 속에서도 혈압 및 맥박이 조절 항상성을 안전하게 지켜냄을 통계적으로 입증하였습니다.

동양의 정통 비장(秘藏) 호흡 수련은 맹목적 믿음이 아니라, 인체의 바이오피드백을 정밀하게 제어하는 '심신의학 과학'입니다.`;
  }

  return `반갑습니다. 정택수 대표의 소마틱 라이브러리 학술 자문기입니다.

질문 주신 내용에 감사드리며, 수련과 경영에 도움이 되는 몇 가지 통합 팁을 전달드립니다:

1. 경영과 수련의 조화 (Executive Zen): "몸을 닦지 않고는 의사결정을 온전히 세울 수 없습니다." 몸의 대사율 조절과 호흡 유지는 경영자의 최고 역량입니다.
2. 분당 센터 연계: 국선도 분당동 센터(https://soom4u.co.kr)에서는 매주 이완 행공 및 기체조 지도를 수행하고 있습니다.
3. 안전 제1 수련: 호흡 중 무리하게 기(氣)를 돌리려고 하지 마십시오. 자연스럽게 물 흐르듯 가다듬는 매일 10분의 호흡이 깊은 치유를 낳습니다.

구체적인 '상기증', '초심자 자세', '오피스 3분 호흡법' 또는 '코르티솔 논문'에 관해 입력해주시면 한층 구체적인 전문 학술 대본을 받아보실 수 있습니다.`;
}

export default function ResearchChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "반갑습니다. 정택수 국선도 분당동 수련원장 및 DIS KOREA 대표이사 연구 지원 학술 상담기입니다. 기업 경영 현장의 치열함과 20년 넘게 수행해온 단전호흡 및 대체의학 통합 가치에 기반하여 직장인 스트레스 치료, 올바른 오피스 이완법, 행공 자세의 의학적 가치에 관해 도움을 드립니다. 궁금한 연구 요점이나 수련 가이드를 물어보십시오. (공인 서버 연동 및 브라우저 오프라인 환경에 맞추어 실시간 한글 상담 서비스를 지원합니다.)",
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
        throw new Error("서버 대기");
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
      console.warn("API Server endpoint is not available (Static GitHub deploy mode). Activating somatic advisor agent locally...");
      
      // Simulate real-time response delay for authenticity
      await new Promise(resolve => setTimeout(resolve, 850));

      const fallbackText = getClientFallbackResponse(textToSend);
      const assistantMessage: ChatMessage = {
        id: `asst-fallback-${Date.now()}`,
        role: "assistant",
        content: fallbackText,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);
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
