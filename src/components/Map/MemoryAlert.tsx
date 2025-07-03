
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, X } from 'lucide-react';
import { AppRecord } from '@/data/mockData';

interface MemoryAlertProps {
  memories: Array<{
    record: AppRecord;
    daysAgo: number;
    message: string;
  }>;
  isOpen: boolean;
  onClose: () => void;
  onViewRecord: (record: AppRecord) => void;
}

export const MemoryAlert: React.FC<MemoryAlertProps> = ({
  memories,
  isOpen,
  onClose,
  onViewRecord
}) => {
  if (!isOpen || memories.length === 0) return null;

  const primaryMemory = memories[0];

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-sm w-full mx-4">
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-lg animate-fade-in">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-purple-600" />
              <CardTitle className="text-sm text-purple-900">추억 알림</CardTitle>
            </div>
            <button
              onClick={onClose}
              className="text-purple-600 hover:text-purple-800"
            >
              <X size={16} />
            </button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <p className="text-sm text-purple-800 mb-3">
            {primaryMemory.message}
          </p>
          
          <div className="flex items-center space-x-3 mb-3">
            <img
              src={primaryMemory.record.image}
              alt={primaryMemory.record.memo}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-purple-700 truncate">
                {primaryMemory.record.memo}
              </p>
              <div className="flex items-center space-x-1 mt-1">
                <MapPin size={10} className="text-purple-500" />
                <span className="text-xs text-purple-600 truncate">
                  {primaryMemory.record.location.address}
                </span>
              </div>
            </div>
          </div>
          
          {memories.length > 1 && (
            <p className="text-xs text-purple-700 mb-3">
              이 장소에서 총 {memories.length}개의 추억이 있어요
            </p>
          )}
          
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={() => onViewRecord(primaryMemory.record)}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-xs"
            >
              기록 보기
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onClose}
              className="text-xs border-purple-300 text-purple-700"
            >
              닫기
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
