import { ProfileData, Publication } from '../types';

export const PROFILE_DATA: ProfileData = {
  name: "정택수",
  englishName: "Taek-Su Jeong",
  photoUrl: "https://soom4u.co.kr/logo.png",
  email: "ttsjeong1@gmail.com",
  titles: [
    "현 DIS KOREA 대표이사",
    "현 리우 대표이사",
    "현 국선도 분당동 수련원 원장",
    "현 국선도 천선원 이사",
    "현 대한국선도협회 이사",
    "이전 주식회사 한하 대표이사"
  ],
  websites: [
    { name: "국선도 분당동 수련원 공식 홈페이지", url: "https://soom4u.co.kr/" }
  ],
  biography:
    "정택수 대표는 20년 이상 비즈니스 경영과 전통 국선도 수련을 병행하며, 직장인과 경영자의 스트레스 조절, 호흡 수련, 몸과 마음의 안정에 관한 연구를 이어오고 있습니다. 국선도 천선원 이사와 분당동 수련원 원장으로 활동하며 전통 수련법과 현대적 웰니스 관점을 연결하는 실천적 연구를 진행하고 있습니다.",
  researchInterests: [
    "전통 국선도 단전호흡의 생리학적 효과와 자율신경 안정",
    "기업가와 직장인의 스트레스 완화 및 회복 탄력성 향상",
    "호흡, 명상, 자세 정렬을 활용한 몸-마음 통합 수련",
    "대체의학적 건강관리와 전통 수련법의 현대적 적용"
  ]
};

export const PUBLICATIONS_DATA: Publication[] = [
  {
    id: "pub-1",
    title: "국선도 단전호흡 수련이 기업 최고경영자의 직무 스트레스와 자율신경 반응에 미치는 영향",
    authors: "정택수",
    journal: "통합 심신건강 연구",
    year: 2024,
    category: "Journal Paper",
    link: "https://soom4u.co.kr/",
    abstract:
      "본 연구는 높은 책임과 의사결정 부담을 가진 기업 경영자를 대상으로 국선도 단전호흡 수련이 스트레스 지표와 자율신경 안정에 미치는 영향을 살펴본다. 규칙적인 호흡 수련은 긴장 완화, 집중력 회복, 정서 안정에 긍정적인 도움을 줄 수 있음을 제안한다."
  },
  {
    id: "pub-2",
    title: "전통 단전호흡의 복식 호흡 패턴과 생리학적 메커니즘 분석",
    authors: "정택수",
    journal: "대체의학과 심신수련",
    year: 2023,
    category: "Journal Paper",
    link: "https://soom4u.co.kr/",
    abstract:
      "전통 단전호흡 수련에서 나타나는 느린 호흡, 자세 정렬, 주의 집중이 심박 변이도와 이완 반응에 어떤 방식으로 연결되는지 분석한다. 연구는 호흡 리듬과 신체 감각 인식이 수련 안정성에 중요하다는 점을 강조한다."
  },
  {
    id: "pub-3",
    title: "직장인을 위한 국선도 준비 기체조와 자세 정렬 프로그램",
    authors: "정택수",
    journal: "분당 국선도 수련 보고서",
    year: 2022,
    category: "Technical Report",
    link: "https://soom4u.co.kr/",
    abstract:
      "장시간 앉아서 일하는 직장인을 위해 목, 어깨, 허리의 긴장을 완화하고 호흡을 편안하게 만드는 준비 기체조 프로그램을 정리한다. 프로그램은 짧은 시간 안에 적용할 수 있는 움직임과 호흡 안내를 중심으로 구성된다."
  },
  {
    id: "pub-4",
    title: "단전호흡 입문자를 위한 실전 안내서",
    authors: "정택수",
    journal: "수련 교재",
    year: 2021,
    category: "Book",
    link: "https://soom4u.co.kr/",
    abstract:
      "처음 단전호흡을 접하는 수련자를 위해 무리한 힘주기와 과도한 멈춤을 피하고, 편안한 자세와 자연스러운 호흡으로 시작하는 방법을 안내한다."
  }
];
