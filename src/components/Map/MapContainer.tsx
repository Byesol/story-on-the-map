
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { mockRecords, CURRENT_USER_LOCATION, Record } from '@/data/mockData';
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
  const [filteredRecords, setFilteredRecords] = useState<Record[]>(mockRecords);
  const [allRecords, setAllRecords] = useState<Record[]>(mockRecords);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [CURRENT_USER_LOCATION.lng, CURRENT_USER_LOCATION.lat],
      zoom: 15,
      pitch: 0,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      setMapLoaded(true);
      addUserLocationMarker();
      addRecordMarkers(filteredRecords);
    });

    return () => {
      recordMarkers.forEach(marker => marker.remove());
      userLocationMarker?.remove();
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (mapLoaded) {
      // 기존 마커들 제거
      recordMarkers.forEach(marker => marker.remove());
      // 새로운 마커들 추가
      addRecordMarkers(filteredRecords);
    }
  }, [filteredRecords, mapLoaded]);

  const addUserLocationMarker = () => {
    if (!map.current) return;

    const userMarkerEl = document.createElement('div');
    userMarkerEl.className = 'user-location-marker';
    userMarkerEl.style.zIndex = '1000'; // 높은 z-index로 사진 앞으로
    userMarkerEl.innerHTML = `
      <div class="relative" style="z-index: 1000;">
        <div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-500 rounded-full opacity-30 animate-ping"></div>
      </div>
    `;

    const marker = new mapboxgl.Marker(userMarkerEl)
      .setLngLat([CURRENT_USER_LOCATION.lng, CURRENT_USER_LOCATION.lat])
      .addTo(map.current);

    setUserLocationMarker(marker);
  };

  const addRecordMarkers = (records: Record[]) => {
    if (!map.current) return;

    const markers: mapboxgl.Marker[] = [];

    records.forEach((record) => {
      const markerEl = document.createElement('div');
      markerEl.className = 'record-marker';
      markerEl.innerHTML = `
        <div class="relative cursor-pointer group">
          <div class="w-12 h-12 rounded-full overflow-hidden border-3 border-white shadow-lg hover:scale-110 transition-transform duration-200">
            <img src="${record.image}" alt="${record.memo}" class="w-full h-full object-cover" />
          </div>
          <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
            <span class="text-white text-xs font-bold">❤</span>
          </div>
          <div class="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full border border-white flex items-center justify-center">
            <span class="text-white text-xs font-bold">${record.likes}</span>
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
    setFilteredRecords(updatedAllRecords.filter(record => 
      filteredRecords.some(fr => fr.id === record.id) || record.id === updatedRecord.id
    ));
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
