import React from 'react';
import { SvgIcon, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import * as MUIIcons from '@mui/icons-material';

export interface IconProps {
  name: 'phone' | 'email' | 'user' | 'lock' | 'eye' | 'eye-off' | 'check' | 'close' | 'arrow-right' | 'arrow-left' | 'kuwait-flag' | 'visibility' | 'visibility-off';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

// Size mapping
const iconSizes = {
  small: 16,
  medium: 20,
  large: 24,
};

// Note: StyledIcon removed as we're using direct sx props for better performance

// Kuwait flag custom SVG component
const KuwaitFlag: React.FC<{ size: number }> = ({ size }) => (
  <SvgIcon viewBox="0 0 24 16" sx={{ fontSize: size, width: size, height: size * (16/24) }}>
    {/* Kuwait flag with proper colors */}
    <rect width="24" height="16" fill="#CE1126" />
    <rect width="24" height="5.33" fill="#FFFFFF" />
    <rect y="10.67" width="24" height="5.33" fill="#007A3D" />
    <polygon points="0,0 7,5.33 7,0" fill="#000000" />
    <polygon points="0,16 7,10.67 7,16" fill="#000000" />
    <polygon points="0,5.33 7,5.33 0,10.67" fill="#000000" />
  </SvgIcon>
);

// Icon mapping from existing names to MUI icons
const iconMapping: Record<IconProps['name'], React.ComponentType<any>> = {
  phone: MUIIcons.Phone,
  email: MUIIcons.Email,
  user: MUIIcons.Person,
  lock: MUIIcons.Lock,
  eye: MUIIcons.Visibility,
  'eye-off': MUIIcons.VisibilityOff,
  visibility: MUIIcons.Visibility,
  'visibility-off': MUIIcons.VisibilityOff,
  check: MUIIcons.Check,
  close: MUIIcons.Close,
  'arrow-right': MUIIcons.ChevronRight,
  'arrow-left': MUIIcons.ChevronLeft,
  'kuwait-flag': KuwaitFlag as any, // Special case for custom SVG
};

const Icon: React.FC<IconProps> = ({ name, size = 'medium', className }) => {
  const iconSize = iconSizes[size];
  const IconComponent = iconMapping[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  // Special handling for Kuwait flag
  if (name === 'kuwait-flag') {
    return (
      <Box className={className} sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <KuwaitFlag size={iconSize} />
      </Box>
    );
  }

  return (
    <Box className={className} sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <IconComponent 
        sx={{ 
          fontSize: iconSize,
          width: iconSize,
          height: iconSize,
        }} 
      />
    </Box>
  );
};

export default Icon; 