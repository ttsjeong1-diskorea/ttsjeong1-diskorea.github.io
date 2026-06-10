import { useEffect, useRef, useState } from 'react';
import { AlertCircle, HelpCircle, RefreshCw, Send, Sparkles, User } from 'lucide-react';
import { ChatMessage } from '../types';

const INITIAL_SUGGESTIONS = [
  {
    icon: "숨",
    label: "초심자 자세",
    prompt: "단전호흡을 처음 시작할 때 안전한 자세와 호흡 방법을 알려주세요."
  },
  {
    icon: "3분",
    label: "업무 전 리셋",
    prompt: "회의나 발표 전에 3분 동안 긴장을 낮추는 호흡 가이드를 알려주세요."
  },
  {
    icon: "주의",
    label: "부작용 예방",
    prompt: "단전호흡 중 어지러움이나 답답함이 느껴질 때 어떻게 해야 하나요?"
  },
  {
    icon: "연구",
    label: "연구 개요",
    prompt: "단전호흡과 스트레스 완화 연구를 간단히 요약해 주세요."
  }
];

function getClientFallbackResponse(userPrompt: string): string {
  const query = userPrompt.toLowerCase();

  if (query.includes("부작용") || query.includes("어지") || query.includes("답답") || query.includes("주의")) {
    return `단전호흡 중 어지러움, 답답함, 열감이 느껴지면 즉시 강도를 낮추고 자연 호흡으로 돌아오세요.

안전한 원칙은 세 가지입니다.
1. 숨을 억지로 길게 끌지 않습니다.
2. 아랫배에 힘을 과하게 주지 않습니다.
3. 불편감이 반복되면 수련 시간을 줄이고 쉬어 갑니다.

처음에는 3분 정도의 편안한 호흡으로 충분합니다. 단전호흡은 버티는 훈련이 아니라 몸의 긴장을 낮추는 연습에 가깝습니다.`;
  }

  if (query.includes("처음") || query.includes("초심") || query.includes("자세") || query.includes("시작")) {
    return `초심자는 의자에 앉아 시작하는 방식이 가장 안전합니다.

발은 바닥에 편하게 두고, 허리는 세우되 어깨와 턱의 힘은 내려놓습니다. 들숨에는 아랫배가 부드럽게 넓어지고, 날숨에는 자연스럽게 돌아오도록 지켜보세요.

권장 리듬은 4초 들숨, 4초 날숨입니다. 숨을 멈추는 단계는 익숙해진 뒤에 천천히 추가하는 편이 좋습니다.`;
  }

  if (query.includes("3분") || query.includes("회의") || query.includes("발표") || query.includes("긴장") || query.includes("업무")) {
    return `업무 전 3분 리셋 가이드입니다.

1분차: 자세를 바로 세우고 어깨 힘을 내려놓습니다.
2분차: 4초 들숨, 6초 날숨으로 호흡을 조금 늦춥니다.
3분차: 날숨 끝에서 몸이 가라앉는 느낌을 관찰합니다.

핵심은 호흡을 크게 만드는 것이 아니라, 날숨을 부드럽고 길게 가져가며 신경계의 속도를 낮추는 것입니다.`;
  }

  if (query.includes("연구") || query.includes("논문") || query.includes("스트레스") || query.includes("cortisol")) {
    return `단전호흡 연구의 중심 주제는 호흡 리듬, 자세 정렬, 주의 집중이 스트레스 반응과 자율신경 안정에 어떤 영향을 주는지입니다.

느린 복식 호흡은 긴장 완화와 회복감에 도움을 줄 수 있고, 규칙적인 수련은 업무 스트레스 상황에서 감정 조절과 집중력 회복을 돕는 방식으로 설명될 수 있습니다.

다만 개인의 몸 상태에 따라 반응이 다르므로, 처음에는 짧고 편안한 강도로 시작하는 것이 중요합니다.`;
  }

  return `질문 감사합니다. GitHub Pages에서는 서버 API가 실행되지 않기 때문에 현재는 브라우저 안의 기본 상담 모드로 답변하고 있습니다.

단전호흡, 자세 정렬, 업무 스트레스 완화, 초심자 안전 수련에 대해 물어보시면 더 구체적으로 안내해 드릴 수 있습니다.`;
}

export default function ResearchChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "반갑습니다. 정택수 개인연구소의 단전호흡 및 심신 안정 상담 도구입니다. GitHub Pages 환경에서는 정적 fallback 모드로 동작합니다.",
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("./api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) throw new Error("API endpoint is not available");

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: "assistant",
        content: data.text || "응답을 받지 못했습니다.",
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 450));

      const assistantMessage: ChatMessage = {
        id: `asst-fallback-${Date.now()}`,
        role: "assistant",
        content: getClientFallbackResponse(textToSend),
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "상담을 초기화했습니다. 단전호흡, 스트레스 완화, 초심자 수련법에 대해 질문해 주세요.",
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setErrorText("");
  };

  return (
    <div id="ai-research-chat" className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[600px]">
      <div className="bg-gradient-to-r from-gray-900 to-slate-800 p-4 lg:px-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-brand-600/35 rounded-xl border border-brand-500/30 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-brand-100 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-white">정택수 마인드바디 어드바이저</span>
              <span className="text-[10px] bg-brand-600 px-1.5 py-0.5 rounded text-brand-100 font-mono font-bold tracking-wider uppercase">
                Static
              </span>
            </div>
            <p className="text-[11px] text-gray-300">단전호흡과 업무 스트레스 완화를 위한 브라우저 상담 모드</p>
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

      <div className="flex-1 overflow-y-auto p-4 lg:p-6 bg-gradient-to-b from-gray-50/50 to-white space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 max-w-[85%] ${m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
              m.role === "user"
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-brand-50 border-brand-100 text-brand-700'
            }`}>
              {m.role === "user" ? <User className="w-4.5 h-4.5" /> : <Sparkles className="w-4.5 h-4.5" />}
            </div>

            <div className="space-y-1">
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                m.role === "user"
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-none'
                  : 'bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200/50'
              }`}>
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
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-600 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-600" />
              </span>
              답변을 준비하는 중입니다...
            </div>
          </div>
        )}

        {errorText && (
          <div className="p-3.5 bg-red-50 rounded-xl border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p className="flex-1 leading-relaxed">{errorText}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {messages.length === 1 && (
        <div className="px-4 py-2 border-t border-gray-100 bg-gray-50/70">
          <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-2 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-brand-600" />
            빠른 질문
          </span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {INITIAL_SUGGESTIONS.map((s, idx) => (
              <button
                id={`suggestion-${idx}`}
                key={s.label}
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

      <div className="p-4 border-t border-gray-100 bg-white flex gap-2">
        <input
          id="chat-message-input"
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputMessage)}
          placeholder="단전호흡, 스트레스, 자세에 대해 질문해 주세요..."
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
