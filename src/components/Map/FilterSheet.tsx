
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User } from 'lucide-react';

interface FilterSheetProps {
  onFilterChange: (filters: FilterOptions) => void;
  children: React.ReactNode;
}

export interface FilterOptions {
  hashtag?: string;
  author?: string;
  showMyRecordsOnly?: boolean;
}

export const FilterSheet: React.FC<FilterSheetProps> = ({ onFilterChange, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hashtag, setHashtag] = useState('');
  const [author, setAuthor] = useState('');
  const [showMyRecordsOnly, setShowMyRecordsOnly] = useState(false);

  const popularHashtags = ['힐링', '카페', '맛집', '데이트', '혼자가기좋은', '핫플레이스', '야경', '쇼핑'];

  const handleApplyFilter = () => {
    onFilterChange({
      hashtag: hashtag || undefined,
      author: author || undefined,
      showMyRecordsOnly
    });
    setIsOpen(false);
  };

  const handleResetFilter = () => {
    setHashtag('');
    setAuthor('');
    setShowMyRecordsOnly(false);
    onFilterChange({});
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="top" className="h-[70vh]">
        <SheetHeader className="mb-6">
          <SheetTitle>필터</SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          {/* 내 기록만 보기 */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <User size={20} className="text-gray-600" />
              <span className="font-medium">내 기록만 보기</span>
            </div>
            <Button
              variant={showMyRecordsOnly ? "default" : "outline"}
              onClick={() => setShowMyRecordsOnly(!showMyRecordsOnly)}
              className="w-full"
            >
              {showMyRecordsOnly ? '내 기록만 표시 중' : '모든 기록 표시 중'}
            </Button>
          </div>

          {/* 해시태그 필터 */}
          <div className="space-y-3">
            <span className="font-medium"># 해시태그</span>
            <div className="flex flex-wrap gap-2">
              {popularHashtags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setHashtag(hashtag === tag ? '' : tag)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    hashtag === tag 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
            <Input
              placeholder="직접 입력..."
              value={hashtag}
              onChange={(e) => setHashtag(e.target.value)}
            />
          </div>

          {/* 작성자 필터 */}
          <div className="space-y-3">
            <span className="font-medium">작성자</span>
            <Input
              placeholder="작성자 이름 검색..."
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          {/* 버튼 */}
          <div className="flex space-x-3 pt-4">
            <Button variant="outline" onClick={handleResetFilter} className="flex-1">
              필터 초기화
            </Button>
            <Button onClick={handleApplyFilter} className="flex-1">
              적용하기
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
