
import React, { useState } from 'react';
import { mockRecords, mockUsers } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import BottomNavigation from '@/components/Layout/BottomNavigation';
import { useNavigate } from 'react-router-dom';

const MyRecords = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
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

  const handleRecordClick = (recordId: string) => {
    navigate(`/?recordId=${recordId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white px-4 py-6 border-b">
        <h1 className="text-2xl font-bold mb-4">내 기록</h1>
        
        {/* 검색 */}
        <div className="mb-4">
          <Input
            placeholder="내 기록 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        {/* 태그 필터 */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Button
              variant={selectedTag === '' ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag('')}
            >
              전체
            </Button>
            {myHashtags.slice(0, 10).map((tag) => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
              >
                #{tag}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <span className="text-sm text-gray-600">총 {filteredRecords.length}개의 기록</span>
        </div>

        <div className="space-y-4">
          {filteredRecords.map((record) => (
            <Card 
              key={record.id} 
              className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleRecordClick(record.id)}
            >
              <div className="flex">
                <div className="w-24 h-24 flex-shrink-0">
                  <img 
                    src={record.image} 
                    alt={record.memo}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="flex-1 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        <span>{record.location.address}</span>
                      </div>
                      <p className="text-gray-800 mb-2 line-clamp-2">{record.memo}</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {record.hashtags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs text-blue-600">
                            #{tag}
                          </span>
                        ))}
                        {record.hashtags.length > 3 && (
                          <span className="text-xs text-gray-500">+{record.hashtags.length - 3}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500 ml-4">
                      <div>{record.createdAt}</div>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>검색 결과가 없습니다.</p>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default MyRecords;
