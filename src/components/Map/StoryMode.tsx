
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, SkipBack, SkipForward, X } from 'lucide-react';
import { Record } from '@/data/mockData';

interface StoryModeProps {
  records: Record[];
  isOpen: boolean;
  onClose: () => void;
  targetDate?: string;
}

export const StoryMode: React.FC<StoryModeProps> = ({
  records,
  isOpen,
  onClose,
  targetDate
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(3000); // 3초마다

  // 해당 날짜의 내 기록만 필터링하고 시간순 정렬
  const todayRecords = records
    .filter(record => {
      const recordDate = record.createdAt;
      const today = targetDate || new Date().toISOString().split('T')[0];
      return record.userId === "1" && recordDate === today;
    })
    .sort((a, b) => {
      // 시간이 있다면 시간순으로, 없다면 생성 순서대로
      if (a.time && b.time) {
        return a.time.localeCompare(b.time);
      }
      return a.id.localeCompare(b.id);
    });

  useEffect(() => {
    if (!isPlaying || todayRecords.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev >= todayRecords.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, todayRecords.length]);

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(todayRecords.length - 1, prev + 1));
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  if (todayRecords.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-sm mx-auto">
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold mb-2">스토리가 없습니다</h3>
            <p className="text-gray-600 text-sm">오늘 작성한 기록이 없어요</p>
            <Button onClick={onClose} className="mt-4">
              확인
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const currentRecord = todayRecords[currentIndex];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] p-0 overflow-hidden">
        <div className="relative">
          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all"
          >
            <X size={16} />
          </button>

          {/* 진행 바 */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-black bg-opacity-30 p-2">
            <div className="flex space-x-1">
              {todayRecords.map((_, index) => (
                <div
                  key={index}
                  className={`flex-1 h-1 rounded-full ${
                    index <= currentIndex ? 'bg-white' : 'bg-white bg-opacity-30'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* 현재 기록 표시 */}
          <div className="relative">
            <div className="w-full h-96 bg-gray-100">
              <img
                src={currentRecord.image}
                alt={currentRecord.memo}
                className="w-full h-full object-cover"
              />
            </div>

            {/* 기록 정보 오버레이 */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 text-white">
              <div className="mb-2">
                <span className="text-sm opacity-80">
                  {currentIndex + 1} / {todayRecords.length}
                </span>
              </div>
              <div className="mb-2">
                <span className="text-sm opacity-80">{currentRecord.location.address}</span>
              </div>
              <p className="text-base mb-2">{currentRecord.memo}</p>
              <div className="flex flex-wrap gap-2">
                {currentRecord.hashtags.map((tag, index) => (
                  <span key={index} className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 컨트롤 패널 */}
          <div className="p-4 bg-white">
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                <SkipBack size={16} />
              </Button>
              
              <Button
                onClick={togglePlayback}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={currentIndex === todayRecords.length - 1}
              >
                <SkipForward size={16} />
              </Button>
            </div>

            <div className="mt-3 text-center">
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="text-xs bg-gray-100 rounded px-2 py-1"
              >
                <option value={1000}>빠름 (1초)</option>
                <option value={3000}>보통 (3초)</option>
                <option value={5000}>느림 (5초)</option>
              </select>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
