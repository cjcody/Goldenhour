import React from 'react';

/**
 * Reusable Skeleton component for loading states
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.variant - Skeleton variant (text, circular, rectangular)
 * @param {number} props.width - Width of the skeleton
 * @param {number} props.height - Height of the skeleton
 * @param {boolean} props.animated - Whether to show animation (default: true)
 */
const Skeleton = ({ 
  className = '', 
  variant = 'text', 
  width, 
  height, 
  animated = true,
  ...props 
}) => {
  const baseClasses = 'bg-gray-200 rounded';
  const animationClasses = animated ? 'animate-pulse' : '';
  
  let variantClasses = '';
  let style = {};
  
  // Set variant-specific classes and styles
  switch (variant) {
    case 'circular':
      variantClasses = 'rounded-full';
      break;
    case 'rectangular':
      variantClasses = 'rounded';
      break;
    case 'text':
    default:
      variantClasses = 'rounded';
      break;
  }
  
  // Set width and height if provided
  if (width) {
    style.width = typeof width === 'number' ? `${width}px` : width;
  }
  if (height) {
    style.height = typeof height === 'number' ? `${height}px` : height;
  }
  
  const combinedClasses = `${baseClasses} ${variantClasses} ${animationClasses} ${className}`.trim();
  
  return (
    <div 
      className={combinedClasses}
      style={style}
      {...props}
    />
  );
};

/**
 * Text skeleton with multiple lines
 * @param {Object} props - Component props
 * @param {number} props.lines - Number of text lines (default: 1)
 * @param {string} props.className - Additional CSS classes
 */
export const TextSkeleton = ({ lines = 1, className = '', ...props }) => {
  return (
    <div className={`space-y-2 ${className}`} {...props}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          variant="text"
          height={4}
          width={i === lines - 1 ? '75%' : '100%'}
          className="h-4"
        />
      ))}
    </div>
  );
};

/**
 * Avatar skeleton
 * @param {Object} props - Component props
 * @param {string} props.size - Size of the avatar (sm, md, lg, xl)
 * @param {string} props.className - Additional CSS classes
 */
export const AvatarSkeleton = ({ size = 'md', className = '', ...props }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };
  
  return (
    <Skeleton
      variant="circular"
      className={`${sizeClasses[size]} ${className}`}
      {...props}
    />
  );
};

/**
 * Card skeleton
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 */
export const CardSkeleton = ({ className = '', ...props }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`} {...props}>
      <div className="flex items-center space-x-4 mb-4">
        <AvatarSkeleton size="md" />
        <div className="flex-1">
          <Skeleton height={4} width="60%" className="mb-2" />
          <Skeleton height={3} width="40%" />
        </div>
      </div>
      <TextSkeleton lines={3} />
    </div>
  );
};

/**
 * Button skeleton
 * @param {Object} props - Component props
 * @param {string} props.size - Size of the button (sm, md, lg)
 * @param {string} props.className - Additional CSS classes
 */
export const ButtonSkeleton = ({ size = 'md', className = '', ...props }) => {
  const sizeClasses = {
    sm: 'h-8 px-3',
    md: 'h-10 px-4',
    lg: 'h-12 px-6'
  };
  
  return (
    <Skeleton
      variant="rectangular"
      className={`${sizeClasses[size]} ${className}`}
      {...props}
    />
  );
};

export default Skeleton;
export { TextSkeleton, AvatarSkeleton, CardSkeleton, ButtonSkeleton }; 