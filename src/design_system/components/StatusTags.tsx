import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

interface StatusTagProps {
  type: 'stock' | 'rented';
  count: number;
}

interface StatusTagsProps {
  stockCount: number;
  rentedCount: number;
}

const StatusTag: React.FC<StatusTagProps> = ({ type, count }) => {
  const { t } = useTranslation();
  
  if (count === 0) return null;
  
  const isStock = type === 'stock';
  const backgroundColor = isStock ? '#0062FF' : '#FFB700';
  const text = isStock 
    ? `${count} ${t('status.inStock')}`
    : `${count} ${t('status.rented')}`;
  
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor,
        color: '#FFFFFF',
        borderRadius: '999px',
        padding: '2px 6px',
        fontSize: '10px',
        fontFamily: 'SS Sakr Soft',
        fontWeight: 500,
        lineHeight: 1.33,
        height: '16px',
        minWidth: 'auto',
        textAlign: 'center',
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </Box>
  );
};

export const StatusTags: React.FC<StatusTagsProps> = ({ stockCount, rentedCount }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        flexWrap: 'wrap',
      }}
    >
      <StatusTag type="rented" count={rentedCount} />
      <StatusTag type="stock" count={stockCount} />
    </Box>
  );
}; 