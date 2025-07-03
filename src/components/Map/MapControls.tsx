
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Navigation, Route } from 'lucide-react';

interface MapControlsProps {
  onCreateRecord: () => void;
  onMoveToCurrentLocation: () => void;
  onStartRouteRecord: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({
  onCreateRecord,
  onMoveToCurrentLocation,
  onStartRouteRecord
}) => {
  return (
    <div className="absolute bottom-24 right-4 flex flex-col space-y-3 z-10">
      {/* 경로 기록 버튼 */}
      <Button
        onClick={onStartRouteRecord}
        className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
        size="sm"
      >
        <Route size={24} />
      </Button>
      
      {/* 기록 추가 버튼 */}
      <Button
        onClick={onCreateRecord}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
        size="sm"
      >
        <Plus size={24} />
      </Button>
      
      {/* 현재 위치로 이동 버튼 */}
      <Button
        onClick={onMoveToCurrentLocation}
        className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
        size="sm"
      >
        <Navigation size={20} />
      </Button>
    </div>
  );
};

export default MapControls;
