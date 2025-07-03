
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Heart, MessageCircle, MapPin, Navigation, Map, List, Filter } from 'lucide-react';
import BottomNavigation from '@/components/Layout/BottomNavigation';
import { mockRecords, CURRENT_USER_LOCATION, mockUsers, AppRecord } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoidmVjdG9yMTIzIiwiYSI6ImNtY2s0bWY3aTBiYWMya29mc3F6dDhudHQifQ.WtT54vDaSOyf-NquVog3FQ';

const Explore = () => {
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'feed'>('map');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [showMyRecordsOnly, setShowMyRecordsOnly] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [recordMarkers, setRecordMarkers] = useState<mapboxgl.Marker[]>([]);

  // 친구들과 내 기록 모두 포함
  const allRecords = mockRecords.filter(record => {
    const user = mockUsers.find(u => u.id === record.userId);
    return user?.isFriend || record.userId === "1";
  });

  // 필터링된 기록들
  const filteredRecords = useMemo(() => {
    let filtered = allRecords;

    if (showMyRecordsOnly) {
      filtered = filtered.filter(record => record.userId === "1");
    }

    if (searchTerm) {
      filtered = filtered.filter(record => 
        record.memo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.hashtags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedTag) {
      filtered = filtered.filter(record => record.hashtags.includes(selectedTag));
    }

    if (selectedAuthor) {
      filtered = filtered.filter(record => 
        record.userName.toLowerCase().includes(selectedAuthor.toLowerCase())
      );
    }

    // 현재 위치 기준 거리 계산 및 정렬
    return filtered
      .map(record => {
        const distance = Math.sqrt(
          Math.pow(record.location.lat - CURRENT_USER_LOCATION.lat, 2) +
          Math.pow(record.location.lng - CURRENT_USER_LOCATION.lng, 2)
        );
        return { ...record, distance };
      })
      .sort((a, b) => a.distance - b.distance);
  }, [allRecords, showMyRecordsOnly, searchTerm, selectedTag, selectedAuthor]);

  // 인기 해시태그
  const popularTags = Array.from(new Set(allRecords.flatMap(record => record.hashtags)))
    .slice(0, 8);

  // 지도 초기화
  useEffect(() => {
    if (viewMode === 'map' && mapContainer.current && !map.current) {
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
        addRecordMarkers(filteredRecords);
      });
    }

    return () => {
      if (viewMode === 'feed' && map.current) {
        recordMarkers.forEach(marker => marker.remove());
        map.current.remove();
        map.current = null;
        setMapLoaded(false);
      }
    };
  }, [viewMode]);

  // 마커 업데이트
  useEffect(() => {
    if (mapLoaded && map.current) {
      recordMarkers.forEach(marker => marker.remove());
      addRecordMarkers(filteredRecords);
    }
  }, [filteredRecords, mapLoaded]);

  const addRecordMarkers = (records: any[]) => {
    if (!map.current) return;

    const markers: mapboxgl.Marker[] = [];

    records.forEach((record) => {
      const isMyRecord = record.userId === "1";
      const today = new Date().toISOString().split('T')[0];
      const isToday = record.createdAt === today;
      
      const markerEl = document.createElement('div');
      markerEl.className = 'record-marker cursor-pointer';
      
      markerEl.innerHTML = `
        <div class="relative group">
          ${isToday ? `
            <div class="absolute -inset-2 bg-yellow-400 rounded-full animate-pulse opacity-30"></div>
          ` : ''}
          
          <div class="w-12 h-12 rounded-full overflow-hidden border-2 ${isMyRecord ? 'border-blue-400' : 'border-white'} shadow-lg hover:scale-110 transition-transform duration-200">
            <img src="${record.image}" alt="${record.memo}" class="w-full h-full object-cover" />
          </div>
          
          <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
            <span class="text-white text-xs font-bold">${record.likes}</span>
          </div>
          
          ${isMyRecord ? `
            <div class="absolute -top-1 -left-1 w-4 h-4 bg-blue-500 rounded-full border border-white"></div>
          ` : ''}
        </div>
      `;

      markerEl.addEventListener('click', () => {
        handleRecordClick(record.id);
      });

      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([record.location.lng, record.location.lat])
        .addTo(map.current!);

      markers.push(marker);
    });

    setRecordMarkers(markers);
  };

  const formatDistance = (distance: number) => {
    const km = distance * 111; // 대략적인 위도/경도 -> km 변환
    if (km < 1) {
      return `${Math.round(km * 1000)}m`;
    }
    return `${km.toFixed(1)}km`;
  };

  const handleRecordClick = (recordId: string) => {
    navigate(`/?recordId=${recordId}`);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 헤더 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Navigation size={24} className="text-orange-500" />
              <h1 className="text-2xl font-bold text-gray-900">둘러보기</h1>
            </div>
            
            {/* 뷰 모드 토글 */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === 'map' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('map')}
                className="flex items-center space-x-1"
              >
                <Map size={16} />
                <span>지도</span>
              </Button>
              <Button
                variant={viewMode === 'feed' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('feed')}
                className="flex items-center space-x-1"
              >
                <List size={16} />
                <span>피드</span>
              </Button>
            </div>
          </div>

          {/* 검색 및 필터 */}
          <div className="space-y-3">
            <Input
              placeholder="장소, 해시태그, 내용 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
            
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              <Button
                variant={showMyRecordsOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowMyRecordsOnly(!showMyRecordsOnly)}
                className="whitespace-nowrap"
              >
                내 기록만
              </Button>
              {popularTags.map((tag) => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                  className="whitespace-nowrap"
                >
                  #{tag}
                </Button>
              ))}
            </div>
            
            <div className="text-sm text-gray-600">
              {filteredRecords.length}개의 기록 • 내 위치 기준 가까운 순
            </div>
          </div>
        </div>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="max-w-md mx-auto">
        {viewMode === 'map' ? (
          // 지도 뷰
          <div className="relative h-[calc(100vh-200px)]">
            <div ref={mapContainer} className="absolute inset-0" />
            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-gray-500">지도 로딩 중...</div>
              </div>
            )}
          </div>
        ) : (
          // 피드 뷰
          <div className="px-4 py-6">
            <div className="space-y-4">
              {filteredRecords.map((record) => {
                const isToday = record.createdAt === today;
                const isMyRecord = record.userId === "1";
                
                return (
                  <div
                    key={record.id}
                    onClick={() => handleRecordClick(record.id)}
                    className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={record.image}
                        alt={record.memo}
                        className="w-full h-48 object-cover"
                      />
                      {isToday && (
                        <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                          오늘
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                        {formatDistance(record.distance)}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xs">
                            {record.userName.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <p className="font-semibold text-gray-900">{record.userName}</p>
                            {isMyRecord && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">나</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{record.createdAt}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-gray-600 mb-2">
                        <MapPin size={14} />
                        <span className="text-sm">{record.location.address}</span>
                      </div>

                      <p className="text-gray-900 mb-3 line-clamp-2">{record.memo}</p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {record.hashtags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full cursor-pointer hover:bg-blue-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTag(tag);
                            }}
                          >
                            #{tag}
                          </span>
                        ))}
                        {record.hashtags.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{record.hashtags.length - 3}개
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-4 text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Heart size={16} className={record.isLiked ? 'text-red-500 fill-current' : ''} />
                          <span className="text-sm">{record.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle size={16} />
                          <span className="text-sm">{record.comments?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {filteredRecords.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p>검색 결과가 없습니다.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Explore;
