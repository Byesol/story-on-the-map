export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface AppRecord {
  id: string;
  userId: string;
  userName: string;
  location: Location;
  image: string;
  memo: string;
  hashtags: string[];
  icon: string;
  createdAt: string;
  time?: string;
  likes: number;
  comments: Comment[];
  isLiked: boolean;
  mood?: 'smile' | 'frown' | 'meh';
}

export interface User {
  id: string;
  name: string;
  age: number;
  occupation: string;
  isFriend: boolean;
}

export const CURRENT_USER_LOCATION: Location = {
  lat: 37.5665,
  lng: 126.9780,
  address: "서울시 중구 명동"
};

export const mockUsers: User[] = [
  { id: "1", name: "김다은", age: 28, occupation: "UI/UX 디자이너", isFriend: false }, // 본인
  { id: "2", name: "이민수", age: 31, occupation: "개발자", isFriend: true },
  { id: "3", name: "박지영", age: 26, occupation: "마케터", isFriend: true },
  { id: "4", name: "최현우", age: 29, occupation: "사진작가", isFriend: true },
  { id: "5", name: "정소영", age: 27, occupation: "카페사장", isFriend: true },
  { id: "6", name: "김태호", age: 33, occupation: "건축가", isFriend: true },
  { id: "7", name: "윤서연", age: 25, occupation: "학생", isFriend: true },
  { id: "8", name: "장민혁", age: 30, occupation: "요리사", isFriend: true },
];

export const mockRecords: AppRecord[] = [
  // 2023년 기록들
  {
    id: "1",
    userId: "1",
    userName: "김다은",
    location: { lat: 37.5547, lng: 126.9707, address: "서울시 중구 남대문시장" },
    image: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&h=300&fit=crop",
    memo: "남대문시장에서 맛있는 칼국수를 먹었어요! 진짜 맛있었던 하루",
    hashtags: ["맛집", "전통시장", "칼국수"],
    icon: "food",
    createdAt: "2023-05-15", 
    time: "12:30",
    likes: 8,
    comments: [],
    isLiked: false,
    mood: "smile"
  },
  {
    id: "2",
    userId: "1", 
    userName: "김다은",
    location: { lat: 37.5796, lng: 126.9770, address: "서울시 종로구 경복궁" },
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    memo: "경복궁 단풍이 너무 아름다워요 🍁",
    hashtags: ["단풍", "궁궐", "가을", "힐링"],
    icon: "landscape",
    createdAt: "2023-10-28",
    time: "15:20", 
    likes: 12,
    comments: [],
    isLiked: false,
    mood: "smile"
  },
  
  // 2024년 기록들 
  {
    id: "3",
    userId: "2",
    userName: "이민수", 
    location: { lat: 37.5172, lng: 127.0473, address: "서울시 강남구 강남역" },
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop",
    memo: "강남역 근처 새로 생긴 카페에서 친구들과 수다떨기",
    hashtags: ["카페", "친구", "강남", "수다"],
    icon: "cafe",
    createdAt: "2024-03-12",
    time: "14:15",
    likes: 5,
    comments: [],
    isLiked: true,
    mood: "smile"
  },
  {
    id: "4",
    userId: "1",
    userName: "김다은",
    location: { lat: 37.5519, lng: 126.9918, address: "서울시 중구 동대문디자인플라자" },
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
    memo: "DDP에서 열린 전시회가 정말 인상적이었어요!",
    hashtags: ["전시", "예술", "DDP", "문화"],
    icon: "entertainment",
    createdAt: "2024-06-20",
    time: "16:45",
    likes: 15,
    comments: [],
    isLiked: false,
    mood: "smile"
  },
  {
    id: "5", 
    userId: "3",
    userName: "박지영",
    location: { lat: 37.5636, lng: 126.9675, address: "서울시 중구 명동성당" },
    image: "https://images.unsplash.com/photo-1520637836862-4d197d17c91a?w=400&h=300&fit=crop",
    memo: "명동성당의 고요한 분위기에서 마음이 평온해졌어요",
    hashtags: ["힐링", "성당", "명동", "평온"],
    icon: "landscape", 
    createdAt: "2024-08-05",
    time: "11:00",
    likes: 7,
    comments: [],
    isLiked: false,
    mood: "meh"
  },

  // 2025년 기록들 (더 많이)
  {
    id: "6",
    userId: "1",
    userName: "김다은", 
    location: { lat: 37.5665, lng: 126.9780, address: "서울시 중구 명동거리" },
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    memo: "새해 첫 쇼핑! 명동에서 예쁜 옷 많이 샀어요 💕",
    hashtags: ["쇼핑", "새해", "명동", "옷"],
    icon: "entertainment",
    createdAt: "2025-01-03",
    time: "15:30",
    likes: 23,
    comments: [],
    isLiked: false,
    mood: "smile"
  },
  {
    id: "7",
    userId: "4",
    userName: "최현우",
    location: { lat: 37.5758, lng: 126.9768, address: "서울시 종로구 인사동" },
    image: "https://images.unsplash.com/photo-1544427920-c49ccfb85579?w=400&h=300&fit=crop",
    memo: "인사동 전통찻집에서 따뜻한 차 한잔 ☕",
    hashtags: ["전통", "차", "인사동", "힐링"],
    icon: "cafe",
    createdAt: "2025-01-08",
    time: "13:20",
    likes: 9,
    comments: [],
    isLiked: true,
    mood: "smile"
  },
  {
    id: "8",
    userId: "1",
    userName: "김다은",
    location: { lat: 37.5703, lng: 126.9914, address: "서울시 종로구 창덕궁" },
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    memo: "창덕궁 후원 산책, 겨울 풍경이 너무 아름다워요 ❄️",
    hashtags: ["궁궐", "겨울", "산책", "아름다운"],
    icon: "landscape",
    createdAt: "2025-01-12",
    time: "10:45",
    likes: 18,
    comments: [],
    isLiked: false,
    mood: "smile"
  },
  {
    id: "9",
    userId: "5",
    userName: "정소영",
    location: { lat: 37.5512, lng: 126.9882, address: "서울시 중구 을지로" },
    image: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&h=300&fit=crop",
    memo: "을지로 골목 맛집에서 친구들과 회식! 분위기 너무 좋았어요",
    hashtags: ["맛집", "을지로", "친구", "회식"],
    icon: "food",
    createdAt: "2025-01-15",
    time: "19:30",
    likes: 11,
    comments: [],
    isLiked: false,
    mood: "smile"
  },
  {
    id: "10",
    userId: "1",
    userName: "김다은",
    location: { lat: 37.5595, lng: 126.9745, address: "서울시 중구 청계천" },
    image: "https://images.unsplash.com/photo-1520637736862-4d197d17c91a?w=400&h=300&fit=crop",
    memo: "청계천 야경이 정말 로맨틱해요 ✨ 혼자 산책하기 좋은 곳",
    hashtags: ["야경", "청계천", "로맨틱", "산책"],
    icon: "landscape",
    createdAt: "2025-01-18",
    time: "20:15",
    likes: 16,
    comments: [],
    isLiked: false,
    mood: "smile"
  },
  {
    id: "11",
    userId: "6",
    userName: "김태호",
    location: { lat: 37.5443, lng: 127.0557, address: "서울시 강남구 코엑스몰" },
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
    memo: "코엑스 아쿠아리움에서 힐링 타임! 🐠",
    hashtags: ["아쿠아리움", "힐링", "코엑스", "물고기"],
    icon: "entertainment",
    createdAt: "2025-01-20",
    time: "14:00",
    likes: 13,
    comments: [],
    isLiked: true,
    mood: "smile"
  },
  {
    id: "12",
    userId: "1",
    userName: "김다은",
    location: { lat: 37.5794, lng: 126.9770, address: "서울시 종로구 북촌한옥마을" },
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    memo: "북촌한옥마을에서 한복 입고 사진 찍기! 너무 예뻐요 📸",
    hashtags: ["한복", "북촌", "전통", "사진"],
    icon: "entertainment",
    createdAt: "2025-01-22",
    time: "13:30",
    likes: 25,
    comments: [],
    isLiked: false,
    mood: "smile"
  },
  {
    id: "13",
    userId: "7",
    userName: "윤서연",
    location: { lat: 37.5509, lng: 126.9882, address: "서울시 중구 덕수궁" },
    image: "https://images.unsplash.com/photo-1520637836862-4d197d17c91a?w=400&h=300&fit=crop",
    memo: "덕수궁 돌담길 걸으면서 힐링했어요. 도심 속 오아시스 같은 곳 🌿",
    hashtags: ["덕수궁", "돌담길", "힐링", "도심"],
    icon: "landscape",
    createdAt: "2025-01-24",
    time: "16:20",
    likes: 8,
    comments: [],
    isLiked: false,
    mood: "meh"
  },
  {
    id: "14",
    userId: "1",
    userName: "김다은",
    location: { lat: 37.5172, lng: 127.0473, address: "서울시 강남구 선릉역" },
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop",
    memo: "선릉역 근처 새로 생긴 디저트 카페! 케이크가 너무 맛있어요 🍰",
    hashtags: ["디저트", "카페", "케이크", "달콤한"],
    icon: "cafe",
    createdAt: "2025-01-26",
    time: "15:45",
    likes: 21,
    comments: [],
    isLiked: false,
    mood: "smile"
  },
  {
    id: "15",
    userId: "8", 
    userName: "장민혁",
    location: { lat: 37.5638, lng: 126.9759, address: "서울시 중구 남산타워" },
    image: "https://images.unsplash.com/photo-1520637836862-4d197d17c91a?w=400&h=300&fit=crop",
    memo: "남산타워에서 본 서울 야경이 환상적이에요! 🌃",
    hashtags: ["남산타워", "야경", "서울", "환상적"],
    icon: "landscape",
    createdAt: "2025-01-28",
    time: "19:00",
    likes: 19,
    comments: [],
    isLiked: true,
    mood: "smile"
  },
  {
    id: "16",
    userId: "1",
    userName: "김다은",
    location: { lat: 37.5400, lng: 127.0700, address: "서울시 강남구 압구정로데오" },
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
    memo: "압구정 로데오거리에서 윈도우 쇼핑! 트렌디한 옷들이 너무 많아요",
    hashtags: ["쇼핑", "압구정", "트렌드", "패션"],
    icon: "entertainment",
    createdAt: "2025-01-30",
    time: "14:30",
    likes: 17,
    comments: [],
    isLiked: false,
    mood: "smile"
  },
  {
    id: "17",
    userId: "2",
    userName: "이민수",
    location: { lat: 37.5760, lng: 126.9769, address: "서울시 종로구 광화문광장" },
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    memo: "광화문 광장에서 역사의 무게를 느껴봅니다",
    hashtags: ["광화문", "역사", "광장", "무게감"],
    icon: "landscape",
    createdAt: "2025-02-01",
    time: "11:15",
    likes: 6,
    comments: [],
    isLiked: false,
    mood: "meh"
  },
  {
    id: "18",
    userId: "1",
    userName: "김다은",
    location: { lat: 37.5506, lng: 126.9910, address: "서울시 중구 장충동족발골목" },
    image: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&h=300&fit=crop",
    memo: "장충동 족발골목에서 진짜 맛있는 족발 발견! 소주 한잔과 함께 🍻",
    hashtags: ["족발", "장충동", "맛집", "소주"],
    icon: "food",
    createdAt: "2025-02-03",
    time: "18:45",
    likes: 20,
    comments: [],
    isLiked: false,
    mood: "smile"
  }
];
