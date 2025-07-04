
import React, { useState } from 'react';
import { mockRecords } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BottomNavigation from '@/components/Layout/BottomNavigation';
import { BarChart3, MapPin, Clock, Award, Calendar, TrendingUp } from 'lucide-react';

const Stats = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('이번 달');
  
  // 현재 사용자의 기록만 필터링
  const myRecords = mockRecords.filter(record => record.userId === "1");
  
  // 통계 계산
  const totalRecords = myRecords.length;
  const todayRecords = myRecords.filter(record => {
    const today = new Date().toISOString().split('T')[0];
    return record.createdAt === today;
  }).length;
  
  const thisMonthRecords = myRecords.filter(record => {
    const thisMonth = new Date().toISOString().slice(0, 7);
    return record.createdAt.startsWith(thisMonth);
  }).length;
  
  // 카테고리별 통계
  const categoryStats = myRecords.reduce((acc, record) => {
    const icon = record.icon || 'food';
    acc[icon] = (acc[icon] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const categoryLabels: Record<string, string> = {
    food: '음식',
    travel: '여행',
    landscape: '풍경',
    cafe: '카페',
    entertainment: '놀거리',
    snack: '간식',
    walk: '산책',
    running: '런닝'
  };
  
  // 가장 많이 방문한 지역
  const locationStats = myRecords.reduce((acc, record) => {
    const area = record.location.address.split(' ')[0]; // 첫 번째 지역명만 사용
    acc[area] = (acc[area] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topLocation = Object.entries(locationStats).sort(([,a], [,b]) => b - a)[0];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center space-x-2">
            <BarChart3 size={24} className="text-orange-500" />
            <h1 className="text-2xl font-bold text-gray-900">활동 통계</h1>
          </div>
          <p className="text-sm text-gray-600 mt-2">나의 기록 활동을 한눈에</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* 기간 선택 */}
        <div className="flex space-x-2">
          {['오늘', '이번 주', '이번 달', '전체'].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className="flex-1"
            >
              {period}
            </Button>
          ))}
        </div>

        {/* 주요 통계 카드들 */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <MapPin className="text-orange-500" size={24} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{totalRecords}</p>
              <p className="text-sm text-gray-600">총 기록 수</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Calendar className="text-blue-500" size={24} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{todayRecords}</p>
              <p className="text-sm text-gray-600">오늘 기록</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="text-green-500" size={24} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{thisMonthRecords}</p>
              <p className="text-sm text-gray-600">이번 달</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Award className="text-purple-500" size={24} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{topLocation?.[1] || 0}</p>
              <p className="text-sm text-gray-600">최다 방문</p>
            </CardContent>
          </Card>
        </div>

        {/* 카테고리별 통계 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">카테고리별 기록</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(categoryStats)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{categoryLabels[category] || category}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-500"
                        style={{ width: `${(count / totalRecords) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* 지역별 통계 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">자주 방문한 지역</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(locationStats)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([location, count]) => (
                <div key={location} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{location}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500"
                        style={{ width: `${(count / totalRecords) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* 이번 달 목표 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">이번 달 목표</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">월 목표: 30개 기록</span>
                <span className="text-sm font-medium text-gray-900">{thisMonthRecords}/30</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-400 to-pink-500"
                  style={{ width: `${Math.min((thisMonthRecords / 30) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-600">
                {30 - thisMonthRecords > 0 
                  ? `목표까지 ${30 - thisMonthRecords}개 남았어요!` 
                  : '목표를 달성했어요! 🎉'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Stats;
