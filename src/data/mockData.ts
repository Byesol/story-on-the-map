export interface User {
  id: string;
  name: string;
  age: number;
  occupation: string;
  avatar?: string;
  isFriend: boolean;
}

export interface AppRecord {
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
  // Extended properties for running and mood
  isRunning?: boolean;
  distance?: number;
  duration?: string;
  mood?: 'smile' | 'frown' | 'meh';
  icon?: string;
  time?: string;
  // Route recording properties
  isRouteRecord?: boolean;
  routeCoordinates?: [number, number][];
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
  { id: "1", name: "김다은", age: 27, occupation: "콘텐츠 기획자", isFriend: true },
  { id: "2", name: "정호진", age: 24, occupation: "대학생", isFriend: true },
  { id: "3", name: "이주연", age: 32, occupation: "마케터", isFriend: true },
  { id: "4", name: "장수빈", age: 29, occupation: "프리랜서 디자이너", isFriend: true },
  { id: "5", name: "박지훈", age: 26, occupation: "회사원", isFriend: true },
  { id: "6", name: "최민수", age: 28, occupation: "개발자", isFriend: true },
  { id: "7", name: "한예린", age: 25, occupation: "그래픽 디자이너", isFriend: true },
  { id: "8", name: "윤서연", age: 30, occupation: "카페 사장", isFriend: true },
  { id: "9", name: "조현우", age: 31, occupation: "사진작가", isFriend: true },
  { id: "10", name: "김소영", age: 26, occupation: "웹툰 작가", isFriend: true },
];

const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const twoDaysAgo = new Date(Date.now() - 172800000).toISOString().split('T')[0];

export const mockRecords: AppRecord[] = [
  // 오늘의 런닝 기록 (경로 포함)
  {
    id: "running-1",
    userId: "1",
    userName: "김다은",
    location: { lat: 37.5059, lng: 127.0583, address: "서울 강남구 선릉역 주변 런닝코스" },
    image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop",
    memo: "오늘의 런닝 완료! 5km 달성 🏃‍♀️",
    hashtags: ["런닝", "건강", "아침운동"],
    createdAt: today,
    likes: 15,
    comments: [],
    isRunning: true,
    distance: 5.2,
    duration: "32:15",
    mood: 'smile',
    icon: 'running',
    time: "07:30",
    isRouteRecord: true,
    routeCoordinates: [
      [127.0583, 37.5059],
      [127.0590, 37.5065],
      [127.0595, 37.5072],
      [127.0600, 37.5080],
      [127.0605, 37.5088],
      [127.0610, 37.5095],
      [127.0615, 37.5102],
      [127.0620, 37.5110],
      [127.0615, 37.5118],
      [127.0610, 37.5125],
      [127.0605, 37.5132],
      [127.0600, 37.5140],
      [127.0595, 37.5147],
      [127.0590, 37.5154],
      [127.0585, 37.5161],
      [127.0580, 37.5168],
      [127.0575, 37.5175],
      [127.0570, 37.5182],
      [127.0565, 37.5189],
      [127.0560, 37.5196],
      [127.0555, 37.5203],
      [127.0550, 37.5210],
      [127.0545, 37.5217],
      [127.0540, 37.5224],
      [127.0535, 37.5231],
      [127.0583, 37.5059] // 시작점으로 돌아옴
    ]
  },
  // 기존 기록들 + 다양한 아이콘과 감정 추가
  {
    id: "1",
    userId: "1",
    userName: "김다은",
    location: { lat: 37.5059, lng: 127.0583, address: "서울 강남구 테헤란로 417 (선릉역 근처)" },
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=300&fit=crop",
    memo: "점심시간에 잠깐 산책하기 좋은 선릉 공원! 도심 속 힐링 공간이에요.",
    hashtags: ["선릉", "공원", "힐링"],
    createdAt: today,
    likes: 12,
    comments: [
      { id: "c1", userId: "2", userName: "정호진", content: "여기 정말 조용하고 좋더라구요!", createdAt: today }
    ],
    mood: 'smile',
    icon: 'landscape',
    time: "12:30"
  },
  {
    id: "2",
    userId: "4",
    userName: "장수빈",
    location: { lat: 37.5072, lng: 127.0494, address: "서울 강남구 선릉로 514" },
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop",
    memo: "조용하고 아늑한 분위기의 카페. 작업하기 좋아요.",
    hashtags: ["선릉카페", "조용한카페", "작업하기좋은"],
    createdAt: yesterday,
    likes: 8,
    comments: [],
    mood: 'smile',
    icon: 'cafe',
    time: "14:15"
  },
  {
    id: "3",
    userId: "2",
    userName: "정호진",
    location: { lat: 37.5090, lng: 127.0543, address: "서울 강남구 삼성로 508" },
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop",
    memo: "선릉역 근처 파스타 맛집! 데이트하기 딱 좋아요.",
    hashtags: ["선릉맛집", "파스타", "데이트"],
    createdAt: "2025-06-27",
    likes: 15,
    comments: [
      { id: "c2", userId: "1", userName: "김다은", content: "여기 파스타 진짜 맛있어요!", createdAt: "2025-06-27" },
      { id: "c3", userId: "3", userName: "이주연", content: "다음에 꼭 가봐야겠네요", createdAt: "2025-06-28" }
    ],
    mood: 'smile',
    icon: 'food',
    time: "19:30"
  },
  {
    id: "4",
    userId: "3",
    userName: "이주연",
    location: { lat: 37.5065, lng: 127.0589, address: "서울 강남구 테헤란로 503" },
    image: "https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=400&h=300&fit=crop",
    memo: "퇴근길에 올려다본 오피스 빌딩. 오늘도 수고했다!",
    hashtags: ["선릉", "야경", "일상"],
    createdAt: "2025-06-26",
    likes: 6,
    comments: [],
    mood: 'meh',
    icon: 'walk',
    time: "18:45"
  },
  // 홍대/마포구
  {
    id: "5",
    userId: "5",
    userName: "박지훈",
    location: { lat: 37.5563, lng: 126.9236, address: "서울 마포구 홍익로 3길" },
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
    memo: "홍대 거리공연 구경하다가 찍은 사진. 젊은 에너지가 느껴져요!",
    hashtags: ["홍대", "거리공연", "청춘"],
    createdAt: today,
    likes: 23,
    comments: [],
    mood: 'smile',
    icon: 'entertainment',
    time: "20:15"
  },
  {
    id: "6",
    userId: "6",
    userName: "최민수",
    location: { lat: 37.5535, lng: 126.9224, address: "서울 마포구 와우산로 29길" },
    image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=400&h=300&fit=crop",
    memo: "홍대 골목길의 숨은 카페. 분위기 정말 좋아요.",
    hashtags: ["홍대카페", "골목카페", "힐링"],
    createdAt: yesterday,
    likes: 18,
    comments: [],
    mood: 'smile',
    icon: 'cafe',
    time: "15:30"
  },
  // 강북/종로구
  {
    id: "7",
    userId: "7",
    userName: "한예린",
    location: { lat: 37.5746, lng: 126.9922, address: "서울 종로구 익선동" },
    image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=400&h=300&fit=crop",
    memo: "고요하고 아늑한 분위기의 한옥 카페. 비 오는 날 창가에서 커피 마시니 정말 힐링되네요.",
    hashtags: ["힐링카페", "익선동", "혼자가기좋은"],
    createdAt: "2025-06-28",
    likes: 20,
    comments: [
      { id: "c4", userId: "5", userName: "박지훈", content: "분위기 진짜 좋네요!", createdAt: "2025-06-28" }
    ],
    mood: 'smile',
    icon: 'cafe',
    time: "16:00"
  },
  {
    id: "travel-1",
    userId: "8",
    userName: "윤서연",
    location: { lat: 37.5701, lng: 126.9925, address: "서울 종로구 인사동길 52" },
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    memo: "인사동 전통찻집에서의 여유로운 오후. 차 한 잔의 여유가 이렇게 소중할 줄이야.",
    hashtags: ["인사동", "전통찻집", "여유"],
    createdAt: today,
    likes: 14,
    comments: [],
    mood: 'smile',
    icon: 'travel',
    time: "14:45"
  },
  // 강남구 기록들
  {
    id: "8",
    userId: "9",
    userName: "조현우",
    location: { lat: 37.5444, lng: 127.0557, address: "서울 성동구 성수일로 77" },
    image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400&h=300&fit=crop",
    memo: "성수동 카페거리의 독특한 건축물들. 사진 찍기 좋은 곳이 정말 많네요.",
    hashtags: ["성수동", "카페거리", "사진스팟"],
    createdAt: yesterday,
    likes: 25,
    comments: [],
    mood: 'smile',
    icon: 'cafe',
    time: "13:00"
  },
  {
    id: "9",
    userId: "1",
    userName: "김다은",
    location: { lat: 37.5447, lng: 127.0560, address: "서울 성동구 성수동" },
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=300&fit=crop",
    memo: "성수동 최신 핫플레이스! 독특한 소품샵들이 많아서 구경하는 재미가 쏠쏠해요.",
    hashtags: ["성수동", "핫플레이스", "쇼핑"],
    createdAt: "2025-06-25",
    likes: 18,
    comments: [],
    mood: 'smile',
    icon: 'shopping',
    time: "11:30"
  },
  // ... (나머지 기록들은 기존과 동일하게 유지)
];

export const CURRENT_USER_LOCATION = {
  lat: 37.5059,
  lng: 127.0583,
  address: "서울 강남구 선릉역"
};
