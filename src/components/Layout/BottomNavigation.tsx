
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, BookOpen, Users, User, BarChart3 } from 'lucide-react';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { 
      path: '/', 
      icon: MapPin, 
      label: '지도',
      isActive: location.pathname === '/'
    },
    { 
      path: '/my-records', 
      icon: BookOpen, 
      label: '내 기록',
      isActive: location.pathname === '/my-records'
    },
    { 
      path: '/stats', 
      icon: BarChart3, 
      label: '통계',
      isActive: location.pathname === '/stats'
    },
    { 
      path: '/friends', 
      icon: Users, 
      label: '친구',
      isActive: location.pathname === '/friends'
    },
    { 
      path: '/profile', 
      icon: User, 
      label: '프로필',
      isActive: location.pathname === '/profile'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                item.isActive
                  ? 'text-orange-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <IconComponent size={24} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
