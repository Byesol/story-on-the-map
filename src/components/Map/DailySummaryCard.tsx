
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Route, Smile, Hash, Calendar } from 'lucide-react';
import { Record } from '@/data/mockData';

interface DailySummaryProps {
  records: Record[];
  targetDate?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const DailySummaryCard: React.FC<DailySummaryProps> = ({
  records,
  targetDate,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const today = targetDate || new Date().toISOString().split('T')[0];
  const todayRecords = records.filter(record => 
    record.userId === "1" && record.createdAt === today
  );

  // 통계 계산
  const visitedPlaces = todayRecords.length;
  const totalDistance = todayRecords
    .filter(record => record.isRunning && record.distance)
    .reduce((sum, record) => sum + (record.distance || 0), 0);
  
  // 감정 분석 (mood 기반)
  const moodCount = todayRecords.reduce((acc, record) => {
    const mood = record.mood || 'smile';
    acc[mood] = (acc[mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topMood = Object.entries(moodCount).sort((a, b) => b[1] - a[1])[0];
  
  // 해시태그 분석
  const hashtagCount = todayRecords.reduce((acc, record) => {
    record.hashtags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);
  
  const topHashtag = Object.entries(hashtagCount).sort((a, b) => b[1] - a[1])[0];

  const getMoodIcon = (mood: string) => {
    const icons = {
      smile: '😊',
      frown: '😢', 
      meh: '😐'
    };
    return icons[mood as keyof typeof icons] || '😊';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-sm w-full max-h-[80vh] overflow-y-auto">
        <CardHeader className="text-center pb-3">
          <div className="flex items-center justify-between">
            <Calendar className="w-5 h-5 text-gray-600" />
            <CardTitle className="text-lg">하루 요약</CardTitle>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {formatDate(today)}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {visitedPlaces === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">오늘 기록이 없습니다</p>
            </div>
          ) : (
            <>
              {/* 방문 장소 수 */}
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-blue-900">방문한 장소</p>
                  <p className="text-2xl font-bold text-blue-600">{visitedPlaces}곳</p>
                </div>
              </div>

              {/* 총 이동 거리 (런닝한 경우만) */}
              {totalDistance > 0 && (
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Route className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-900">총 런닝 거리</p>
                    <p className="text-2xl font-bold text-green-600">{totalDistance.toFixed(1)}km</p>
                  </div>
                </div>
              )}

              {/* 많이 남긴 감정 */}
              {topMood && (
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-lg">
                    {getMoodIcon(topMood[0])}
                  </div>
                  <div>
                    <p className="font-semibold text-yellow-900">오늘의 기분</p>
                    <p className="text-sm text-yellow-700">{topMood[1]}번 기록됨</p>
                  </div>
                </div>
              )}

              {/* 인기 해시태그 */}
              {topHashtag && (
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Hash className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-purple-900">인기 태그</p>
                    <p className="text-sm text-purple-700">#{topHashtag[0]} ({topHashtag[1]}회)</p>
                  </div>
                </div>
              )}

              {/* 기록 미리보기 */}
              <div className="border-t pt-4">
                <p className="font-semibold text-gray-900 mb-3">오늘의 기록</p>
                <div className="grid grid-cols-3 gap-2">
                  {todayRecords.slice(0, 6).map((record) => (
                    <div key={record.id} className="aspect-square rounded-lg overflow-hidden">
                      <img
                        src={record.image}
                        alt={record.memo}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
