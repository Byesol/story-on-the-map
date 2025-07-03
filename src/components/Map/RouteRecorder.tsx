
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Play, Square, Route, MapPin } from 'lucide-react';

interface RouteRecorderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (routeData: {
    coordinates: [number, number][];
    distance: number;
    duration: string;
    startLocation: string;
    endLocation: string;
  }) => void;
}

export const RouteRecorder: React.FC<RouteRecorderProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState('00:00');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const calculateDistance = (coord1: [number, number], coord2: [number, number]) => {
    const R = 6371; // 지구 반지름 (km)
    const dLat = (coord2[1] - coord1[1]) * Math.PI / 180;
    const dLon = (coord2[0] - coord1[0]) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(coord1[1] * Math.PI / 180) * Math.cos(coord2[1] * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const startRecording = () => {
    if (!navigator.geolocation) {
      alert('위치 서비스가 지원되지 않습니다.');
      return;
    }

    setIsRecording(true);
    setStartTime(new Date());
    setCoordinates([]);
    setDistance(0);

    // 시간 업데이트
    intervalRef.current = setInterval(() => {
      if (startTime) {
        const now = new Date();
        const diff = now.getTime() - startTime.getTime();
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setDuration(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000);

    // 위치 추적 시작
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const newCoord: [number, number] = [
          position.coords.longitude,
          position.coords.latitude
        ];

        setCoordinates(prev => {
          const updated = [...prev, newCoord];
          
          // 거리 계산
          if (prev.length > 0) {
            const lastCoord = prev[prev.length - 1];
            const additionalDistance = calculateDistance(lastCoord, newCoord);
            setDistance(prevDistance => prevDistance + additionalDistance);
          }
          
          return updated;
        });
      },
      (error) => {
        console.error('위치 추적 오류:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  const stopRecording = () => {
    setIsRecording(false);
    
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const saveRoute = async () => {
    if (coordinates.length < 2) {
      alert('경로가 너무 짧습니다.');
      return;
    }

    // 시작점과 끝점의 주소 가져오기 (실제로는 Geocoding API 사용)
    const startLocation = "기록 시작점";
    const endLocation = "기록 종료점";

    onSave({
      coordinates,
      distance: Math.round(distance * 100) / 100,
      duration,
      startLocation,
      endLocation
    });

    onClose();
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Route size={20} />
            <span>경로 기록</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* 기록 상태 */}
          <div className="text-center space-y-2">
            <div className={`text-4xl font-bold ${isRecording ? 'text-red-500' : 'text-gray-500'}`}>
              {duration}
            </div>
            <div className="text-lg text-gray-600">
              {distance.toFixed(2)} km
            </div>
            <div className="text-sm text-gray-500">
              {coordinates.length}개 포인트 기록됨
            </div>
          </div>

          {/* 컨트롤 버튼 */}
          <div className="flex justify-center space-x-4">
            {!isRecording ? (
              <Button
                onClick={startRecording}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full text-lg"
              >
                <Play size={20} className="mr-2" />
                시작
              </Button>
            ) : (
              <Button
                onClick={stopRecording}
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full text-lg"
              >
                <Square size={20} className="mr-2" />
                정지
              </Button>
            )}
          </div>

          {/* 저장 버튼 */}
          {!isRecording && coordinates.length > 0 && (
            <div className="flex space-x-2">
              <Button
                onClick={saveRoute}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
              >
                <MapPin size={16} className="mr-2" />
                경로 저장
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1"
              >
                취소
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
