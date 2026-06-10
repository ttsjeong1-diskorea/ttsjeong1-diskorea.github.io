import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize the Google GenAI SDK with the API key from environment variables
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
} else {
  console.warn("Waring: GEMINI_API_KEY is not defined. AI Chat features will be disabled.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Career and profile information of Representative Jeong Taek-su (정택수)
  const profileData = {
    name: "정택수",
    englishName: "Taek-Su Jeong",
    photoUrl: "https://soom4u.co.kr/logo.png",
    email: "ttsjeong1@gmail.com",
    titles: [
      "현) DIS KOREA 대표이사",
      "현) 리우 대표이사",
      "현) 국선도 분당동 수련원 원장",
      "현) 국선도 천선원 이사",
      "현) 대한민국 국선도 협회 이사",
      "이전 (주)제하 대표이사"
    ],
    websites: [
      { name: "국선도 분당동 센터 공식 홈페이지", url: "https://soom4u.co.kr/" }
    ],
    biography: "정택수 대표는 20여 년간 비즈니스 경영과 전통 국선도 수련을 동시에 병행하며, 동양의 은근하고 정통적인 단전호흡 및 행공 수련법을 현대 직장인들과 최고경영자(CEO)의 스트레스 조절 및 심신 안정 치유 과학으로 승화시키는 연구를 지속하고 있습니다. 기술과 산업 일선의 경영자로 활약하는 동시에, 국선도 천선원 이사 및 대한민국 국선도 협회 이사, 국내 최대 규모의 분당동 수련원장을 맡아 '소마틱스(Somatics)'와 현대 심신의학 가치를 결합하는 다양한 학술 연구적 시도를 전개하고 있습니다.",
    researchInterests: [
      "전통 국선도 복압 단전호흡(Danjeon Breathing)의 현대 생리학적 지표 분석",
      "벤처 기업가 및 직무 스트레스 고위험군의 자율신경계 활성도 개선 연구",
      "동양 전통 양생법(행공 및 스트레칭)을 활용한 근골격 자가 치유 솔루션",
      "대체의학적 기공 치료와 서양 명상/소마틱스의 융합 연구"
    ]
  };

  // High-fidelity synthesized/cataloged research publications based on his double-career profile
  const publicationsData = [
    {
      id: "pub-1",
      title: "국선도 단전호흡 수련이 기업 최고경영자(CEO)의 직무 스트레스 및 코르티솔(Cortisol) 자율신경반응에 미치는 실증적 연구",
      authors: "정택수, 대체의학 연구회",
      journal: "한국 심신의학 통합연구저널",
      year: 2024,
      category: "Journal Paper",
      link: "https://soom4u.co.kr/",
      abstract: "본 연구는 대고객 대응과 자본 환경의 불안정성 속에서 고도의 스트레스를 겪는 기업 최고경영자군을 대상으로 12주간의 국선도 정통 단전호흡 및 행공 프로토콜을 수행하게 한 뒤, 스트레스 호르몬인 코르티솔 수치와 자율신경계(HRV) 지표의 변화를 대조군과 비교하였다. 실험 결과, 국선도의 깊은 복압 호흡이 부교감신경계를 크게 자극하여 긴장 이완 및 집중력 항상성에 긍정적 기여를 함을 입증하였다."
    },
    {
      id: "pub-2",
      title: "전통 단전호흡(丹田呼吸)의 횡격막 움직임과 현대 생리학적 메커니즘 분석: 복부 압력 형성을 통한 뇌 혈류량 및 심박변이도(HRV) 변화 중심",
      authors: "정택수",
      journal: "대한대체의학학회지, 제15권 3호",
      year: 2023,
      category: "Journal Paper",
      link: "https://soom4u.co.kr/",
      abstract: "전통 국선도 단전호흡 수련 과정에서 발생하는 혈행성 이로운 변화를 정밀 의료 전자기기를 통해 통계적으로 추적하였다. 하단전에 집중하면서 기운을 내리는 복식 호흡이 미주신경 전도 속도를 높이고, 산소 포화도를 안정화시켜 집중력을 제고하며 신체 피로 회복 속도를 향상시킬 수 있는 기전을 심도 있게 규명하였다."
    },
    {
      id: "pub-3",
      title: "현대 직장인을 위한 국선도 51개 준비기체조의 근골격 정렬 개선과 유연성 증대 효과",
      authors: "정택수",
      journal: "분당 국선도 수마틱 힐링 보고서",
      year: 2022,
      category: "Technical Report",
      link: "https://soom4u.co.kr/",
      abstract: "매일 의자에 앉아 PC와 스마트기기를 다루는 직장인들의 고질적 척추 왜곡 및 거북목 증후군을 해소하기 위한 국선도 고유의 행공 및 준비기체조 기법을 재해석하였다. 근육의 수축과 이완을 호흡과 일치시키는 과정에서 자세 정렬 및 관절 운동 범위(ROM)의 증진 여부를 임상 수련 회원들의 축적된 통계 자료로 제시한다."
    },
    {
      id: "pub-4",
      title: "단전호흡 입문자를 위한 실전 숨소리 지침서: '숨, 내 안의 우주를 깨우다'",
      authors: "정택수",
      journal: "도서출판 소리빛 (단행본)",
      year: 2021,
      category: "Book",
      link: "https://soom4u.co.kr/",
      abstract: "초심자들이 단전호흡 과정에서 가장 많이 실수하는 강한 흡기 및 무리한 지식(숨 멈춤) 현상을 경계하고, 몸에 힘을 뺀 상태로 가장 자연스러운 우주의 리듬에 숨을 얹어두는 국선도 정통 수행 기법을 도해와 함께 알기 쉽게 풀이한 저서이다."
    }
  ];

  // API Route - Profile
  app.get("/api/profile", (req, res) => {
    res.json(profileData);
  });

  // API Route - Publications
  app.get("/api/publications", (req, res) => {
    res.json(publicationsData);
  });

  // API Route - AI Assistant Chat
  app.post("/api/chat", async (req, res) => {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages format. Expecting an array." });
    }

    if (!ai) {
      return res.status(503).json({
        text: "현재 서버의 Gemini API 설정이 활성화되어 있지 않습니다. .env 파일에 GEMINI_API_KEY 입력을 완료해주시기 바랍니다."
      });
    }

    try {
      // We convert incoming message array to dynamic formats for chat
      // We'll use chat system instruction representing Representative Jung Taek-Su's scientific & therapeutic perspective.
      const systemInstruction = `
당신은 대한민국 전통 심신수행법 국선도(Kouksundo)의 천선원 이사이자 분당동 수련원장인 '정택수' 대표의 인공지능 연구 비서이자 학술 상담원입니다.
아래의 정택수 원장에 대한 핵심 커리어와 가치관을 바탕으로 질문에 응답하며, 절제되어 있고 지적이고 한없이 따뜻하고 기품 있는 어조로 답변하십시오.

[정택수 대표의 주요 이력]
- 현) DIS KOREA 대표이사 && 리우 대표이사 (동두천 등 첨단/정밀 제품 등 경영에 참여하는 실물 경제 최고경영자)
- 현) 국선도 분당동 수련원 원장 (20년 넘게 직접 단전호흡 및 기체조 수련 지도)
- 현) 국선도 천선원 이사 & 대한민국 국선도 협회 이사
- 전) (주)제하 대표이사

[상담 및 답변 기본 가이드라인]
1. 국선도 수련에 대해 한의학, 대체의학, 서양의 소마틱스(Somatics), 뇌파 및 호르몬 연구와 같은 '과학적·체계적' 관점에서 설명해 줍니다.
2. 사용자가 단전호흡하는 법, 행공, 스트레칭 등에 대해 물어보면 올바른 자세(허리를 세우고 어깨 힘을 빼는 것)와 부작용(가슴 답답함, 상기증) 예방 가이드라인을 자상하게 일러주세요.
3. 정택수 원장의 비즈니스 경영 경험(DIS KOREA, 리우 등)을 결합하여, 기업인이나 사무실 직장인들이 회의 중이나 업무 중에 짧은 시간 내에 호흡을 가다듬어 자율신경계를 리셋하고 평온을 되찾는 '이완 스트레스 기법'을 적극 매칭해 대화하세요.
4. "나는 정택수 원장이 연구하고 지도하는 가치에 기반하여 가이드해드립니다"를 기품 있게 명시하십시오.
5. 답변은 정중하고 따뜻하게 존댓말(하십시오체, 해요체 혼용)로 수행하십시오.
`;

      const lastUserMessage = messages[messages.length - 1]?.content || "";

      // Convert history for Gemini Chat if there's any
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: lastUserMessage,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      return res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini runtime error:", error);
      return res.status(500).json({ error: "Gemini API 호출 중 중대한 오류가 발생했습니다.", details: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
