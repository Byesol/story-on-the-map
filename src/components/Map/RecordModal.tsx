
import React, { useState, useEffect } from 'react';
import { Record } from '@/data/mockData';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, MapPin, Activity, Clock, Route } from 'lucide-react';

interface ExtendedRecord extends Record {
  isRunning?: boolean;
  distance?: number;
  duration?: string;
}

interface RecordModalProps {
  record: ExtendedRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateRecord: (record: ExtendedRecord) => void;
  onAuthorFilter: (authorName: string) => void;
}

export const RecordModal: React.FC<RecordModalProps> = ({
  record,
  isOpen,
  onClose,
  onUpdateRecord,
  onAuthorFilter
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<any[]>([]);

  // record가 변경될 때마다 상태 동기화
  useEffect(() => {
    if (record) {
      setIsLiked(record.isLiked || false);
      setLikeCount(record.likes);
      setComments(record.comments || []);
    }
  }, [record]);

  if (!record) return null;

  const handleLike = () => {
    const newIsLiked = !isLiked;
    const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1;
    
    setIsLiked(newIsLiked);
    setLikeCount(newLikeCount);

    // 업데이트된 기록을 부모 컴포넌트에 전달
    const updatedRecord = {
      ...record,
      likes: newLikeCount,
      isLiked: newIsLiked
    };
    onUpdateRecord(updatedRecord);
  };

  const handleComment = () => {
    if (comment.trim()) {
      const newComment = {
        id: `comment-${Date.now()}`,
        userId: "1", // 현재 사용자 ID
        userName: "김다은", // 현재 사용자 이름
        content: comment.trim(),
        createdAt: new Date().toLocaleString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      const updatedComments = [...comments, newComment];
      setComments(updatedComments);
      setComment('');

      // 업데이트된 기록을 부모 컴포넌트에 전달
      const updatedRecord = {
        ...record,
        comments: updatedComments
      };
      onUpdateRecord(updatedRecord);
    }
  };

  const handleAuthorClick = () => {
    onAuthorFilter(record.userName);
    onClose();
  };

  const today = new Date().toISOString().split('T')[0];
  const isToday = record.createdAt === today;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <div className="space-y-4">
          {/* 헤더 */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {record.userName.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleAuthorClick}
                  className="font-semibold text-gray-900 hover:text-orange-500 transition-colors cursor-pointer"
                >
                  {record.userName}
                </button>
                {record.userId === "1" && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">나</span>
                )}
                {isToday && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full animate-pulse">오늘</span>
                )}
                {record.isRunning && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center space-x-1">
                    <Activity size={10} />
                    <span>런닝</span>
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">{record.createdAt}</p>
            </div>
          </div>

          {/* 런닝 정보 */}
          {record.isRunning && (record.distance || record.duration) && (
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="flex items-center space-x-4">
                {record.distance && (
                  <div className="flex items-center space-x-1 text-green-700">
                    <Route size={16} />
                    <span className="text-sm font-medium">{record.distance}km</span>
                  </div>
                )}
                {record.duration && (
                  <div className="flex items-center space-x-1 text-green-700">
                    <Clock size={16} />
                    <span className="text-sm font-medium">{record.duration}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 이미지 */}
          <div className="w-full h-64 rounded-lg overflow-hidden">
            <img 
              src={record.image} 
              alt={record.memo}
              className="w-full h-full object-cover"
            />
          </div>

          {/* 위치 정보 */}
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin size={16} />
            <span className="text-sm">{record.location.address}</span>
          </div>

          {/* 메모 */}
          <div className="space-y-2">
            <p className="text-gray-900 leading-relaxed">{record.memo}</p>
            <div className="flex flex-wrap gap-2">
              {record.hashtags.map((tag, index) => (
                <span 
                  key={index}
                  className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full hover:bg-blue-100 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* 좋아요 및 댓글 */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 ${
                  isLiked ? 'text-red-500' : 'text-gray-500'
                } hover:text-red-500 transition-colors`}
              >
                <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                <span className="text-sm font-medium">{likeCount}</span>
              </button>
              <div className="flex items-center space-x-1 text-gray-500">
                <MessageCircle size={20} />
                <span className="text-sm">{comments.length}</span>
              </div>
            </div>
          </div>

          {/* 댓글 목록 */}
          {comments.length > 0 && (
            <div className="space-y-3 border-t pt-3 max-h-40 overflow-y-auto">
              <p className="font-semibold text-sm text-gray-700">댓글 {comments.length}개</p>
              {comments.map((comment) => (
                <div key={comment.id} className="space-y-1 bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <span className="font-semibold text-sm text-gray-900">
                      {comment.userName}
                    </span>
                    <span className="text-sm text-gray-700 flex-1">{comment.content}</span>
                  </div>
                  <p className="text-xs text-gray-500 ml-2">{comment.createdAt}</p>
                </div>
              ))}
            </div>
          )}

          {/* 댓글 입력 */}
          <div className="flex space-x-2 border-t pt-3">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="친구에게 댓글을 남겨보세요..."
              className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              onKeyPress={(e) => e.key === 'Enter' && handleComment()}
            />
            <Button 
              onClick={handleComment}
              size="sm"
              className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600"
            >
              전송
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
