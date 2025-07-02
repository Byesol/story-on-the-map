
import React from 'react';
import { mockUsers, mockRecords } from '@/data/mockData';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import BottomNavigation from '@/components/Layout/BottomNavigation';
import { MapPin, Heart, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  // 현재 사용자를 김다은으로 가정
  const currentUserId = "1";
  const currentUser = mockUsers.find(user => user.id === currentUserId);
  const myRecords = mockRecords.filter(record => record.userId === currentUserId);
  const totalLikes = myRecords.reduce((sum, record) => sum + record.likes, 0);

  const handleRecordClick = (recordId: string) => {
    navigate(`/?recordId=${recordId}`);
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 프로필 헤더 */}
      <div className="bg-white">
        <div className="text-center py-8 px-4">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">
              {currentUser.name.charAt(0)}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {currentUser.name}
          </h1>
          <p className="text-gray-600">
            {currentUser.age}세 · {currentUser.occupation}
          </p>
        </div>

        {/* 통계 */}
        <div className="flex justify-around py-6 border-t border-gray-100">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{myRecords.length}</div>
            <div className="text-sm text-gray-600">기록</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Heart className="w-6 h-6 text-red-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{totalLikes}</div>
            <div className="text-sm text-gray-600">좋아요</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">2년</div>
            <div className="text-sm text-gray-600">활동</div>
          </div>
        </div>
      </div>

      {/* 최근 기록 */}
      <div className="p-4">
        <div className="flex items-center mb-4">
          <MapPin className="w-5 h-5 text-gray-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">최근 기록</h2>
        </div>

        <div className="space-y-3">
          {myRecords.slice(0, 3).map((record) => (
            <Card 
              key={record.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleRecordClick(record.id)}
            >
              <CardContent className="p-4">
                <div className="flex space-x-3">
                  <img 
                    src={record.image}
                    alt={record.memo}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-500 mb-1">
                      {record.location.address}
                    </div>
                    <p className="text-gray-900 text-sm line-clamp-2 mb-2">
                      {record.memo}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        {record.hashtags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-xs text-blue-600">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        {record.createdAt}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Profile;
