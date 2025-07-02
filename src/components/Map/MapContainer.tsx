import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { mockRecords, CURRENT_USER_LOCATION, Record, mockUsers } from '@/data/mockData';
import { RecordModal } from './RecordModal';
import { CreateRecordModal } from './CreateRecordModal';
import { MapControls } from './MapControls';
import { FilterSheet, FilterOptions } from './FilterSheet';
import { Filter } from 'lucide-react';
import BottomNavigation from '@/components/Layout/BottomNavigation';

const MAPBOX_TOKEN = 'pk.eyJ1IjoidmVjdG9yMTIzIiwiYSI6ImNtY2s0bWY3aTBiYWMya29mc3F6dDhudHQifQ.WtT54vDaSOyf-NquVog3FQ';

const MapContainer = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [userLocationMarker, setUserLocationMarker] = useState<mapboxgl.Marker | null>(null);
  const [recordMarkers, setRecordMarkers] = useState<mapboxgl.Marker[]>([]);
  const [pathLines, setPathLines] = useState<string[]>([]);
  
  // 친구만 볼 수 있도록 필터링
  const friendRecords = mockRecords.filter(record => {
    const user = mockUsers.find(u => u.id === record.userId);
    return user?.isFriend || record.userId === "1"; // 본인 기록도 포함
  });
  
  const [filteredRecords, setFilteredRecords] = useState<Record[]>(friendRecords);
  const [allRecords, setAllRecords] = useState<Record[]>(friendRecords);

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

  const addRecordMarkers = (records: Record[]) => {
    if (!map.current) return;

    const markers: mapboxgl.Marker[] = [];

    records.forEach((record) => {
      const isToday = record.createdAt === today;
      const isMyRecord = record.userId === "1";
      
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
          
          <!-- 사용자 이름 표시 - 전체 이름으로 변경 -->
          <div class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700 bg-white bg-opacity-90 px-2 py-1 rounded whitespace-nowrap shadow-sm">
            ${record.userName} ${isMyRecord ? '(나)' : ''}
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
    const newRecord: Record = {
      id: `new-${Date.now()}`,
      userId: "1", // 현재 사용자 ID
      userName: "김다은", // 현재 사용자 이름
      location: data.location,
      image: data.image,
      memo: data.memo,
      hashtags: data.hashtags,
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

  const updateRecordInList = (updatedRecord: Record) => {
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
