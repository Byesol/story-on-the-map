
import React, { useState } from 'react';
import { Record } from '@/data/mockData';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, MapPin } from 'lucide-react';

interface RecordModalProps {
  record: Record | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RecordModal: React.FC<RecordModalProps> = ({
  record,
  isOpen,
  onClose
}) => {
  const [isLiked, setIsLiked] = useState(record?.isLiked || false);
  const [likeCount, setLikeCount] = useState(record?.likes || 0);
  const [comment, setComment] = useState('');

  if (!record) return null;

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleComment = () => {
    if (comment.trim()) {
      console.log('댓글 작성:', comment);
      setComment('');
    }
  };

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
            <div>
              <p className="font-semibold text-gray-900">{record.userName}</p>
              <p className="text-sm text-gray-500">{record.createdAt}</p>
            </div>
          </div>

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
            <p className="text-gray-900">{record.memo}</p>
            <div className="flex flex-wrap gap-2">
              {record.hashtags.map((tag, index) => (
                <span 
                  key={index}
                  className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full"
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
                <span className="text-sm">{likeCount}</span>
              </button>
              <div className="flex items-center space-x-1 text-gray-500">
                <MessageCircle size={20} />
                <span className="text-sm">{record.comments.length}</span>
              </div>
            </div>
          </div>

          {/* 댓글 목록 */}
          {record.comments.length > 0 && (
            <div className="space-y-2 border-t pt-2">
              <p className="font-semibold text-sm text-gray-700">댓글</p>
              {record.comments.map((comment) => (
                <div key={comment.id} className="space-y-1">
                  <div className="flex items-start space-x-2">
                    <span className="font-semibold text-sm text-gray-900">
                      {comment.userName}
                    </span>
                    <span className="text-sm text-gray-700">{comment.content}</span>
                  </div>
                  <p className="text-xs text-gray-500 ml-2">{comment.createdAt}</p>
                </div>
              ))}
            </div>
          )}

          {/* 댓글 입력 */}
          <div className="flex space-x-2 border-t pt-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="댓글을 입력하세요..."
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
