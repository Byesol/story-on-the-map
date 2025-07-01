
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Camera } from 'lucide-react';

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
      location: currentLocation
    };

    onSubmit(data);
    
    // Reset form
    setMemo('');
    setHashtags('');
    setImage(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
            새 기록 작성
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* 위치 정보 */}
          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
            <MapPin size={16} className="text-gray-600" />
            <span className="text-sm text-gray-700">{currentLocation.address}</span>
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
              onClick={onClose}
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
