import React from 'react';
import {
  Phone,
  Mail,
  User,
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  ChevronRight,
  ChevronLeft,
  Flag,
} from 'lucide-react';

export interface IconProps {
  name: 'phone' | 'email' | 'user' | 'lock' | 'eye' | 'eye-off' | 'check' | 'close' | 'arrow-right' | 'arrow-left' | 'kuwait-flag' | 'visibility' | 'visibility-off';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  sx?: any;
}

// Map our custom icon names to Lucide React icons
const iconMap = {
  phone: Phone,
  email: Mail,
  user: User,
  lock: Lock,
  eye: Eye,
  'eye-off': EyeOff,
  visibility: Eye,
  'visibility-off': EyeOff,
  check: Check,
  close: X,
  'arrow-right': ChevronRight,
  'arrow-left': ChevronLeft,
  'kuwait-flag': Flag, // Using generic flag, could be customized
};

const Icon: React.FC<IconProps> = ({ name, size = 'medium', className = '', sx }) => {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  // Handle kuwait-flag special case with custom SVG
  if (name === 'kuwait-flag') {
    const sizeMap = {
      small: 16,
      medium: 20,
      large: 24,
    };
    
    return (
      <span className={`inline-flex items-center justify-center ${className}`}>
        <svg width={sizeMap[size]} height={sizeMap[size] * 0.67} viewBox="0 0 24 16" fill="none">
          <rect width="24" height="16" fill="#CE1126" />
          <rect width="24" height="5.33" fill="#FFFFFF" />
          <rect y="10.67" width="24" height="5.33" fill="#007A3D" />
          <polygon points="0,0 7,5.33 7,0" fill="#000000" />
          <polygon points="0,16 7,10.67 7,16" fill="#000000" />
          <polygon points="0,5.33 7,5.33 0,10.67" fill="#000000" />
        </svg>
      </span>
    );
  }

  const sizeMap = {
    small: 16,
    medium: 20,
    large: 24,
  };

  return (
    <IconComponent
      size={sizeMap[size]}
      className={className}
    />
  );
};

export default Icon; 