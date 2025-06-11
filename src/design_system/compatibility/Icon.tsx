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
  Search,
  Settings,
  Car,
  Plus,
  Edit,
  Trash2,
  Filter,
  MoreVertical
} from 'lucide-react';

export interface IconProps {
  name: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  onClick?: () => void;
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
  'kuwait-flag': Flag,
  search: Search,
  settings: Settings,
  car: Car,
  plus: Plus,
  edit: Edit,
  delete: Trash2,
  filter: Filter,
  'more-vert': MoreVertical,
};

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 'medium', 
  className = '',
  onClick 
}) => {
  const IconComponent = iconMap[name as keyof typeof iconMap] || User; // fallback to User icon
  
  const sizeMap = {
    small: 16,
    medium: 20,
    large: 24,
  };

  return (
    <IconComponent
      size={sizeMap[size]}
      className={`${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    />
  );
}; 