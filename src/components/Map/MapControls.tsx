
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, MapPin } from 'lucide-react';

interface MapControlsProps {
  onCreateRecord: () => void;
  onMoveToCurrentLocation: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({
  onCreateRecord,
  onMoveToCurrentLocation
}) => {
  return (
    <div className="absolute bottom-24 right-4 flex flex-col space-y-3 z-10">
      {/* 현재 위치로 이동 버튼 */}
      <Button
        onClick={onMoveToCurrentLocation}
        className="w-14 h-14 rounded-full bg-white text-gray-700 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 border border-gray-200"
      >
        <MapPin size={24} />
      </Button>

      {/* 기록 추가 버튼 */}
      <Button
        onClick={onCreateRecord}
        className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
      >
        <Plus size={24} />
      </Button>
    </div>
  );
};

export default MapControls;
