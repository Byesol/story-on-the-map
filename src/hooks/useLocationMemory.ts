
import { useState, useEffect } from 'react';
import { Record } from '@/data/mockData';

interface LocationMemory {
  record: Record;
  daysAgo: number;
  message: string;
}

export const useLocationMemory = (
  currentLocation: { lat: number; lng: number },
  allRecords: Record[]
) => {
  const [memories, setMemories] = useState<LocationMemory[]>([]);
  const [showMemoryAlert, setShowMemoryAlert] = useState(false);

  useEffect(() => {
    // 현재 위치 근처 (반경 100m 내)의 과거 기록 찾기
    const nearbyMemories = allRecords
      .filter(record => {
        if (record.userId !== "1") return false; // 내 기록만
        
        const distance = calculateDistance(
          currentLocation.lat,
          currentLocation.lng,
          record.location.lat,
          record.location.lng
        );
        
        return distance < 0.1; // 100m 내
      })
      .map(record => {
        const recordDate = new Date(record.createdAt);
        const today = new Date();
        const daysAgo = Math.floor((today.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24));
        
        let message = '';
        if (daysAgo === 0) {
          message = '오늘 이곳에서 기록을 남겼어요';
        } else if (daysAgo === 1) {
          message = '어제 이곳에서 기록을 남겼어요';
        } else if (daysAgo <= 7) {
          message = `${daysAgo}일 전 이곳에서 기록을 남겼어요`;
        } else if (daysAgo <= 30) {
          message = `${Math.floor(daysAgo / 7)}주 전 이곳에서 기록을 남겼어요`;
        } else if (daysAgo <= 365) {
          message = `${Math.floor(daysAgo / 30)}개월 전 이곳에서 기록을 남겼어요`;
        } else {
          message = `${Math.floor(daysAgo / 365)}년 전 이곳에서 기록을 남겼어요`;
        }
        
        return { record, daysAgo, message };
      })
      .filter(memory => memory.daysAgo > 0) // 오늘 기록은 제외
      .sort((a, b) => a.daysAgo - b.daysAgo); // 최근 순으로 정렬

    if (nearbyMemories.length > 0 && nearbyMemories.length !== memories.length) {
      setMemories(nearbyMemories);
      setShowMemoryAlert(true);
    }
  }, [currentLocation, allRecords]);

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // 지구 반지름 (km)
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return {
    memories,
    showMemoryAlert,
    setShowMemoryAlert
  };
};
