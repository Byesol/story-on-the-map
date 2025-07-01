
export interface User {
  id: string;
  name: string;
  age: number;
  occupation: string;
  avatar?: string;
}

export interface Record {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  image: string;
  memo: string;
  hashtags: string[];
  createdAt: string;
  likes: number;
  comments: Comment[];
  isLiked?: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}

export const mockUsers: User[] = [
  { id: "1", name: "김다은", age: 27, occupation: "콘텐츠 기획자" },
  { id: "2", name: "정호진", age: 24, occupation: "대학생" },
  { id: "3", name: "이주연", age: 32, occupation: "마케터" },
  { id: "4", name: "장수빈", age: 29, occupation: "프리랜서 디자이너" },
  { id: "5", name: "박지훈", age: 26, occupation: "회사원" },
];

export const mockRecords: Record[] = [
  {
    id: "1",
    userId: "1",
    userName: "김다은",
    location: { lat: 37.5059, lng: 127.0583, address: "서울 강남구 테헤란로 417 (선릉역 근처)" },
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=300&fit=crop",
    memo: "점심시간에 잠깐 산책하기 좋은 선릉 공원! 도심 속 힐링 공간이에요.",
    hashtags: ["선릉", "공원", "힐링"],
    createdAt: "2025-06-29",
    likes: 12,
    comments: [
      { id: "c1", userId: "2", userName: "정호진", content: "여기 정말 조용하고 좋더라구요!", createdAt: "2025-06-29" }
    ]
  },
  {
    id: "2",
    userId: "4",
    userName: "장수빈",
    location: { lat: 37.5072, lng: 127.0494, address: "서울 강남구 선릉로 514 (선릉역 근처)" },
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop",
    memo: "조용하고 아늑한 분위기의 카페. 작업하기 좋아요.",
    hashtags: ["선릉카페", "조용한카페", "작업하기좋은"],
    createdAt: "2025-06-28",
    likes: 8,
    comments: []
  },
  {
    id: "3",
    userId: "2",
    userName: "정호진",
    location: { lat: 37.5090, lng: 127.0543, address: "서울 강남구 삼성로 508 (선릉역 근처)" },
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop",
    memo: "선릉역 근처 파스타 맛집! 데이트하기 딱 좋아요.",
    hashtags: ["선릉맛집", "파스타", "데이트"],
    createdAt: "2025-06-27",
    likes: 15,
    comments: [
      { id: "c2", userId: "1", userName: "김다은", content: "여기 파스타 진짜 맛있어요!", createdAt: "2025-06-27" },
      { id: "c3", userId: "3", userName: "이주연", content: "다음에 꼭 가봐야겠네요", createdAt: "2025-06-28" }
    ]
  },
  {
    id: "4",
    userId: "3",
    userName: "이주연",
    location: { lat: 37.5065, lng: 127.0589, address: "서울 강남구 테헤란로 503 (선릉역 근처)" },
    image: "https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=400&h=300&fit=crop",
    memo: "퇴근길에 올려다본 오피스 빌딩. 오늘도 수고했다!",
    hashtags: ["선릉", "야경", "일상"],
    createdAt: "2025-06-26",
    likes: 6,
    comments: []
  },
  {
    id: "5",
    userId: "4",
    userName: "장수빈",
    location: { lat: 37.5746, lng: 126.9922, address: "서울 종로구 익선동" },
    image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=400&h=300&fit=crop",
    memo: "고요하고 아늑한 분위기의 한옥 카페. 비 오는 날 창가에서 커피 마시니 정말 힐링되네요.",
    hashtags: ["힐링카페", "익선동", "혼자가기좋은"],
    createdAt: "2025-06-28",
    likes: 20,
    comments: [
      { id: "c4", userId: "5", userName: "박지훈", content: "분위기 진짜 좋네요!", createdAt: "2025-06-28" }
    ]
  },
  {
    id: "6",
    userId: "1",
    userName: "김다은",
    location: { lat: 37.5447, lng: 127.0560, address: "서울 성동구 성수동" },
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=300&fit=crop",
    memo: "성수동 최신 핫플레이스! 독특한 소품샵들이 많아서 구경하는 재미가 쏠쏠해요.",
    hashtags: ["성수동", "핫플레이스", "쇼핑"],
    createdAt: "2025-06-25",
    likes: 18,
    comments: []
  }
];

export const CURRENT_USER_LOCATION = {
  lat: 37.5059,
  lng: 127.0583,
  address: "서울 강남구 선릉역"
};
