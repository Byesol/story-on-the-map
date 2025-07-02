import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Camera, Utensils, Plane, Mountain, Coffee, Music, Sandwich, Car } from 'lucide-react';
import mapboxgl from 'mapbox-gl';

const MAPBOX_TOKEN = 'pk.eyJ1IjoidmVjdG9yMTIzIiwiYSI6ImNtY2s0bWY3aTBiYWMya29mc3F6dDhudHQifQ.WtT54vDaSOyf-NquVog3FQ';

interface CreateRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  currentLocation: { lat: number; lng: number; address: string };
}

const iconOptions = [
  { id: 'food', icon: Utensils, label: '음식', color: 'text-orange-500' },
  { id: 'travel', icon: Plane, label: '여행', color: 'text-blue-500' },
  { id: 'landscape', icon: Mountain, label: '풍경', color: 'text-green-500' },
  { id: 'cafe', icon: Coffee, label: '카페', color: 'text-amber-600' },
  { id: 'entertainment', icon: Music, label: '놀거리', color: 'text-purple-500' },
  { id: 'snack', icon: Sandwich, label: '간식', color: 'text-pink-500' },
  { id: 'walk', icon: Car, label: '산책', color: 'text-teal-500' }
];

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
  const [locationAddress, setLocationAddress] = useState(currentLocation.address);
  const [selectedIcon, setSelectedIcon] = useState(iconOptions[0].id);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  // Mapbox Geocoding API를 사용하여 주소 가져오기
  const getAddressFromCoordinates = async (lng: number, lat: number) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&language=ko`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        return data.features[0].place_name;
      }
      return `위도: ${lat.toFixed(4)}, 경도: ${lng.toFixed(4)}`;
    } catch (error) {
      console.error('주소 가져오기 실패:', error);
      return `위도: ${lat.toFixed(4)}, 경도: ${lng.toFixed(4)}`;
    }
  };

  useEffect(() => {
    if (isOpen && mapContainer.current) {
      // 기존 맵 정리
      if (map.current) {
        map.current.remove();
        map.current = null;
      }

      // 약간의 지연 후 맵 초기화
      setTimeout(() => {
        if (!mapContainer.current) return;
        
        mapboxgl.accessToken = MAPBOX_TOKEN;
        
        try {
          map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [currentLocation.lng, currentLocation.lat],
            zoom: 15,
          });

          // 드래그 가능한 마커 생성
          marker.current = new mapboxgl.Marker({ 
            draggable: true,
            color: '#ff6b35'
          })
            .setLngLat([currentLocation.lng, currentLocation.lat])
            .addTo(map.current);

          // 마커 드래그 이벤트
          marker.current.on('dragend', async () => {
            if (marker.current) {
              const lngLat = marker.current.getLngLat();
              const address = await getAddressFromCoordinates(lngLat.lng, lngLat.lat);
              
              setSelectedLocation({
                lat: lngLat.lat,
                lng: lngLat.lng,
                address: address
              });
              setLocationAddress(address);
            }
          });

          // 지도 클릭 시 마커 이동
          map.current.on('click', async (e) => {
            if (marker.current && map.current) {
              marker.current.setLngLat([e.lngLat.lng, e.lngLat.lat]);
              const address = await getAddressFromCoordinates(e.lngLat.lng, e.lngLat.lat);
              
              setSelectedLocation({
                lat: e.lngLat.lat,
                lng: e.lngLat.lng,
                address: address
              });
              setLocationAddress(address);
            }
          });
        } catch (error) {
          console.error('맵박스 초기화 실패:', error);
        }
      }, 100);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [isOpen, currentLocation]);

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
      icon: selectedIcon,
      location: {
        ...selectedLocation,
        address: locationAddress
      }
    };

    onSubmit(data);
    
    // Reset form
    setMemo('');
    setHashtags('');
    setImage(null);
    setSelectedIcon(iconOptions[0].id);
    setSelectedLocation(currentLocation);
    setLocationAddress(currentLocation.address);
  };

  const handleClose = () => {
    setMemo('');
    setHashtags('');
    setImage(null);
    setSelectedIcon(iconOptions[0].id);
    setSelectedLocation(currentLocation);
    setLocationAddress(currentLocation.address);
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
              <span>마커를 드래그하거나 지도를 클릭하여 위치를 선택하세요</span>
            </div>
          </div>

          {/* 위치 정보 */}
          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
            <MapPin size={16} className="text-gray-600" />
            <span className="text-sm text-gray-700">{locationAddress}</span>
          </div>

          {/* 아이콘 선택 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">기록 카테고리</label>
            <div className="grid grid-cols-4 gap-2">
              {iconOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedIcon(option.id)}
                    className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                      selectedIcon === option.id
                        ? 'border-orange-400 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent size={24} className={option.color} />
                    <span className="text-xs mt-1 font-medium">{option.label}</span>
                  </button>
                );
              })}
            </div>
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
              placeholder="이 장소에서의 기록을 남겨보세요..."
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
