
import React, { useState } from 'react';
import { mockRecords, mockUsers } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import BottomNavigation from '@/components/Layout/BottomNavigation';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Search, Calendar, MapPin, Share2, Filter } from 'lucide-react';

const MyRecords = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const navigate = useNavigate();
  
  // 현재 사용자를 김다은으로 가정
  const currentUserId = "1";
  const myRecords = mockRecords.filter(record => record.userId === currentUserId);
  const currentUser = mockUsers.find(user => user.id === currentUserId);

  // 내 해시태그 추출
  const myHashtags = Array.from(new Set(myRecords.flatMap(record => record.hashtags)));

  // 필터링된 기록
  const filteredRecords = myRecords.filter(record => {
    const matchesSearch = record.memo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.location.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === '' || record.hashtags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  // 날짜별 그룹화
  const groupedRecords = filteredRecords.reduce((acc, record) => {
    const date = record.createdAt;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(record);
    return acc;
  }, {} as Record<string, typeof filteredRecords>);

  const handleRecordClick = (recordId: string) => {
    navigate(`/?recordId=${recordId}`);
  };

  const handleShareMyRecords = () => {
    // 나의 장소 리스트 공유 기능
    const shareText = `${currentUser?.name}님의 특별한 장소들을 확인해보세요! 총 ${myRecords.length}개의 기록이 있어요.`;
    if (navigator.share) {
      navigator.share({
        title: '나의 장소 기록',
        text: shareText,
        url: window.location.origin
      });
    } else {
      navigator.clipboard.writeText(`${shareText} ${window.location.origin}`);
      alert('링크가 복사되었습니다!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen size={24} className="text-orange-500" />
              <h1 className="text-2xl font-bold text-gray-900">내 기록</h1>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareMyRecords}
              className="flex items-center space-x-1"
            >
              <Share2 size={16} />
              <span>공유</span>
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-2">나만의 특별한 장소들</p>
          
          {/* 요약 정보 */}
          <div className="flex items-center space-x-4 mt-4 p-3 bg-orange-50 rounded-lg">
            <div className="text-center">
              <p className="text-lg font-bold text-orange-600">{myRecords.length}</p>
              <p className="text-xs text-gray-600">총 기록</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-orange-600">{myHashtags.length}</p>
              <p className="text-xs text-gray-600">태그</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-orange-600">{Object.keys(groupedRecords).length}</p>
              <p className="text-xs text-gray-600">활동일</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4">
        {/* 검색 */}
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="장소나 메모 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* 태그 필터 */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            <Button
              variant={selectedTag === '' ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag('')}
              className="whitespace-nowrap"
            >
              전체
            </Button>
            {myHashtags.slice(0, 10).map((tag) => (
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
        </div>

        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-gray-600">총 {filteredRecords.length}개의 기록</span>
        </div>

        {/* 날짜별 기록 표시 */}
        <div className="space-y-6">
          {Object.entries(groupedRecords)
            .sort(([a], [b]) => b.localeCompare(a)) // 최신순
            .map(([date, records]) => (
              <div key={date} className="space-y-3">
                <div className="flex items-center space-x-2 sticky top-0 bg-gray-50 py-2 z-10">
                  <Calendar size={16} className="text-gray-500" />
                  <h3 className="font-semibold text-gray-700">{date}</h3>
                  <span className="text-sm text-gray-500">({records.length}개)</span>
                </div>
                
                <div className="space-y-3">
                  {records.map((record) => (
                    <Card 
                      key={record.id} 
                      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleRecordClick(record.id)}
                    >
                      <div className="flex">
                        <div className="w-20 h-20 flex-shrink-0">
                          <img 
                            src={record.image} 
                            alt={record.memo}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="flex-1 p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center text-xs text-gray-500 mb-1">
                                <MapPin size={12} className="mr-1" />
                                <span className="truncate">{record.location.address}</span>
                              </div>
                              <p className="text-sm text-gray-800 mb-2 line-clamp-2">{record.memo}</p>
                              <div className="flex flex-wrap gap-1">
                                {record.hashtags.slice(0, 3).map((tag) => (
                                  <span key={tag} className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                    #{tag}
                                  </span>
                                ))}
                                {record.hashtags.length > 3 && (
                                  <span className="text-xs text-gray-500">+{record.hashtags.length - 3}</span>
                                )}
                              </div>
                            </div>
                            {record.time && (
                              <div className="text-xs text-gray-500 ml-2">
                                {record.time}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg mb-2">검색 결과가 없습니다</p>
            <p className="text-sm">다른 키워드로 검색해보세요</p>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default MyRecords;
