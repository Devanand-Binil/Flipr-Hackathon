import { useState } from 'react';

const Avatar = ({ 
  src, 
  alt, 
  size = 'md', 
  status, 
  className = '', 
  onClick = null 
}) => {
  const [error, setError] = useState(false);
  
  // Handle image load error
  const handleError = () => {
    setError(true);
  };
  
  // Generate initials from name for fallback
  const getInitials = () => {
    if (!alt) return '?';
    
    return alt
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Size classes
  const sizeClasses = {
    'xs': 'w-8 h-8 text-xs',
    'sm': 'w-10 h-10 text-sm',
    'md': 'w-12 h-12 text-base',
    'lg': 'w-16 h-16 text-lg',
    'xl': 'w-20 h-20 text-xl'
  };
  
  // Status indicator classes
  const statusClasses = {
    'online': 'bg-green-500',
    'away': 'bg-yellow-500',
    'offline': 'bg-gray-400',
    'busy': 'bg-red-500'
  };
  
  return (
    <div className="relative inline-block">
      <div 
        className={`rounded-full overflow-hidden flex items-center justify-center ${sizeClasses[size]} ${className} ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
      >
        {!error && src ? (
          <img 
            src={src} 
            alt={alt} 
            className="w-full h-full object-cover"
            onError={handleError}
          />
        ) : (
          <div className="w-full h-full bg-primary-600 text-white flex items-center justify-center font-medium">
            {getInitials()}
          </div>
        )}
      </div>
      
      {status && (
        <span 
          className={`absolute bottom-0 right-0 rounded-full border-2 border-white ${statusClasses[status] || 'bg-gray-400'}`}
          style={{ width: '30%', height: '30%', minWidth: '8px', minHeight: '8px' }}
        ></span>
      )}
    </div>
  );
};

export default Avatar;