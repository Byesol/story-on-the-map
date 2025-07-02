
import React, { useState, useMemo } from 'react';
import { Heart, MessageCircle, MapPin, Navigation } from 'lucide-react';
import BottomNavigation from '@/components/Layout/BottomNavigation';
import { mockRecords, CURRENT_USER_LOCATION, mockUsers } from '@/data/mockData';
import { RecordModal } from '@/components/Map/RecordModal';

const Explore = () => {
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  // 현재 위치 기준으로 거리 계산 및 정렬
  const sortedRecords = useMemo(() => {
    const friendRecords = mockRecords.filter(record => {
      const user = mockUsers.find(u => u.id === record.userId);
      return user?.isFriend || record.userId === "1";
    });

    return friendRecords
      .map(record => {
        const distance = Math.sqrt(
          Math.pow(record.location.lat - CURRENT_USER_LOCATION.lat, 2) +
          Math.pow(record.location.lng - CURRENT_USER_LOCATION.lng, 2)
        );
        return { ...record, distance };
      })
      .sort((a, b) => a.distance - b.distance);
  }, []);

  const formatDistance = (distance: number) => {
    const km = distance * 111; // 대략적인 위도/경도 -> km 변환
    if (km < 1) {
      return `${Math.round(km * 1000)}m`;
    }
    return `${km.toFixed(1)}km`;
  };

  const updateRecordInList = (updatedRecord: any) => {
    // 실제로는 상태 업데이트가 필요하지만, 여기서는 모달만 닫기
    setSelectedRecord(null);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center space-x-2">
            <Navigation size={24} className="text-orange-500" />
            <h1 className="text-2xl font-bold text-gray-900">둘러보기</h1>
          </div>
          <p className="text-sm text-gray-600 mt-2">내 위치 기준 가까운 기록들</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <div className="space-y-4">
          {sortedRecords.map((record) => {
            const isToday = record.createdAt === today;
            const isMyRecord = record.userId === "1";
            
            return (
              <div
                key={record.id}
                onClick={() => setSelectedRecord(record)}
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
                        className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full"
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
      </div>

      <RecordModal
        record={selectedRecord}
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        onUpdateRecord={updateRecordInList}
      />

      <BottomNavigation />
    </div>
  );
};

export default Explore;
