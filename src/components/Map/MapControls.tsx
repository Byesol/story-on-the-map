
import React from 'react';
import { Plus, MapPin } from 'lucide-react';

interface MapControlsProps {
  onCreateRecord: () => void;
  onMoveToCurrentLocation: () => void;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onCreateRecord,
  onMoveToCurrentLocation
}) => {
  return (
    <>
      {/* 기록 작성 버튼 */}
      <button
        onClick={onCreateRecord}
        className="absolute bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 flex items-center justify-center z-10"
      >
        <Plus size={28} />
      </button>
      
      {/* 현재 위치로 이동 버튼 */}
      <button
        onClick={onMoveToCurrentLocation}
        className="absolute top-20 right-4 w-12 h-12 bg-white text-gray-700 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center z-10"
      >
        <MapPin size={20} />
      </button>
    </>
  );
};
