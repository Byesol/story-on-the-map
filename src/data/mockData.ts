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
const threeDaysAgo = new Date(Date.now() - 259200000).toISOString().split('T')[0];

export const mockRecords: AppRecord[] = [
  // 오늘의 내 런닝 기록들
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
    isPublic: true,
    isRunning: true,
    distance: 5.2,
    duration: "32:15",
    mood: 'smile',
    icon: 'running',
    time: "07:30",
    isRouteRecord: true,
    routeCoordinates: [
      [127.0583, 37.5059], [127.0590, 37.5065], [127.0595, 37.5072], [127.0600, 37.5080],
      [127.0605, 37.5088], [127.0610, 37.5095], [127.0615, 37.5102], [127.0620, 37.5110],
      [127.0615, 37.5118], [127.0610, 37.5125], [127.0605, 37.5132], [127.0600, 37.5140],
      [127.0595, 37.5147], [127.0590, 37.5154], [127.0585, 37.5161], [127.0580, 37.5168],
      [127.0575, 37.5175], [127.0570, 37.5182], [127.0565, 37.5189], [127.0560, 37.5196],
      [127.0555, 37.5203], [127.0550, 37.5210], [127.0545, 37.5217], [127.0540, 37.5224],
      [127.0535, 37.5231], [127.0583, 37.5059]
    ]
  },
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
    memo: "을지로 맛집 발견! 친구들과 저녁 식사",
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
    id: "my-yesterday-run",
    userId: "1",
    userName: "김다은",
    location: { lat: 37.5662, lng: 126.9779, address: "서울 중구 남산공원길" },
    image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop",
    memo: "남산 런닝코스 완주! 힘들었지만 뿌듯해요",
    hashtags: ["런닝", "남산", "운동"],
    createdAt: yesterday,
    likes: 22,
    comments: [],
    isPublic: true,
    isRunning: true,
    distance: 7.5,
    duration: "45:30",
    mood: 'smile',
    icon: 'running',
    time: "07:00",
    isRouteRecord: true,
    routeCoordinates: [
      [126.9779, 37.5662], [126.9785, 37.5670], [126.9791, 37.5678], [126.9797, 37.5686],
      [126.9803, 37.5694], [126.9809, 37.5702], [126.9815, 37.5710], [126.9821, 37.5718],
      [126.9815, 37.5726], [126.9809, 37.5734], [126.9803, 37.5742], [126.9797, 37.5750],
      [126.9791, 37.5758], [126.9785, 37.5766], [126.9779, 37.5662]
    ]
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

  // 친구들의 다양한 기록들
  {
    id: "friend-gangnam-cafe",
    userId: "2",
    userName: "정호진",
    location: { lat: 37.5072, lng: 127.0494, address: "서울 강남구 선릉로 514" },
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop",
    memo: "조용하고 아늑한 분위기의 카페. 작업하기 좋아요.",
    hashtags: ["선릉카페", "조용한카페", "작업하기좋은"],
    createdAt: today,
    likes: 8,
    comments: [],
    isPublic: true,
    mood: 'smile',
    icon: 'cafe',
    time: "14:15"
  },
  {
    id: "friend-pasta",
    userId: "2",
    userName: "정호진",
    location: { lat: 37.5090, lng: 127.0543, address: "서울 강남구 삼성로 508" },
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop",
    memo: "선릉역 근처 파스타 맛집! 데이트하기 딱 좋아요.",
    hashtags: ["선릉맛집", "파스타", "데이트"],
    createdAt: yesterday,
    likes: 15,
    comments: [
      { id: "c2", userId: "1", userName: "김다은", content: "여기 파스타 진짜 맛있어요!", createdAt: yesterday },
      { id: "c3", userId: "3", userName: "이주연", content: "다음에 꼭 가봐야겠네요", createdAt: today }
    ],
    isPublic: true,
    mood: 'smile',
    icon: 'food',
    time: "19:30"
  },
  {
    id: "friend-night-walk",
    userId: "3",
    userName: "이주연",
    location: { lat: 37.5065, lng: 127.0589, address: "서울 강남구 테헤란로 503" },
    image: "https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=400&h=300&fit=crop",
    memo: "퇴근길에 올려다본 오피스 빌딩. 오늘도 수고했다!",
    hashtags: ["선릉", "야경", "일상"],
    createdAt: yesterday,
    likes: 6,
    comments: [],
    isPublic: true,
    mood: 'meh',
    icon: 'walk',
    time: "18:45"
  },
  {
    id: "friend-running-morning",
    userId: "4",
    userName: "장수빈",
    location: { lat: 37.5172, lng: 127.0473, address: "서울 강남구 봉은사로 619" },
    image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop",
    memo: "봉은사 주변 아침 런닝! 공기가 정말 좋아요",
    hashtags: ["런닝", "봉은사", "아침운동"],
    createdAt: today,
    likes: 18,
    comments: [],
    isPublic: true,
    isRunning: true,
    distance: 4.2,
    duration: "28:45",
    mood: 'smile',
    icon: 'running',
    time: "07:45",
    isRouteRecord: true,
    routeCoordinates: [
      [127.0473, 37.5172], [127.0479, 37.5180], [127.0485, 37.5188], [127.0491, 37.5196],
      [127.0497, 37.5204], [127.0503, 37.5212], [127.0497, 37.5220], [127.0491, 37.5228],
      [127.0485, 37.5236], [127.0479, 37.5244], [127.0473, 37.5172]
    ]
  },
  {
    id: "friend-hongdae-show",
    userId: "5",
    userName: "박지훈",
    location: { lat: 37.5563, lng: 126.9236, address: "서울 마포구 홍익로 3길" },
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
    memo: "홍대 거리공연 구경하다가 찍은 사진. 젊은 에너지가 느껴져요!",
    hashtags: ["홍대", "거리공연", "청춘"],
    createdAt: today,
    likes: 23,
    comments: [],
    isPublic: true,
    mood: 'smile',
    icon: 'entertainment',
    time: "20:15"
  },
  {
    id: "friend-hongdae-cafe",
    userId: "6",
    userName: "최민수",
    location: { lat: 37.5535, lng: 126.9224, address: "서울 마포구 와우산로 29길" },
    image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=400&h=300&fit=crop",
    memo: "홍대 골목길의 숨은 카페. 분위기 정말 좋아요.",
    hashtags: ["홍대카페", "골목카페", "힐링"],
    createdAt: yesterday,
    likes: 18,
    comments: [],
    isPublic: true,
    mood: 'smile',
    icon: 'cafe',
    time: "15:30"
  },
  {
    id: "friend-hanok-cafe",
    userId: "7",
    userName: "한예린",
    location: { lat: 37.5746, lng: 126.9922, address: "서울 종로구 익선동" },
    image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=400&h=300&fit=crop",
    memo: "고요하고 아늑한 분위기의 한옥 카페. 비 오는 날 창가에서 커피 마시니 정말 힐링되네요.",
    hashtags: ["힐링카페", "익선동", "혼자가기좋은"],
    createdAt: twoDaysAgo,
    likes: 20,
    comments: [
      { id: "c4", userId: "5", userName: "박지훈", content: "분위기 진짜 좋네요!", createdAt: twoDaysAgo }
    ],
    isPublic: true,
    mood: 'smile',
    icon: 'cafe',
    time: "16:00"
  },
  {
    id: "friend-insadong-tea",
    userId: "8",
    userName: "윤서연",
    location: { lat: 37.5701, lng: 126.9925, address: "서울 종로구 인사동길 52" },
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    memo: "인사동 전통찻집에서의 여유로운 오후. 차 한 잔의 여유가 이렇게 소중할 줄이야.",
    hashtags: ["인사동", "전통찻집", "여유"],
    createdAt: today,
    likes: 14,
    comments: [],
    isPublic: true,
    mood: 'smile',
    icon: 'cafe',
    time: "14:45"
  },
  {
    id: "friend-seongsu-walk",
    userId: "9",
    userName: "조현우",
    location: { lat: 37.5444, lng: 127.0557, address: "서울 성동구 성수일로 77" },
    image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400&h=300&fit=crop",
    memo: "성수동 카페거리의 독특한 건축물들. 사진 찍기 좋은 곳이 정말 많네요.",
    hashtags: ["성수동", "카페거리", "사진스팟"],
    createdAt: yesterday,
    likes: 25,
    comments: [],
    isPublic: true,
    mood: 'smile',
    icon: 'landscape',
    time: "13:00"
  },
  {
    id: "friend-gangbuk-run",
    userId: "10",
    userName: "김소영",
    location: { lat: 37.6392, lng: 127.0257, address: "서울 강북구 북한산로 661" },
    image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop",
    memo: "북한산 둘레길 런닝! 자연 속에서 뛰니까 너무 좋아요",
    hashtags: ["북한산", "런닝", "자연"],
    createdAt: today,
    likes: 30,
    comments: [],
    isPublic: true,
    isRunning: true,
    distance: 6.8,
    duration: "42:20",
    mood: 'smile',
    icon: 'running',
    time: "08:30",
    isRouteRecord: true,
    routeCoordinates: [
      [127.0257, 37.6392], [127.0263, 37.6400], [127.0269, 37.6408], [127.0275, 37.6416],
      [127.0281, 37.6424], [127.0287, 37.6432], [127.0293, 37.6440], [127.0299, 37.6448],
      [127.0305, 37.6456], [127.0311, 37.6464], [127.0257, 37.6392]
    ]
  },
  {
    id: "friend-itaewon-food",
    userId: "2",
    userName: "정호진",
    location: { lat: 37.5349, lng: 126.9941, address: "서울 용산구 이태원로 200" },
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
    memo: "이태원 세계음식 투어! 태국 음식 정말 맛있었어요",
    hashtags: ["이태원", "세계음식", "태국음식"],
    createdAt: today,
    likes: 17,
    comments: [],
    isPublic: true,
    mood: 'smile',
    icon: 'food',
    time: "18:30"
  },
  {
    id: "friend-hangang-walk",
    userId: "3",
    userName: "이주연",
    location: { lat: 37.5311, lng: 126.9613, address: "서울 용산구 한강대로 405" },
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=300&fit=crop",
    memo: "한강 산책길, 석양이 너무 예뻐요. 스트레스가 다 풀리는 느낌",
    hashtags: ["한강", "산책", "석양"],
    createdAt: yesterday,
    likes: 24,
    comments: [],
    isPublic: true,
    mood: 'meh',
    icon: 'walk',
    time: "17:45"
  },
  {
    id: "friend-yongsan-shopping",
    userId: "4",
    userName: "장수빈",
    location: { lat: 37.5326, lng: 126.9652, address: "서울 용산구 한강로3가 전자상가" },
    image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400&h=300&fit=crop",
    memo: "용산 전자상가에서 새 노트북 샀어요! 작업이 더 수월해질 것 같아요",
    hashtags: ["용산", "전자상가", "쇼핑"],
    createdAt: today,
    likes: 12,
    comments: [],
    isPublic: true,
    mood: 'smile',
    icon: 'shopping',
    time: "16:20"
  },
  {
    id: "friend-apgujeong-cafe",
    userId: "5",
    userName: "박지훈",
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
    id: "friend-jamsil-walk",
    userId: "6",
    userName: "최민수",
    location: { lat: 37.513, lng: 127.1, address: "서울 송파구 잠실한강공원" },
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=300&fit=crop",
    memo: "잠실 한강공원 산책, 롯데타워 보면서 걷기 좋아요",
    hashtags: ["잠실", "한강공원", "산책"],
    createdAt: yesterday,
    likes: 19,
    comments: [],
    isPublic: true,
    mood: 'smile',
    icon: 'walk',
    time: "19:00"
  },
  {
    id: "friend-myeongdong-snack",
    userId: "7",
    userName: "한예린",
    location: { lat: 37.5636, lng: 126.9827, address: "서울 중구 명동8나길 16" },
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
    memo: "명동 길거리 음식 투어! 호떡이 제일 맛있었어요",
    hashtags: ["명동", "길거리음식", "호떡"],
    createdAt: today,
    likes: 21,
    comments: [],
    isPublic: true,
    mood: 'smile',
    icon: 'snack',
    time: "16:45"
  },
  {
    id: "friend-gangnam-entertainment",
    userId: "8",
    userName: "윤서연",
    location: { lat: 37.5012, lng: 127.0396, address: "서울 강남구 강남대로 390" },
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
    memo: "강남역 근처 노래방에서 스트레스 해소! 친구들과 함께여서 더 재밌었어요",
    hashtags: ["강남", "노래방", "친구"],
    createdAt: yesterday,
    likes: 16,
    comments: [],
    isPublic: true,
    mood: 'smile',
    icon: 'entertainment',
    time: "21:30"
  },
  {
    id: "friend-yeouido-run",
    userId: "9",
    userName: "조현우",
    location: { lat: 37.5219, lng: 126.9245, address: "서울 영등포구 여의도한강공원" },
    image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop",
    memo: "여의도 한강공원 런닝! 국회의사당 보면서 뛰니까 기분이 묘해요",
    hashtags: ["여의도", "한강공원", "런닝"],
    createdAt: today,
    likes: 26,
    comments: [],
    isPublic: true,
    isRunning: true,
    distance: 8.3,
    duration: "48:15",
    mood: 'smile',
    icon: 'running',
    time: "06:30",
    isRouteRecord: true,
    routeCoordinates: [
      [126.9245, 37.5219], [126.9251, 37.5227], [126.9257, 37.5235], [126.9263, 37.5243],
      [126.9269, 37.5251], [126.9275, 37.5259], [126.9281, 37.5267], [126.9287, 37.5275],
      [126.9293, 37.5283], [126.9299, 37.5291], [126.9245, 37.5219]
    ]
  },
  {
    id: "friend-sad-day",
    userId: "10",
    userName: "김소영",
    location: { lat: 37.5400, lng: 127.0700, address: "서울 강남구 청담동" },
    image: "https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=400&h=300&fit=crop",
    memo: "오늘 하루 힘들었던 날... 그래도 내일은 더 좋을거야",
    hashtags: ["힘든하루", "청담동", "위로"],
    createdAt: yesterday,
    likes: 8,
    comments: [
      { id: "c5", userId: "1", userName: "김다은", content: "힘내요! 언제든 연락해요", createdAt: yesterday }
    ],
    isPublic: true,
    mood: 'frown',
    icon: 'walk',
    time: "20:30"
  }
];

export const CURRENT_USER_LOCATION = {
  lat: 37.5059,
  lng: 127.0583,
  address: "서울 강남구 선릉역"
};
