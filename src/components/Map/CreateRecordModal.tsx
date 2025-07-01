
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Camera } from 'lucide-react';
import mapboxgl from 'mapbox-gl';

const MAPBOX_TOKEN = 'pk.eyJ1IjoidmVjdG9yMTIzIiwiYSI6ImNtY2s0bWY3aTBiYWMya29mc3F6dDhudHQifQ.WtT54vDaSOyf-NquVog3FQ';

interface CreateRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  currentLocation: { lat: number; lng: number; address: string };
}

export const CreateRecordModal: React.FC<CreateRecordModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentLocation
}) => {
  const [memo, setMemo] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState(currentLocation);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (isOpen && mapContainer.current && !map.current) {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [currentLocation.lng, currentLocation.lat],
        zoom: 15,
      });

      // 드래그 가능한 마커 생성
      marker.current = new mapboxgl.Marker({ draggable: true })
        .setLngLat([currentLocation.lng, currentLocation.lat])
        .addTo(map.current);

      // 마커 드래그 이벤트
      marker.current.on('dragend', () => {
        if (marker.current) {
          const lngLat = marker.current.getLngLat();
          setSelectedLocation({
            lat: lngLat.lat,
            lng: lngLat.lng,
            address: `위도: ${lngLat.lat.toFixed(4)}, 경도: ${lngLat.lng.toFixed(4)}`
          });
        }
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [isOpen]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!memo.trim() || !image) {
      alert('사진과 메모를 모두 입력해주세요.');
      return;
    }

    const data = {
      memo: memo.trim(),
      hashtags: hashtags.split('#').filter(tag => tag.trim()).map(tag => tag.trim()),
      image,
      location: selectedLocation
    };

    onSubmit(data);
    
    // Reset form
    setMemo('');
    setHashtags('');
    setImage(null);
    setSelectedLocation(currentLocation);
  };

  const handleClose = () => {
    setMemo('');
    setHashtags('');
    setImage(null);
    setSelectedLocation(currentLocation);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
            새 기록 작성
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* 위치 선택 지도 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">위치 선택</label>
            <div className="h-48 rounded-lg overflow-hidden border">
              <div ref={mapContainer} className="w-full h-full" />
            </div>
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
              <MapPin size={14} />
              <span>마커를 드래그하여 정확한 위치를 선택하세요</span>
            </div>
          </div>

          {/* 위치 정보 */}
          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
            <MapPin size={16} className="text-gray-600" />
            <span className="text-sm text-gray-700">{selectedLocation.address}</span>
          </div>

          {/* 이미지 업로드 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">사진</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              {image ? (
                <div className="relative">
                  <img 
                    src={image} 
                    alt="업로드된 이미지" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setImage(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center space-y-2">
                  <Camera size={32} className="text-gray-400" />
                  <span className="text-sm text-gray-500">사진을 선택해주세요</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* 메모 입력 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">메모</label>
            <Textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="이 장소에서의 기억을 남겨보세요..."
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* 해시태그 입력 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">해시태그</label>
            <Input
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="#카페 #힐링 #데이트"
            />
          </div>

          {/* 버튼 */}
          <div className="flex space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="flex-1"
            >
              취소
            </Button>
            <Button 
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600"
            >
              등록하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
