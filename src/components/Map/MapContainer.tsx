import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { mockRecords, CURRENT_USER_LOCATION, AppRecord, mockUsers } from '@/data/mockData';
import { RecordModal } from './RecordModal';
import { CreateRecordModal } from './CreateRecordModal';
import MapControls from './MapControls';
import { Calendar, ChevronLeft, ChevronRight, Play, Square, BarChart3 } from 'lucide-react';
import BottomNavigation from '@/components/Layout/BottomNavigation';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { StoryMode } from './StoryMode';
import { DailySummaryCard } from './DailySummaryCard';
import { MemoryAlert } from './MemoryAlert';
import { useLocationMemory } from '@/hooks/useLocationMemory';
import { Smile, Frown, Meh } from 'lucide-react';

const MAPBOX_TOKEN = 'pk.eyJ1IjoidmVjdG9yMTIzIiwiYSI6ImNtY2s0bWY3aTBiYWMya29mc3F6dDhudHQifQ.WtT54vDaSOyf-NquVog3FQ';

const iconMap = {
  food: 'Utensils',
  travel: 'Plane', 
  landscape: 'Mountain',
  cafe: 'Coffee',
  entertainment: 'Music'
};

const moodIconMap = {
  smile: Smile,
  frown: Frown,
  meh: Meh
};

const MapContainer = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<AppRecord | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [userLocationMarker, setUserLocationMarker] = useState<mapboxgl.Marker | null>(null);
  const [recordMarkers, setRecordMarkers] = useState<mapboxgl.Marker[]>([]);
  const [currentZoom, setCurrentZoom] = useState(12);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationMarker, setAnimationMarker] = useState<mapboxgl.Marker | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const location = useLocation();
  const [showStoryMode, setShowStoryMode] = useState(false);
  const [showDailySummary, setShowDailySummary] = useState(false);
  
  // URL에서 selectedRecordId 파라미터 확인
  const urlParams = new URLSearchParams(location.search);
  const selectedRecordId = urlParams.get('recordId');
  
  // 내 기록만 필터링 (userId = "1")
  const myRecords = mockRecords.filter(record => record.userId === "1");
  
  // 연도별 필터링
  const filteredRecords = myRecords.filter(record => {
    const recordYear = new Date(record.createdAt).getFullYear();
    return recordYear === selectedYear;
  });

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
      animationMarker?.remove();
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
      entertainment: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
      snack: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11v3a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10V6c0-.6-.4-1-1-1h-4c-.6 0-1 .4-1 1v4H9l-1-1v-2c0-.6-.4-1-1-1H5c-.6 0-1 .4-1 1v7c0 .6.4 1 1 1h2"/><circle cx="7" cy="9" r="2"/></svg>',
      walk: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10V6c0-.6-.4-1-1-1h-4c-.6 0-1 .4-1 1v4H9l-1-1v-2c0-.6-.4-1-1-1H5c-.6 0-1 .4-1 1v7c0 .6.4 1 1 1h2"/><circle cx="7" cy="9" r="2"/></svg>',
      running: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3z"/><path d="M12 5v14l-4-4"/><path d="M12 19l4-4"/></svg>'
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
      
      markerEl.innerHTML = `
        <div class="relative cursor-pointer group">
          ${isToday ? `
            <div class="absolute -inset-2 bg-yellow-400 rounded-full animate-pulse opacity-30"></div>
            <div class="absolute -inset-1 bg-yellow-300 rounded-full animate-ping opacity-50"></div>
          ` : ''}
          
          <div class="w-14 h-14 rounded-full overflow-hidden border-3 ${isToday ? 'border-yellow-400' : 'border-white'} shadow-lg hover:scale-110 transition-transform duration-200">
            <img src="${record.image}" alt="${record.memo}" class="w-full h-full object-cover" />
          </div>
          
          <div class="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center shadow-sm">
            <div class="w-4 h-4 text-gray-600">${getIconSvg(record.icon || 'food')}</div>
          </div>
          
          ${record.mood ? `
            <div class="absolute -top-2 -left-2 w-6 h-6 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center shadow-sm">
              <div class="w-3 h-3 ${record.mood === 'smile' ? 'text-green-500' : record.mood === 'frown' ? 'text-red-500' : 'text-yellow-500'}">${getMoodIconSvg(record.mood)}</div>
            </div>
          ` : ''}
          
          <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
            <span class="text-white text-xs font-bold">${record.likes}</span>
          </div>
          
          ${isToday ? `
            <div class="absolute -top-3 -left-1 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold animate-bounce">
              TODAY
            </div>
          ` : ''}
          
          <div class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700 bg-white bg-opacity-90 px-2 py-1 rounded whitespace-nowrap shadow-sm">
            ${record.userName}
          </div>
        </div>
      `;

      markerEl.addEventListener('click', () => {
        setSelectedRecord(record);
      });

      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([record.location.lng, record.location.lat])
        .addTo(map.current!);

      markers.push(marker);
    });

    setRecordMarkers(markers);
  };

  const startTodaysPathAnimation = async () => {
    if (!map.current || isAnimating) return;

    setIsAnimating(true);
    
    // 내 기록들만 필터링하고 시간순 정렬
    const myRecords = filteredRecords
      .filter(record => record.userId === "1")
      .sort((a, b) => {
        // 시간이 있으면 시간순으로, 없으면 생성 순서대로
        if (a.time && b.time) {
          return a.time.localeCompare(b.time);
        }
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });

    if (myRecords.length === 0) {
      setIsAnimating(false);
      return;
    }

    // 시작점으로 카메라 이동
    const firstRecord = myRecords[0];
    await new Promise(resolve => {
      map.current?.flyTo({
        center: [firstRecord.location.lng, firstRecord.location.lat],
        zoom: 16,
        duration: 2000
      });
      setTimeout(resolve, 2000);
    });

    // 애니메이션 마커 생성
    const animMarkerEl = document.createElement('div');
    animMarkerEl.innerHTML = `
      <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-3 border-white shadow-lg animate-pulse flex items-center justify-center">
        <div class="w-4 h-4 bg-white rounded-full"></div>
      </div>
    `;

    const animMarker = new mapboxgl.Marker(animMarkerEl)
      .setLngLat([firstRecord.location.lng, firstRecord.location.lat])
      .addTo(map.current);

    setAnimationMarker(animMarker);

    // 첫 번째 기록 정보 표시
    const showRecordInfo = (record: AppRecord) => {
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        className: 'route-popup'
      })
      .setLngLat([record.location.lng, record.location.lat])
      .setHTML(`
        <div class="p-3 max-w-xs">
          <div class="flex items-center space-x-2 mb-2">
            <div class="w-8 h-8 rounded-full overflow-hidden">
              <img src="${record.image}" alt="${record.memo}" class="w-full h-full object-cover" />
            </div>
            <div>
              <p class="font-semibold text-sm">${record.userName}</p>
              <p class="text-xs text-gray-500">${record.time || ''}</p>
            </div>
          </div>
          <p class="text-sm mb-2">${record.memo}</p>
          <div class="flex flex-wrap gap-1">
            ${record.hashtags.map(tag => `<span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">#${tag}</span>`).join('')}
          </div>
        </div>
      `)
      .addTo(map.current!);

      return popup;
    };

    let currentPopup = showRecordInfo(firstRecord);

    // 경로 생성을 위한 좌표 배열
    const coordinates: [number, number][] = [[firstRecord.location.lng, firstRecord.location.lat]];
    
    // 각 기록을 순서대로 방문하며 경로 생성
    for (let i = 1; i < myRecords.length; i++) {
      const record = myRecords[i];
      coordinates.push([record.location.lng, record.location.lat]);
      
      // 이전 팝업 제거
      if (currentPopup) {
        currentPopup.remove();
      }

      // 마커 이동
      animMarker.setLngLat([record.location.lng, record.location.lat]);
      
      // 카메라 부드럽게 이동
      map.current.flyTo({
        center: [record.location.lng, record.location.lat],
        zoom: 16,
        duration: 3000
      });

      // 새 기록 정보 표시
      currentPopup = showRecordInfo(record);

      // 경로 업데이트
      const pathId = 'animated-path';
      if (map.current.getSource(pathId)) {
        (map.current.getSource(pathId) as mapboxgl.GeoJSONSource).setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coordinates
          }
        });
      } else {
        map.current.addSource(pathId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coordinates
            }
          }
        });

        map.current.addLayer({
          id: pathId,
          type: 'line',
          source: pathId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#8b5cf6',
            'line-width': 4,
            'line-opacity': 0.8
          }
        });
      }

      // 더 오래 대기하여 천천히 보여주기
      await new Promise(resolve => setTimeout(resolve, 4000));
    }

    // 마지막 팝업도 잠시 보여준 후 제거
    setTimeout(() => {
      if (currentPopup) {
        currentPopup.remove();
      }
    }, 3000);

    // 경로를 더 오래 보여준 후 제거
    setTimeout(() => {
      if (map.current?.getLayer('animated-path')) {
        map.current.removeLayer('animated-path');
        map.current.removeSource('animated-path');
      }
    }, 5000);

    // 애니메이션 마커 제거
    setTimeout(() => {
      animMarker.remove();
      setAnimationMarker(null);
      setIsAnimating(false);
    }, 3000);
  };

  const stopTodaysPathAnimation = () => {
    if (animationMarker) {
      animationMarker.remove();
      setAnimationMarker(null);
    }
    if (map.current?.getLayer('animated-path')) {
      map.current.removeLayer('animated-path');
      map.current.removeSource('animated-path');
    }
    setIsAnimating(false);
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

          {/* 상단 컨트롤 버튼들 */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
            {/* 오늘의 경로 버튼 */}
            <Button
              onClick={isAnimating ? stopTodaysPathAnimation : startTodaysPathAnimation}
              className={`w-auto px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 ${
                isAnimating 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
              }`}
            >
              {isAnimating ? <Square size={16} /> : <Play size={16} />}
              <span className="text-sm font-medium">
                {isAnimating ? '정지' : '오늘의 경로'}
              </span>
            </Button>

            {/* 스토리 모드 버튼 */}
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
            onClose={() => setSelectedRecord(null)}
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
