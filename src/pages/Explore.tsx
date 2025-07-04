
import React, { useState, useMemo } from 'react';
import { Heart, MessageCircle, MapPin, Users, Clock, Eye } from 'lucide-react';
import BottomNavigation from '@/components/Layout/BottomNavigation';
import { mockRecords, CURRENT_USER_LOCATION, mockUsers } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Explore = () => {
  const navigate = useNavigate();
  const [showOnlyFriends, setShowOnlyFriends] = useState(true);

  // 24시간 내 친구들의 공개 기록만 필터링 (스토리 형식)
  const friendStories = useMemo(() => {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    return mockRecords.filter(record => {
      const user = mockUsers.find(u => u.id === record.userId);
      if (!user?.isFriend && record.userId !== "1") return false;
      
      // 오늘 날짜의 기록만 표시 (24시간 스토리 개념)
      const today = new Date().toISOString().split('T')[0];
      return record.createdAt === today && record.isPublic !== false; // 공개 기록만
    });
  }, []);

  // 전체 공개 기록 (탐색용)
  const allPublicRecords = useMemo(() => {
    return mockRecords.filter(record => record.isPublic !== false)
      .map(record => {
        const distance = Math.sqrt(
          Math.pow(record.location.lat - CURRENT_USER_LOCATION.lat, 2) +
          Math.pow(record.location.lng - CURRENT_USER_LOCATION.lng, 2)
        );
        return { ...record, distance };
      })
      .sort((a, b) => a.distance - b.distance);
  }, []);

  const displayRecords = showOnlyFriends ? friendStories : allPublicRecords;

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
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center space-x-2 mb-4">
            <Users size={24} className="text-orange-500" />
            <h1 className="text-2xl font-bold text-gray-900">친구 스토리</h1>
          </div>
          
          {/* 모드 전환 버튼 */}
          <div className="flex space-x-2">
            <Button
              variant={showOnlyFriends ? "default" : "outline"}
              size="sm"
              onClick={() => setShowOnlyFriends(true)}
              className="flex-1"
            >
              <Clock size={16} className="mr-2" />
              24시간 스토리
            </Button>
            <Button
              variant={!showOnlyFriends ? "default" : "outline"}
              size="sm"
              onClick={() => setShowOnlyFriends(false)}
              className="flex-1"
            >
              <Eye size={16} className="mr-2" />
              주변 탐색
            </Button>
          </div>
          
          <p className="text-sm text-gray-600 mt-2">
            {showOnlyFriends 
              ? '친구들의 오늘 기록을 확인해보세요' 
              : '내 위치 기준 가까운 공개 기록들'
            }
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {displayRecords.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Users size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg mb-2">
              {showOnlyFriends ? '오늘의 친구 스토리가 없어요' : '주변에 공개 기록이 없어요'}
            </p>
            <p className="text-sm">
              {showOnlyFriends ? '친구들이 기록을 남기면 여기에 표시돼요' : '다른 지역을 탐색해보세요'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayRecords.map((record) => {
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
                    {isToday && showOnlyFriends && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse flex items-center space-x-1">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <span>LIVE</span>
                      </div>
                    )}
                    {!showOnlyFriends && record.distance !== undefined && (
                      <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                        {formatDistance(record.distance)}
                      </div>
                    )}
                    {record.time && (
                      <div className="absolute bottom-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                        {record.time}
                      </div>
                    )}
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
                          {showOnlyFriends && isToday && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">오늘</span>
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
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Explore;
