
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
  isPublic?: boolean;
  // Extended properties for running and mood
  isRunning?: boolean;
  distance?: number;
  duration?: string;
  mood?: 'smile' | 'frown' | 'meh';
  icon?: string;
  time?: string;
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
];

const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const twoDaysAgo = new Date(Date.now() - 172800000).toISOString().split('T')[0];
const threeDaysAgo = new Date(Date.now() - 259200000).toISOString().split('T')[0];

export const mockRecords: AppRecord[] = [
  // 오늘의 내 기록들
  {
    id: "my-morning-walk",
    userId: "1",
    userName: "김다은",
    location: { lat: 37.5665, lng: 126.9780, address: "서울 중구 명동길 26" },
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=300&fit=crop",
    memo: "명동 아침 산책, 조용한 시간이 좋아요",
    hashtags: ["산책", "명동", "아침"],
    createdAt: today,
    likes: 8,
    comments: [],
    isPublic: true,
    mood: 'smile',
    icon: 'walk',
    time: "06:45"
  },
  {
    id: "my-lunch-cafe",
    userId: "1",
    userName: "김다은",
    location: { lat: 37.5400, lng: 127.0700, address: "서울 강남구 압구정로 123" },
    image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=400&h=300&fit=crop",
    memo: "압구정 새로 생긴 카페, 분위기 정말 좋아요!",
    hashtags: ["카페", "압구정", "점심"],
    createdAt: today,
    likes: 12,
    comments: [],
    isPublic: true,
    mood: 'smile',
    icon: 'cafe',
    time: "12:30"
  },
  {
    id: "my-evening-food",
    userId: "1",
    userName: "김다은",
    location: { lat: 37.5518, lng: 126.9917, address: "서울 중구 을지로 100" },
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
    memo: "을지로 맛집 발견! 혼자만의 저녁 식사",
    hashtags: ["맛집", "을지로", "저녁"],
    createdAt: today,
    likes: 20,
    comments: [],
    isPublic: true,
    mood: 'smile',
    icon: 'food',
    time: "19:15"
  },
  {
    id: "my-night-view",
    userId: "1",
    userName: "김다은",
    location: { lat: 37.5511, lng: 126.9882, address: "서울 중구 남대문로 120" },
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop",
    memo: "남대문 야경이 이렇게 예쁠 줄이야",
    hashtags: ["야경", "남대문", "밤"],
    createdAt: today,
    likes: 18,
    comments: [],
    isPublic: true,
    mood: 'smile',
    icon: 'landscape',
    time: "21:00"
  },

  // 어제의 내 기록들
  {
    id: "my-yesterday-cafe",
    userId: "1",
    userName: "김다은",
    location: { lat: 37.5662, lng: 126.9779, address: "서울 중구 남산공원길" },
    image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=400&h=300&fit=crop",
    memo: "남산 근처 조용한 카페에서 독서",
    hashtags: ["카페", "남산", "독서"],
    createdAt: yesterday,
    likes: 22,
    comments: [],
    isPublic: true,
    mood: 'smile',
    icon: 'cafe',
    time: "15:00"
  },
  {
    id: "my-yesterday-shopping",
    userId: "1",
    userName: "김다은",
    location: { lat: 37.5563, lng: 126.9236, address: "서울 마포구 홍대입구역" },
    image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400&h=300&fit=crop",
    memo: "홍대 쇼핑! 새 옷 샀어요 💄",
    hashtags: ["홍대", "쇼핑", "패션"],
    createdAt: yesterday,
    likes: 15,
    comments: [],
    isPublic: true,
    mood: 'smile',
    icon: 'shopping',
    time: "15:30"
  },

  // 며칠 전 기록들
  {
    id: "my-hanok-cafe",
    userId: "1",
    userName: "김다은",
    location: { lat: 37.5746, lng: 126.9922, address: "서울 종로구 익선동" },
    image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=400&h=300&fit=crop",
    memo: "고요하고 아늑한 분위기의 한옥 카페. 비 오는 날 창가에서 커피 마시니 정말 힐링되네요.",
    hashtags: ["힐링카페", "익선동", "혼자가기좋은"],
    createdAt: twoDaysAgo,
    likes: 20,
    comments: [],
    isPublic: true,
    mood: 'smile',
    icon: 'cafe',
    time: "16:00"
  },
  {
    id: "my-insadong-tea",
    userId: "1",
    userName: "김다은",
    location: { lat: 37.5701, lng: 126.9925, address: "서울 종로구 인사동길 52" },
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    memo: "인사동 전통찻집에서의 여유로운 오후. 차 한 잔의 여유가 이렇게 소중할 줄이야.",
    hashtags: ["인사동", "전통찻집", "여유"],
    createdAt: twoDaysAgo,
    likes: 14,
    comments: [],
    isPublic: true,
    mood: 'smile',
    icon: 'cafe',
    time: "14:45"
  },
  {
    id: "my-seongsu-walk",
    userId: "1",
    userName: "김다은",
    location: { lat: 37.5444, lng: 127.0557, address: "서울 성동구 성수일로 77" },
    image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400&h=300&fit=crop",
    memo: "성수동 카페거리의 독특한 건축물들. 사진 찍기 좋은 곳이 정말 많네요.",
    hashtags: ["성수동", "카페거리", "사진스팟"],
    createdAt: twoDaysAgo,
    likes: 25,
    comments: [],
    isPublic: true,
    mood: 'smile',
    icon: 'landscape',
    time: "13:00"
  },
  {
    id: "my-itaewon-food",
    userId: "1",
    userName: "김다은",
    location: { lat: 37.5349, lng: 126.9941, address: "서울 용산구 이태원로 200" },
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
    memo: "이태원 세계음식 투어! 태국 음식 정말 맛있었어요",
    hashtags: ["이태원", "세계음식", "태국음식"],
    createdAt: threeDaysAgo,
    likes: 17,
    comments: [],
    isPublic: true,
    mood: 'smile',
    icon: 'food',
    time: "18:30"
  },
  {
    id: "my-hangang-walk",
    userId: "1",
    userName: "김다은",
    location: { lat: 37.5311, lng: 126.9613, address: "서울 용산구 한강대로 405" },
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=300&fit=crop",
    memo: "한강 산책길, 석양이 너무 예뻐요. 스트레스가 다 풀리는 느낌",
    hashtags: ["한강", "산책", "석양"],
    createdAt: threeDaysAgo,
    likes: 24,
    comments: [],
    isPublic: true,
    mood: 'smile',
    icon: 'walk',
    time: "17:45"
  },
  {
    id: "my-apgujeong-cafe",
    userId: "1",
    userName: "김다은",
    location: { lat: 37.5274, lng: 127.0286, address: "서울 강남구 압구정로 317" },
    image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=400&h=300&fit=crop",
    memo: "압구정 루프탑 카페, 뷰가 정말 끝내줘요!",
    hashtags: ["압구정", "루프탑카페", "뷰맛집"],
    createdAt: threeDaysAgo,
    likes: 28,
    comments: [],
    isPublic: true,
    mood: 'smile',
    icon: 'cafe',
    time: "15:00"
  },
  {
    id: "my-jamsil-walk",
    userId: "1",
    userName: "김다은",
    location: { lat: 37.513, lng: 127.1, address: "서울 송파구 잠실한강공원" },
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=300&fit=crop",
    memo: "잠실 한강공원 산책, 롯데타워 보면서 걷기 좋아요",
    hashtags: ["잠실", "한강공원", "산책"],
    createdAt: threeDaysAgo,
    likes: 19,
    comments: [],
    isPublic: true,
    mood: 'smile',
    icon: 'walk',
    time: "19:00"
  },
  {
    id: "my-myeongdong-snack",
    userId: "1",
    userName: "김다은",
    location: { lat: 37.5636, lng: 126.9827, address: "서울 중구 명동8나길 16" },
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
    memo: "명동 길거리 음식 투어! 호떡이 제일 맛있었어요",
    hashtags: ["명동", "길거리음식", "호떡"],
    createdAt: threeDaysAgo,
    likes: 21,
    comments: [],
    isPublic: true,
    mood: 'smile',
    icon: 'snack',
    time: "16:45"
  }
];

export const CURRENT_USER_LOCATION = {
  lat: 37.5059,
  lng: 127.0583,
  address: "서울 강남구 선릉역"
};
