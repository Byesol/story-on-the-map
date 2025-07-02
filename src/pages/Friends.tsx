
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus, Search, Users } from 'lucide-react';
import BottomNavigation from '@/components/Layout/BottomNavigation';
import { mockUsers } from '@/data/mockData';

const Friends = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState(mockUsers.filter(user => user.isFriend));
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    // 실제로는 API 호출이 필요하지만, 여기서는 mockUsers에서 검색
    const results = mockUsers.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !user.isFriend &&
      user.id !== "1" // 본인 제외
    );
    setSearchResults(results);
  };

  const handleAddFriend = (userId: string) => {
    // 실제로는 API 호출이 필요
    const userToAdd = searchResults.find(user => user.id === userId);
    if (userToAdd) {
      setFriends([...friends, { ...userToAdd, isFriend: true }]);
      setSearchResults(searchResults.filter(user => user.id !== userId));
    }
  };

  const handleRemoveFriend = (userId: string) => {
    setFriends(friends.filter(friend => friend.id !== userId));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">친구 관리</h1>
          
          {/* 친구 검색 */}
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="친구 이름으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} size="sm">
                <Search size={16} />
              </Button>
            </div>

            {/* 검색 결과 */}
            {searchResults.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-700">검색 결과</h3>
                {searchResults.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                    <Button
                      onClick={() => handleAddFriend(user.id)}
                      size="sm"
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <UserPlus size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 친구 목록 */}
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="flex items-center space-x-2 mb-4">
          <Users size={20} className="text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">내 친구 ({friends.length})</h2>
        </div>
        
        <div className="space-y-3">
          {friends.map((friend) => (
            <div key={friend.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {friend.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{friend.name}</p>
                  <p className="text-sm text-gray-500">친구</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRemoveFriend(friend.id)}
                className="text-red-500 border-red-200 hover:bg-red-50"
              >
                삭제
              </Button>
            </div>
          ))}
          
          {friends.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users size={48} className="mx-auto mb-4 opacity-30" />
              <p>아직 친구가 없습니다.</p>
              <p className="text-sm">위의 검색을 통해 친구를 찾아보세요!</p>
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Friends;
