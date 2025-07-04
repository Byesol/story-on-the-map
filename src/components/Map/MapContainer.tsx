import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { mockRecords, CURRENT_USER_LOCATION, AppRecord, mockUsers } from '@/data/mockData';
import { RecordModal } from './RecordModal';
import { CreateRecordModal } from './CreateRecordModal';
import { FilterSheet, FilterOptions } from './FilterSheet';
import MapControls from './MapControls';
import { Calendar, ChevronLeft, ChevronRight, BarChart3, Filter } from 'lucide-react';
import BottomNavigation from '@/components/Layout/BottomNavigation';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { StoryMode } from './StoryMode';
import { DailySummaryCard } from './DailySummaryCard';
import { MemoryAlert } from './MemoryAlert';
import { useLocationMemory } from '@/hooks/useLocationMemory';
import { Smile, Frown, Meh } from 'lucide-react';

const MAPBOX_TOKEN = 'pk.eyJ1IjoidmVjdG9yMTIzIiwiYSI6ImNtY2s0bWY3aTBiYWMya29mc3F6dDhudHQifQ.WtT54vDaSOyf-NquVog3FQ';

const MapContainer = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<AppRecord | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [userLocationMarker, setUserLocationMarker] = useState<mapboxgl.Marker | null>(null);
  const [recordMarkers, setRecordMarkers] = useState<mapboxgl.Marker[]>([]);
  const [currentZoom, setCurrentZoom] = useState(12);
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});
  const location = useLocation();
  const navigate = useNavigate();
  const [showStoryMode, setShowStoryMode] = useState(false);
  const [showDailySummary, setShowDailySummary] = useState(false);
  
  // URL에서 selectedRecordId 파라미터 확인
  const urlParams = new URLSearchParams(location.search);
  const selectedRecordId = urlParams.get('recordId');
  
  // 내 기록만 필터링 (userId = "1")
  const myRecords = mockRecords.filter(record => record.userId === "1");
  
  // 연도별 필터링과 추가 필터링 적용
  let filteredRecords = myRecords.filter(record => {
    const recordYear = new Date(record.createdAt).getFullYear();
    return recordYear === selectedYear;
  });

  // 추가 필터링 적용
  if (filterOptions.hashtag) {
    filteredRecords = filteredRecords.filter(record => 
      record.hashtags.some(tag => tag.toLowerCase().includes(filterOptions.hashtag!.toLowerCase()))
    );
  }

  if (filterOptions.author) {
    filteredRecords = filteredRecords.filter(record => 
      record.userName.toLowerCase().includes(filterOptions.author!.toLowerCase())
    );
  }

  // 사용 가능한 연도들 추출
  const availableYears = Array.from(new Set(myRecords.map(record => 
    new Date(record.createdAt).getFullYear()
  ))).sort((a, b) => b - a);

  const today = new Date().toISOString().split('T')[0];

  // 위치 기반 회상 알림
  const { memories, showMemoryAlert, setShowMemoryAlert } = useLocationMemory(
    CURRENT_USER_LOCATION,
    myRecords
  );

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [CURRENT_USER_LOCATION.lng, CURRENT_USER_LOCATION.lat],
      zoom: 12,
      pitch: 0,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      setMapLoaded(true);
      addUserLocationMarker();
      addRecordMarkers(filteredRecords);
    });

    // 줌 레벨 변경 감지
    map.current.on('zoom', () => {
      if (map.current) {
        const zoom = map.current.getZoom();
        setCurrentZoom(zoom);
        updateMarkerSizes(zoom);
      }
    });

    return () => {
      recordMarkers.forEach(marker => marker.remove());
      userLocationMarker?.remove();
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  // URL 파라미터로 특정 기록 선택
  useEffect(() => {
    if (selectedRecordId && mapLoaded) {
      const record = myRecords.find(r => r.id === selectedRecordId);
      if (record) {
        setSelectedRecord(record);
        // 해당 기록 위치로 지도 이동
        if (map.current) {
          map.current.flyTo({
            center: [record.location.lng, record.location.lat],
            zoom: 16,
            duration: 1500
          });
        }
      }
    }
  }, [selectedRecordId, mapLoaded, myRecords]);

  useEffect(() => {
    if (mapLoaded) {
      // 기존 마커들 제거
      recordMarkers.forEach(marker => marker.remove());
      // 새로운 마커들 추가
      addRecordMarkers(filteredRecords);
    }
  }, [filteredRecords, mapLoaded]);

  const updateMarkerSizes = (zoom: number) => {
    const scaleFactor = Math.max(0.3, Math.min(1.2, zoom / 12));
    
    recordMarkers.forEach(marker => {
      const element = marker.getElement();
      if (element) {
        element.style.transform = `scale(${scaleFactor})`;
      }
    });

    // 사용자 위치 마커도 스케일 조정
    if (userLocationMarker) {
      const element = userLocationMarker.getElement();
      if (element) {
        element.style.transform = `scale(${scaleFactor})`;
      }
    }
  };

  const addUserLocationMarker = () => {
    if (!map.current) return;

    const userMarkerEl = document.createElement('div');
    userMarkerEl.className = 'user-location-marker';
    userMarkerEl.style.zIndex = '3000';
    userMarkerEl.innerHTML = `
      <div class="relative" style="z-index: 3000;">
        <div class="w-6 h-6 bg-blue-500 rounded-full border-3 border-white shadow-lg animate-pulse"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
        <div class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
          내 위치
        </div>
      </div>
    `;

    const marker = new mapboxgl.Marker(userMarkerEl)
      .setLngLat([CURRENT_USER_LOCATION.lng, CURRENT_USER_LOCATION.lat])
      .addTo(map.current);

    setUserLocationMarker(marker);
  };

  const getIconSvg = (iconType: string) => {
    const iconSvgMap: { [key: string]: string } = {
      food: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1-.9 2-2 2h3Zm0 0v7"/></svg>',
      travel: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>',
      landscape: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3 4 8 5-5v11H6V6l2-3z"/></svg>',
      cafe: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v20M14 2v20M4 7h20M4 17h20"/></svg>',
      entertainment: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>'
    };
    return iconSvgMap[iconType] || iconSvgMap.food;
  };

  const getMoodIconSvg = (mood: string) => {
    const moodSvgMap: { [key: string]: string } = {
      smile: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m8 14.5 2 2 4-4"/></svg>',
      frown: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>',
      meh: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" x2="16" y1="15" y2="15"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>'
    };
    return moodSvgMap[mood] || moodSvgMap.meh;
  };

  const addRecordMarkers = (records: AppRecord[]) => {
    if (!map.current) return;

    const markers: mapboxgl.Marker[] = [];
    const scaleFactor = Math.max(0.3, Math.min(1.2, currentZoom / 12));

    records.forEach((record) => {
      const isToday = record.createdAt === today;
      
      const markerEl = document.createElement('div');
      markerEl.className = 'record-marker';
      markerEl.style.transform = `scale(${scaleFactor})`;
      markerEl.style.cursor = 'pointer';
      markerEl.style.position = 'relative';
      markerEl.style.zIndex = '2000';
      
      markerEl.innerHTML = `
        <div class="relative cursor-pointer group" style="z-index: 2000;">
          ${isToday ? `
            <div class="absolute -inset-2 bg-yellow-400 rounded-full animate-pulse opacity-30"></div>
            <div class="absolute -inset-1 bg-yellow-300 rounded-full animate-ping opacity-50"></div>
          ` : ''}
          
          <div class="w-14 h-14 rounded-full overflow-hidden border-3 ${isToday ? 'border-yellow-400' : 'border-white'} shadow-lg hover:scale-110 transition-transform duration-200" style="z-index: 2001;">
            <img src="${record.image}" alt="${record.memo}" class="w-full h-full object-cover" />
          </div>
          
          <div class="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center shadow-sm" style="z-index: 2002;">
            <div class="w-4 h-4 text-gray-600">${getIconSvg(record.icon || 'food')}</div>
          </div>
          
          ${record.mood ? `
            <div class="absolute -top-2 -left-2 w-6 h-6 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center shadow-sm" style="z-index: 2002;">
              <div class="w-3 h-3 ${record.mood === 'smile' ? 'text-green-500' : record.mood === 'frown' ? 'text-red-500' : 'text-yellow-500'}">${getMoodIconSvg(record.mood)}</div>
            </div>
          ` : ''}
          
          <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-2 border-white flex items-center justify-center" style="z-index: 2002;">
            <span class="text-white text-xs font-bold">${record.likes}</span>
          </div>
          
          ${isToday ? `
            <div class="absolute -top-3 -left-1 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold animate-bounce" style="z-index: 2002;">
              TODAY
            </div>
          ` : ''}
          
          <div class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700 bg-white bg-opacity-90 px-2 py-1 rounded whitespace-nowrap shadow-sm" style="z-index: 2001;">
            ${record.userName}
          </div>
        </div>
      `;

      markerEl.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Main map marker clicked:', record.id, record.memo);
        setSelectedRecord(record);
      });

      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([record.location.lng, record.location.lat])
        .addTo(map.current!);

      markers.push(marker);
    });

    setRecordMarkers(markers);
  };

  const moveToCurrentLocation = () => {
    if (!map.current) return;
    map.current.flyTo({
      center: [CURRENT_USER_LOCATION.lng, CURRENT_USER_LOCATION.lat],
      zoom: 15,
      duration: 1000
    });
  };

  const handleCreateRecord = (data: any) => {
    console.log('새 기록 생성:', data);
    
    // 새 기록 생성
    const newRecord: AppRecord = {
      id: `new-${Date.now()}`,
      userId: "1", // 현재 사용자 ID
      userName: "김다은", // 현재 사용자 이름
      location: data.location,
      image: data.image,
      memo: data.memo,
      hashtags: data.hashtags,
      icon: data.icon,
      createdAt: new Date().toISOString().split('T')[0],
      likes: 0,
      comments: [],
      isLiked: false,
      mood: data.mood
    };
    
    setShowCreateModal(false);
  };

  const updateRecordInList = (updatedRecord: AppRecord) => {
    // 기록 업데이트 로직은 내 기록에서만 처리
  };

  const handleMemoryRecordView = (record: AppRecord) => {
    setSelectedRecord(record);
    setShowMemoryAlert(false);
  };

  const handleFilterChange = (newFilterOptions: FilterOptions) => {
    setFilterOptions(newFilterOptions);
  };

  const handleModalClose = () => {
    setSelectedRecord(null);
    // URL에서 recordId 파라미터 제거
    if (selectedRecordId) {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="relative w-full h-screen">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {mapLoaded && (
        <>
          {/* 연도 선택 슬라이더 */}
          <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 z-10">
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const currentIndex = availableYears.indexOf(selectedYear);
                  if (currentIndex < availableYears.length - 1) {
                    setSelectedYear(availableYears[currentIndex + 1]);
                  }
                }}
                disabled={selectedYear === availableYears[availableYears.length - 1]}
              >
                <ChevronLeft size={16} />
              </Button>
              
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-gray-600" />
                <span className="font-bold text-lg">{selectedYear}</span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const currentIndex = availableYears.indexOf(selectedYear);
                  if (currentIndex > 0) {
                    setSelectedYear(availableYears[currentIndex - 1]);
                  }
                }}
                disabled={selectedYear === availableYears[0]}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
            <div className="text-xs text-gray-500 mt-1 text-center">
              {filteredRecords.length}개의 기록
            </div>
          </div>

          {/* 필터 버튼 */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
            <FilterSheet onFilterChange={handleFilterChange}>
              <Button
                variant="outline"
                size="sm"
                className="bg-white shadow-lg"
              >
                <Filter size={16} className="mr-2" />
                필터
              </Button>
            </FilterSheet>
          </div>

          {/* 상단 컨트롤 버튼들 */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
            {/* 오늘 스토리 버튼 */}
            <Button
              onClick={() => setShowStoryMode(true)}
              className="w-auto px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              <Calendar size={16} />
              <span className="text-sm font-medium">오늘 스토리</span>
            </Button>

            {/* 하루 요약 버튼 */}
            <Button
              onClick={() => setShowDailySummary(true)}
              className="w-auto px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            >
              <BarChart3 size={16} />
              <span className="text-sm font-medium">하루 요약</span>
            </Button>
          </div>

          <MapControls 
            onCreateRecord={() => setShowCreateModal(true)}
            onMoveToCurrentLocation={moveToCurrentLocation}
          />
          
          <RecordModal 
            record={selectedRecord}
            isOpen={!!selectedRecord}
            onClose={handleModalClose}
            onUpdateRecord={updateRecordInList}
            onAuthorFilter={() => {}}
          />
          
          <CreateRecordModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateRecord}
            currentLocation={CURRENT_USER_LOCATION}
          />

          <StoryMode
            records={filteredRecords}
            isOpen={showStoryMode}
            onClose={() => setShowStoryMode(false)}
          />

          {/* 하루 요약 카드 */}
          <DailySummaryCard
            records={filteredRecords}
            targetDate={today}
            isOpen={showDailySummary}
            onClose={() => setShowDailySummary(false)}
          />

          {/* 위치 기반 회상 알림 */}
          <MemoryAlert
            memories={memories}
            isOpen={showMemoryAlert}
            onClose={() => setShowMemoryAlert(false)}
            onViewRecord={handleMemoryRecordView}
          />
        </>
      )}
      
      <BottomNavigation />
    </div>
  );
};

export default MapContainer;
