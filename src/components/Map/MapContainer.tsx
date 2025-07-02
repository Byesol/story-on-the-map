import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { mockRecords, CURRENT_USER_LOCATION, Record, mockUsers } from '@/data/mockData';
import { RecordModal } from './RecordModal';
import { CreateRecordModal } from './CreateRecordModal';
import { MapControls } from './MapControls';
import { FilterSheet, FilterOptions } from './FilterSheet';
import { Filter, Utensils, Plane, Mountain, Coffee, Music, Sandwich, Car } from 'lucide-react';
import BottomNavigation from '@/components/Layout/BottomNavigation';
import { useLocation } from 'react-router-dom';

const MAPBOX_TOKEN = 'pk.eyJ1IjoidmVjdG9yMTIzIiwiYSI6ImNtY2s0bWY3aTBiYWMya29mc3F6dDhudHQifQ.WtT54vDaSOyf-NquVog3FQ';

const iconMap = {
  food: Utensils,
  travel: Plane,
  landscape: Mountain,
  cafe: Coffee,
  entertainment: Music,
  snack: Sandwich,
  walk: Car
};

// Extended Record type with icon property
interface ExtendedRecord extends Record {
  icon?: string;
}

const MapContainer = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<ExtendedRecord | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [userLocationMarker, setUserLocationMarker] = useState<mapboxgl.Marker | null>(null);
  const [recordMarkers, setRecordMarkers] = useState<mapboxgl.Marker[]>([]);
  const [pathLines, setPathLines] = useState<string[]>([]);
  const location = useLocation();
  
  // URL에서 selectedRecordId 파라미터 확인
  const urlParams = new URLSearchParams(location.search);
  const selectedRecordId = urlParams.get('recordId');
  
  // 친구만 볼 수 있도록 필터링
  const friendRecords = mockRecords.filter(record => {
    const user = mockUsers.find(u => u.id === record.userId);
    return user?.isFriend || record.userId === "1"; // 본인 기록도 포함
  }).map(record => ({
    ...record,
    icon: (record as ExtendedRecord).icon || 'food' // Default icon if not present
  })) as ExtendedRecord[];
  
  const [filteredRecords, setFilteredRecords] = useState<ExtendedRecord[]>(friendRecords);
  const [allRecords, setAllRecords] = useState<ExtendedRecord[]>(friendRecords);

  const today = new Date().toISOString().split('T')[0];

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
      addMyRecordPaths();
    });

    return () => {
      recordMarkers.forEach(marker => marker.remove());
      userLocationMarker?.remove();
      if (map.current) {
        // 경로 레이어 제거
        pathLines.forEach(layerId => {
          if (map.current?.getLayer(layerId)) {
            map.current.removeLayer(layerId);
            map.current.removeSource(layerId);
          }
        });
        map.current.remove();
      }
    };
  }, []);

  // URL 파라미터로 특정 기록 선택
  useEffect(() => {
    if (selectedRecordId && mapLoaded) {
      const record = allRecords.find(r => r.id === selectedRecordId);
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
  }, [selectedRecordId, mapLoaded, allRecords]);

  useEffect(() => {
    if (mapLoaded) {
      // 기존 마커들 제거
      recordMarkers.forEach(marker => marker.remove());
      // 새로운 마커들 추가
      addRecordMarkers(filteredRecords);
      // 경로 업데이트
      addMyRecordPaths();
    }
  }, [filteredRecords, mapLoaded]);

  const addUserLocationMarker = () => {
    if (!map.current) return;

    const userMarkerEl = document.createElement('div');
    userMarkerEl.className = 'user-location-marker';
    userMarkerEl.style.zIndex = '3000'; // 더 높은 z-index
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

  const addMyRecordPaths = () => {
    if (!map.current || !mapLoaded) return;

    // 기존 경로 제거
    pathLines.forEach(layerId => {
      if (map.current?.getLayer(layerId)) {
        map.current.removeLayer(layerId);
        map.current.removeSource(layerId);
      }
    });

    // 내 기록들만 필터링하고 날짜순 정렬
    const myRecords = filteredRecords
      .filter(record => record.userId === "1")
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    if (myRecords.length < 2) return;

    const coordinates = myRecords.map(record => [record.location.lng, record.location.lat]);
    const lineId = 'my-path-line';

    // 감성적인 곡선 경로 생성
    if (map.current && !map.current.getSource(lineId)) {
      map.current.addSource(lineId, {
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
        id: lineId,
        type: 'line',
        source: lineId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#ff6b6b',
          'line-width': 3,
          'line-opacity': 0.8,
          'line-dasharray': [2, 2]
        }
      });

      setPathLines([lineId]);
    }
  };

  const getIconComponent = (iconType: string) => {
    const IconComponent = iconMap[iconType as keyof typeof iconMap] || Utensils;
    return IconComponent;
  };

  const getIconSvg = (iconType: string) => {
    const iconSvgMap: { [key: string]: string } = {
      food: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>',
      travel: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>',
      landscape: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3 4 8 5-5v11H6V6l2-3z"/></svg>',
      cafe: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v20M14 2v20M4 7h20M4 17h20"/></svg>',
      entertainment: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
      snack: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11v3a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-3"/><path d="M12 19H4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-3.83"/><path d="m3 11 7.77-6.04a2 2 0 0 1 2.46 0L21 11H3Z"/><path d="M12.97 19.77 7 15h12.5l-3.75 4.5a2 2 0 0 1-2.78.27Z"/></svg>',
      walk: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10V6c0-.6-.4-1-1-1h-4c-.6 0-1 .4-1 1v4H9l-1-1v-2c0-.6-.4-1-1-1H5c-.6 0-1 .4-1 1v7c0 .6.4 1 1 1h2"/><circle cx="7" cy="9" r="2"/></svg>'
    };
    return iconSvgMap[iconType] || iconSvgMap.food;
  };

  const addRecordMarkers = (records: ExtendedRecord[]) => {
    if (!map.current) return;

    const markers: mapboxgl.Marker[] = [];

    records.forEach((record) => {
      const isToday = record.createdAt === today;
      const isMyRecord = record.userId === "1";
      const user = mockUsers.find(u => u.id === record.userId);
      const userName = user?.name || 'Unknown';
      
      const markerEl = document.createElement('div');
      markerEl.className = 'record-marker';
      markerEl.innerHTML = `
        <div class="relative cursor-pointer group">
          <!-- 오늘 기록인 경우 특별한 효과 -->
          ${isToday ? `
            <div class="absolute -inset-2 bg-yellow-400 rounded-full animate-pulse opacity-30"></div>
            <div class="absolute -inset-1 bg-yellow-300 rounded-full animate-ping opacity-50"></div>
          ` : ''}
          
          <!-- 메인 사진 마커 -->
          <div class="w-14 h-14 rounded-full overflow-hidden border-3 ${isToday ? 'border-yellow-400' : 'border-white'} shadow-lg hover:scale-110 transition-transform duration-200 ${isMyRecord ? 'ring-2 ring-blue-400' : ''}">
            <img src="${record.image}" alt="${record.memo}" class="w-full h-full object-cover" />
          </div>
          
          <!-- 아이콘 카테고리 표시 -->
          <div class="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center shadow-sm">
            <div class="w-4 h-4 text-gray-600">${getIconSvg(record.icon || 'food')}</div>
          </div>
          
          <!-- 좋아요 표시 -->
          <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
            <span class="text-white text-xs font-bold">${record.likes}</span>
          </div>
          
          <!-- 오늘 표시 -->
          ${isToday ? `
            <div class="absolute -top-3 -left-1 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold animate-bounce">
              TODAY
            </div>
          ` : ''}
          
          <!-- 사용자 이름 표시 -->
          <div class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700 bg-white bg-opacity-90 px-2 py-1 rounded whitespace-nowrap shadow-sm">
            ${userName} ${isMyRecord ? '(나)' : ''}
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
    const newRecord: ExtendedRecord = {
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
      isLiked: false
    };
    
    // 기록 목록에 추가
    const updatedRecords = [...allRecords, newRecord];
    setAllRecords(updatedRecords);
    setFilteredRecords(updatedRecords);
    
    setShowCreateModal(false);
  };

  const handleFilterChange = (filters: FilterOptions) => {
    let filtered = allRecords;

    if (filters.showMyRecordsOnly) {
      // 현재 사용자를 김다은(id: "1")으로 가정
      filtered = filtered.filter(record => record.userId === "1");
    }

    if (filters.hashtag) {
      filtered = filtered.filter(record => 
        record.hashtags.some(tag => 
          tag.toLowerCase().includes(filters.hashtag!.toLowerCase())
        )
      );
    }

    if (filters.author) {
      filtered = filtered.filter(record => 
        record.userName.toLowerCase().includes(filters.author!.toLowerCase())
      );
    }

    setFilteredRecords(filtered);
  };

  const updateRecordInList = (updatedRecord: ExtendedRecord) => {
    const updatedAllRecords = allRecords.map(record => 
      record.id === updatedRecord.id ? updatedRecord : record
    );
    setAllRecords(updatedAllRecords);
    
    // 필터링된 기록도 업데이트
    const updatedFilteredRecords = filteredRecords.map(record => 
      record.id === updatedRecord.id ? updatedRecord : record
    );
    setFilteredRecords(updatedFilteredRecords);
  };

  return (
    <div className="relative w-full h-screen">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {mapLoaded && (
        <>
          {/* 필터 버튼 */}
          <FilterSheet onFilterChange={handleFilterChange}>
            <button className="absolute top-4 left-4 w-12 h-12 bg-white text-gray-700 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center z-10">
              <Filter size={20} />
            </button>
          </FilterSheet>

          <MapControls 
            onCreateRecord={() => setShowCreateModal(true)}
            onMoveToCurrentLocation={moveToCurrentLocation}
          />
          
          <RecordModal 
            record={selectedRecord}
            isOpen={!!selectedRecord}
            onClose={() => setSelectedRecord(null)}
            onUpdateRecord={updateRecordInList}
          />
          
          <CreateRecordModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateRecord}
            currentLocation={CURRENT_USER_LOCATION}
          />
        </>
      )}
      
      <BottomNavigation />
    </div>
  );
};

export default MapContainer;
