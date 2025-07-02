
import React from 'react';
import { MapPin, Calendar, User, Compass, Users } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { 
      id: 'map', 
      label: '지도', 
      icon: MapPin, 
      path: '/',
      isActive: location.pathname === '/'
    },
    { 
      id: 'explore', 
      label: '둘러보기', 
      icon: Compass, 
      path: '/explore',
      isActive: location.pathname === '/explore'
    },
    { 
      id: 'records', 
      label: '내 기록', 
      icon: Calendar, 
      path: '/my-records',
      isActive: location.pathname === '/my-records'
    },
    { 
      id: 'friends', 
      label: '친구', 
      icon: Users, 
      path: '/friends',
      isActive: location.pathname === '/friends'
    },
    { 
      id: 'profile', 
      label: '프로필', 
      icon: User, 
      path: '/profile',
      isActive: location.pathname === '/profile'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center py-2 px-2 rounded-lg transition-colors ${
                item.isActive 
                  ? 'text-purple-600 bg-purple-50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
