
export interface User {
  id: string;
  name: string;
  age: number;
  occupation: string;
  avatar?: string;
  isFriend: boolean;
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

export const mockRecords: Record[] = [
  // 기존 기록들 + 오늘 날짜 추가
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
    ]
  },
  // 강남구 기록들
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
    comments: []
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
    ]
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
    comments: []
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
    comments: []
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
    comments: []
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
    ]
  },
  {
    id: "8",
    userId: "8",
    userName: "윤서연",
    location: { lat: 37.5701, lng: 126.9925, address: "서울 종로구 인사동길 52" },
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    memo: "인사동 전통찻집에서의 여유로운 오후. 차 한 잔의 여유가 이렇게 소중할 줄이야.",
    hashtags: ["인사동", "전통찻집", "여유"],
    createdAt: today,
    likes: 14,
    comments: []
  },
  // 성수동
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
    comments: []
  },
  {
    id: "10",
    userId: "9",
    userName: "조현우",
    location: { lat: 37.5444, lng: 127.0557, address: "서울 성동구 성수일로 77" },
    image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400&h=300&fit=crop",
    memo: "성수동 카페거리의 독특한 건축물들. 사진 찍기 좋은 곳이 정말 많네요.",
    hashtags: ["성수동", "카페거리", "사진스팟"],
    createdAt: yesterday,
    likes: 25,
    comments: []
  },
  // 이태원
  {
    id: "11",
    userId: "10",
    userName: "김소영",
    location: { lat: 37.5347, lng: 126.9951, address: "서울 용산구 이태원로 177" },
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
    memo: "이태원의 다양한 문화가 느껴지는 거리. 국제적인 분위기가 매력적이에요.",
    hashtags: ["이태원", "다문화", "국제적"],
    createdAt: today,
    likes: 19,
    comments: []
  },
  // 한남동
  {
    id: "12",
    userId: "2",
    userName: "정호진",
    location: { lat: 37.5341, lng: 127.0028, address: "서울 용산구 한남대로 42길" },
    image: "https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=400&h=300&fit=crop",
    memo: "한남동 조용한 주택가 골목길. 평화로운 일상의 순간들이 소중해요.",
    hashtags: ["한남동", "골목길", "일상"],
    createdAt: yesterday,
    likes: 11,
    comments: []
  },
  // 서촌
  {
    id: "13",
    userId: "3",
    userName: "이주연",
    location: { lat: 37.5813, lng: 126.9678, address: "서울 종로구 자하문로 1길" },
    image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=400&h=300&fit=crop",
    memo: "서촌의 작은 갤러리 카페. 예술 작품을 보며 마시는 커피가 특별해요.",
    hashtags: ["서촌", "갤러리카페", "예술"],
    createdAt: today,
    likes: 16,
    comments: []
  },
  // 북촌
  {
    id: "14",
    userId: "4",
    userName: "장수빈",
    location: { lat: 37.5815, lng: 126.9835, address: "서울 종로구 북촌로 5길" },
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    memo: "북촌 한옥마을의 고즈넉한 정취. 전통과 현재가 만나는 아름다운 공간이에요.",
    hashtags: ["북촌", "한옥마을", "전통"],
    createdAt: yesterday,
    likes: 22,
    comments: []
  },
  // 삼청동
  {
    id: "15",
    userId: "5",
    userName: "박지훈",
    location: { lat: 37.5858, lng: 126.9835, address: "서울 종로구 삼청로 107" },
    image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400&h=300&fit=crop",
    memo: "삼청동 골목길 산책. 아기자기한 상점들과 카페들이 정말 매력적이에요.",
    hashtags: ["삼청동", "골목길", "산책"],
    createdAt: today,
    likes: 13,
    comments: []
  },
  // 명동
  {
    id: "16",
    userId: "6",
    userName: "최민수",
    location: { lat: 37.5636, lng: 126.9826, address: "서울 중구 명동8길 16" },
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
    memo: "명동 거리의 활기찬 에너지. 사람들의 웃음소리가 들려오는 곳이에요.",
    hashtags: ["명동", "쇼핑", "활기"],
    createdAt: yesterday,
    likes: 17,
    comments: []
  },
  // 동대문
  {
    id: "17",
    userId: "7",
    userName: "한예린",
    location: { lat: 37.5706, lng: 127.0096, address: "서울 종로구 종로 266" },
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=300&fit=crop",
    memo: "동대문 디자인플라자의 독특한 건축미. 미래적이면서도 예술적인 공간이에요.",
    hashtags: ["DDP", "건축", "미래적"],
    createdAt: today,
    likes: 21,
    comments: []
  },
  // 압구정
  {
    id: "18",
    userId: "8",
    userName: "윤서연",
    location: { lat: 37.5274, lng: 127.0280, address: "서울 강남구 압구정로 317" },
    image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=400&h=300&fit=crop",
    memo: "압구정 로데오거리의 세련된 카페. 트렌디한 분위기가 매력적이에요.",
    hashtags: ["압구정", "로데오거리", "트렌디"],
    createdAt: yesterday,
    likes: 15,
    comments: []
  },
  // 청담동
  {
    id: "19",
    userId: "9",
    userName: "조현우",
    location: { lat: 37.5226, lng: 127.0474, address: "서울 강남구 청담동 129" },
    image: "https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=400&h=300&fit=crop",
    memo: "청담동의 고급스러운 분위기. 세련된 거리 풍경이 인상적이에요.",
    hashtags: ["청담동", "고급스러운", "세련된"],
    createdAt: today,
    likes: 18,
    comments: []
  },
  // 신사동
  {
    id: "20",
    userId: "10",
    userName: "김소영",
    location: { lat: 37.5173, lng: 127.0203, address: "서울 강남구 신사동 534" },
    image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400&h=300&fit=crop",
    memo: "신사동 가로수길의 아늑한 카페. 나무 그늘 아래서 마시는 커피가 최고예요.",
    hashtags: ["신사동", "가로수길", "아늑한"],
    createdAt: yesterday,
    likes: 20,
    comments: []
  },
  // 여의도
  {
    id: "21",
    userId: "1",
    userName: "김다은",
    location: { lat: 37.5219, lng: 126.9245, address: "서울 영등포구 여의공원로 68" },
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=300&fit=crop",
    memo: "여의도 한강공원에서 바라본 석양. 하루의 마무리가 이렇게 아름다울 줄이야.",
    hashtags: ["여의도", "한강공원", "석양"],
    createdAt: today,
    likes: 24,
    comments: []
  },
  // 반포한강공원
  {
    id: "22",
    userId: "2",
    userName: "정호진",
    location: { lat: 37.5133, lng: 127.0068, address: "서울 서초구 신반포로 11" },
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop",
    memo: "반포 한강공원에서의 피크닉. 친구들과 함께하는 시간이 정말 소중해요.",
    hashtags: ["반포", "한강공원", "피크닉"],
    createdAt: yesterday,
    likes: 19,
    comments: []
  },
  // 뚝섬한강공원
  {
    id: "23",
    userId: "3",
    userName: "이주연",
    location: { lat: 37.5311, lng: 127.0673, address: "서울 광진구 강변북로 139" },
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
    memo: "뚝섬에서 자전거 타며 바라본 한강. 바람이 참 시원해요.",
    hashtags: ["뚝섬", "자전거", "한강"],
    createdAt: today,
    likes: 16,
    comments: []
  },
  // 건대
  {
    id: "24",
    userId: "4",
    userName: "장수빈",
    location: { lat: 37.5403, lng: 127.0706, address: "서울 광진구 아차산로 272" },
    image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=400&h=300&fit=crop",
    memo: "건대 로데오거리의 활기찬 분위기. 젊은 에너지가 느껴지는 곳이에요.",
    hashtags: ["건대", "로데오거리", "젊음"],
    createdAt: yesterday,
    likes: 17,
    comments: []
  },
  // 신촌
  {
    id: "25",
    userId: "5",
    userName: "박지훈",
    location: { lat: 37.5558, lng: 126.9378, address: "서울 서대문구 신촌로 83" },
    image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400&h=300&fit=crop",
    memo: "신촌 거리의 대학가 분위기. 추억이 새록새록 떠오르는 곳이에요.",
    hashtags: ["신촌", "대학가", "추억"],
    createdAt: today,
    likes: 14,
    comments: []
  },
  // 대학로
  {
    id: "26",
    userId: "6",
    userName: "최민수",
    location: { lat: 37.5817, lng: 127.0021, address: "서울 종로구 대학로 116" },
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    memo: "대학로 소극장 앞에서. 연극 관람 후의 여운이 아직도 남아있어요.",
    hashtags: ["대학로", "연극", "문화"],
    createdAt: yesterday,
    likes: 12,
    comments: []
  },
  // 서울숲
  {
    id: "27",
    userId: "7",
    userName: "한예린",
    location: { lat: 37.5440, lng: 127.0374, address: "서울 성동구 뚝섬로 273" },
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=300&fit=crop",
    memo: "서울숲 산책길에서 만난 평화로운 순간. 자연 속에서의 힐링이 최고예요.",
    hashtags: ["서울숲", "산책", "힐링"],
    createdAt: today,
    likes: 23,
    comments: []
  },
  // 올림픽공원
  {
    id: "28",
    userId: "8",
    userName: "윤서연",
    location: { lat: 37.5220, lng: 127.1213, address: "서울 송파구 올림픽로 424" },
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop",
    memo: "올림픽공원에서의 조깅. 넓은 공간에서 운동하니 기분이 상쾌해요.",
    hashtags: ["올림픽공원", "조깅", "운동"],
    createdAt: yesterday,
    likes: 15,
    comments: []
  },
  // 잠실
  {
    id: "29",
    userId: "9",
    userName: "조현우",
    location: { lat: 37.5133, lng: 127.1000, address: "서울 송파구 올림픽로 300" },
    image: "https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=400&h=300&fit=crop",
    memo: "잠실 롯데타워에서 바라본 서울 전경. 도시의 웅장함에 감탄이 절로 나와요.",
    hashtags: ["잠실", "롯데타워", "전경"],
    createdAt: today,
    likes: 27,
    comments: []
  },
  // 강남역
  {
    id: "30",
    userId: "10",
    userName: "김소영",
    location: { lat: 37.4979, lng: 127.0276, address: "서울 강남구 강남대로 396" },
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
    memo: "강남역 지하상가의 활기찬 모습. 사람들의 발걸음이 빨라 보이네요.",
    hashtags: ["강남역", "지하상가", "활기"],
    createdAt: yesterday,
    likes: 13,
    comments: []
  },
  // 교대역
  {
    id: "31",
    userId: "1",
    userName: "김다은",
    location: { lat: 37.4934, lng: 127.0145, address: "서울 서초구 서초중앙로 230" },
    image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=400&h=300&fit=crop",
    memo: "교대 근처 조용한 카페에서의 독서 시간. 책과 커피가 있는 완벽한 오후예요.",
    hashtags: ["교대", "독서", "카페"],
    createdAt: today,
    likes: 18,
    comments: []
  },
  // 사당
  {
    id: "32",
    userId: "2",
    userName: "정호진",
    location: { lat: 37.4766, lng: 126.9815, address: "서울 동작구 사당로 272" },
    image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400&h=300&fit=crop",
    memo: "사당동 골목길의 정겨운 모습. 동네의 따뜻한 정이 느껴져요.",
    hashtags: ["사당", "골목길", "정겨운"],
    createdAt: yesterday,
    likes: 11,
    comments: []
  },
  // 노량진
  {
    id: "33",
    userId: "3",
    userName: "이주연",
    location: { lat: 37.5140, lng: 126.9430, address: "서울 동작구 노량진로 154" },
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=300&fit=crop",
    memo: "노량진 한강에서 바라본 일몰. 하루의 끝을 알리는 아름다운 순간이에요.",
    hashtags: ["노량진", "한강", "일몰"],
    createdAt: today,
    likes: 22,
    comments: []
  },
  // 용산
  {
    id: "34",
    userId: "4",
    userName: "장수빈",
    location: { lat: 37.5299, lng: 126.9649, address: "서울 용산구 한강대로 405" },
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    memo: "용산역 근처의 모던한 카페. 깔끔한 인테리어가 마음에 들어요.",
    hashtags: ["용산", "모던카페", "깔끔한"],
    createdAt: yesterday,
    likes: 16,
    comments: []
  },
  // 서울역
  {
    id: "35",
    userId: "5",
    userName: "박지훈",
    location: { lat: 37.5547, lng: 126.9707, address: "서울 중구 한강대로 405" },
    image: "https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=400&h=300&fit=crop",
    memo: "서울역의 웅장한 모습. 많은 사람들의 만남과 이별이 있는 곳이에요.",
    hashtags: ["서울역", "웅장한", "만남"],
    createdAt: today,
    likes: 14,
    comments: []
  },
  // 시청
  {
    id: "36",
    userId: "6",
    userName: "최민수",
    location: { lat: 37.5663, lng: 126.9779, address: "서울 중구 세종대로 110" },
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
    memo: "시청 앞 광장에서의 여유로운 산책. 도심 속 열린 공간이 좋아요.",
    hashtags: ["시청", "광장", "산책"],
    createdAt: yesterday,
    likes: 12,
    comments: []
  },
  // 을지로
  {
    id: "37",
    userId: "7",
    userName: "한예린",
    location: { lat: 37.5664, lng: 126.9910, address: "서울 중구 을지로 279" },
    image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=400&h=300&fit=crop",
    memo: "을지로의 레트로한 감성 카페. 옛 정취와 현대적 감각이 어우러져요.",
    hashtags: ["을지로", "레트로", "감성카페"],
    createdAt: today,
    likes: 19,
    comments: []
  },
  // 동묘앞
  {
    id: "38",
    userId: "8",
    userName: "윤서연",
    location: { lat: 37.5714, lng: 127.0091, address: "서울 종로구 창신동 9" },
    image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400&h=300&fit=crop",
    memo: "동묘앞 빈티지 시장의 독특한 분위기. 보물 찾기하는 기분이에요.",
    hashtags: ["동묘앞", "빈티지", "시장"],
    createdAt: yesterday,
    likes: 15,
    comments: []
  },
  // 성신여대입구
  {
    id: "39",
    userId: "9",
    userName: "조현우",
    location: { lat: 37.5928, lng: 127.0167, address: "서울 성북구 보문로 34다길" },
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=300&fit=crop",
    memo: "성신여대 근처 조용한 주택가. 평온한 일상의 아름다움을 느껴요.",
    hashtags: ["성신여대", "주택가", "평온한"],
    createdAt: today,
    likes: 13,
    comments: []
  },
  // 혜화
  {
    id: "40",
    userId: "10",
    userName: "김소영",
    location: { lat: 37.5823, lng: 127.0010, address: "서울 종로구 창경궁로 254" },
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    memo: "혜화동 마로니에 공원 근처. 문화의 향기가 물씬 풍기는 곳이에요.",
    hashtags: ["혜화", "마로니에공원", "문화"],
    createdAt: yesterday,
    likes: 17,
    comments: []
  },
  // 한성대입구
  {
    id: "41",
    userId: "1",
    userName: "김다은",
    location: { lat: 37.5889, lng: 127.0058, address: "서울 성북구 삼선교로 16길" },
    image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=400&h=300&fit=crop",
    memo: "한성대 근처 힐링 카페에서의 오후. 조용하고 아늑한 분위기가 최고예요.",
    hashtags: ["한성대", "힐링카페", "조용한"],
    createdAt: today,
    likes: 20,
    comments: []
  },
  // 성북구청
  {
    id: "42",
    userId: "2",
    userName: "정호진",
    location: { lat: 37.6038, lng: 127.0178, address: "서울 성북구 보문로 168" },
    image: "https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=400&h=300&fit=crop",
    memo: "성북구청 근처 공원에서의 산책. 녹음이 우거진 길이 참 좋아요.",
    hashtags: ["성북구청", "공원", "녹음"],
    createdAt: yesterday,
    likes: 14,
    comments: []
  },
  // 길음
  {
    id: "43",
    userId: "3",
    userName: "이주연",
    location: { lat: 37.6013, lng: 127.0256, address: "서울 성북구 길음로 17" },
    image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400&h=300&fit=crop",
    memo: "길음뉴타운의 현대적인 풍경. 새로운 도시 계획의 결과물이 인상적이에요.",
    hashtags: ["길음", "뉴타운", "현대적"],
    createdAt: today,
    likes: 11,
    comments: []
  },
  // 미아
  {
    id: "44",
    userId: "4",
    userName: "장수빈",
    location: { lat: 37.6270, lng: 127.0301, address: "서울 강북구 도봉로 238" },
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
    memo: "미아리고개에서 바라본 서울 북부. 도시의 다양한 모습을 볼 수 있어요.",
    hashtags: ["미아", "고개", "전망"],
    createdAt: yesterday,
    likes: 16,
    comments: []
  },
  // 수유
  {
    id: "45",
    userId: "5",
    userName: "박지훈",
    location: { lat: 37.6369, lng: 127.0258, address: "서울 강북구 수유로 47" },
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=300&fit=crop",
    memo: "수유리 먹자골목의 정겨운 분위기. 옛 추억이 떠오르는 곳이에요.",
    hashtags: ["수유", "먹자골목", "추억"],
    createdAt: today,
    likes: 18,
    comments: []
  },
  // 쌍문
  {
    id: "46",
    userId: "6",
    userName: "최민수",
    location: { lat: 37.6511, lng: 127.0298, address: "서울 도봉구 도봉로 552" },
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    memo: "쌍문동 카페에서의 여유로운 시간. 동네 사람들의 정이 느껴져요.",
    hashtags: ["쌍문", "동네카페", "여유"],
    createdAt: yesterday,
    likes: 12,
    comments: []
  },
  // 창동
  {
    id: "47",
    userId: "7",
    userName: "한예린",
    location: { lat: 37.6532, lng: 127.0477, address: "서울 도봉구 노해로 435" },
    image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=400&h=300&fit=crop",
    memo: "창동 문화예술단지의 새로운 모습. 문화와 예술이 살아 숨쉬는 공간이에요.",
    hashtags: ["창동", "문화예술", "새로운"],
    createdAt: today,
    likes: 21,
    comments: []
  },
  // 노원
  {
    id: "48",
    userId: "8",
    userName: "윤서연",
    location: { lat: 37.6541, lng: 127.0618, address: "서울 노원구 상계로 380" },
    image: "https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=400&h=300&fit=crop",
    memo: "노원 중앙공원에서의 아침 산책. 신선한 공기와 함께 하루를 시작해요.",
    hashtags: ["노원", "중앙공원", "아침산책"],
    createdAt: today,
    likes: 15,
    comments: []
  },
  // 상계
  {
    id: "49",
    userId: "9",
    userName: "조현우",
    location: { lat: 37.6688, lng: 127.0653, address: "서울 노원구 동일로 1406" },
    image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400&h=300&fit=crop",
    memo: "상계동 주택가의 평범한 일상. 소소한 행복이 담긴 순간들이 소중해요.",
    hashtags: ["상계동", "주택가", "일상"],
    createdAt: yesterday,
    likes: 13,
    comments: []
  },
  // 당고개
  {
    id: "50",
    userId: "10",
    userName: "김소영",
    location: { lat: 37.6705, lng: 127.0918, address: "서울 노원구 노원로 503" },
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=300&fit=crop",
    memo: "당고개역 근처에서 바라본 북한산. 자연과 도시가 어우러진 풍경이 아름다워요.",
    hashtags: ["당고개", "북한산", "자연"],
    createdAt: today,
    likes: 19,
    comments: []
  },
  // 중계
  {
    id: "51",
    userId: "1",
    userName: "김다은",
    location: { lat: 37.6416, lng: 127.0769, address: "서울 노원구 중계로 175" },
    image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=400&h=300&fit=crop",
    memo: "중계동 골목길 카페에서의 독서 시간. 책과 함께하는 조용한 오후예요.",
    hashtags: ["중계동", "골목카페", "독서"],
    createdAt: yesterday,
    likes: 17,
    comments: []
  },
  // 하계
  {
    id: "52",
    userId: "2",
    userName: "정호진",
    location: { lat: 37.6362, lng: 127.0692, address: "서울 노원구 한글비석로 567" },
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    memo: "하계동 근린공원에서의 운동. 건강한 하루를 만들어가는 소중한 시간이에요.",
    hashtags: ["하계동", "근린공원", "운동"],
    createdAt: today,
    likes: 14,
    comments: []
  }
];

export const CURRENT_USER_LOCATION = {
  lat: 37.5059,
  lng: 127.0583,
  address: "서울 강남구 선릉역"
};
