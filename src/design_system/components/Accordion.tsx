import React, { useState } from 'react';
import {
  Accordion as MuiAccordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import Typography from '../primitives/Typography';

export interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  disabled?: boolean;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  onToggle?: (expanded: boolean) => void;
  sx?: any;
}

const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  defaultExpanded = false,
  disabled = false,
  className = '',
  titleClassName = '',
  contentClassName = '',
  onToggle,
  sx,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleToggle = (_event: React.SyntheticEvent, expanded: boolean) => {
    if (disabled) return;
    
    setIsExpanded(expanded);
    onToggle?.(expanded);
  };

  return (
    <MuiAccordion
      expanded={isExpanded}
      onChange={handleToggle}
      disabled={disabled}
      className={className}
      sx={{
        borderRadius: 2, // rounded-lg
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        overflow: 'hidden',
        '&:before': {
          display: 'none', // Remove default MUI before element
        },
        '&.Mui-expanded': {
          margin: 0, // Remove default MUI margin
        },
        ...sx,
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        className={titleClassName}
        sx={{
          px: 3,
          py: 2,
          '&:hover': {
            backgroundColor: 'action.hover',
          },
          '&.Mui-focusVisible': {
            backgroundColor: 'action.focus',
          },
          '& .MuiAccordionSummary-expandIconWrapper': {
            transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            color: 'text.secondary',
          },
          '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
            transform: 'rotate(180deg)',
          },
        }}
      >
        <Typography 
          variant="title-medium" 
          color={disabled ? 'on-surface-variant' : 'on-surface'}
          sx={{ 
            fontWeight: 500,
            textAlign: 'left',
          }}
        >
          {title}
        </Typography>
      </AccordionSummary>
      
      <AccordionDetails
        className={contentClassName}
        sx={{
          px: 3,
          pb: 3,
          pt: 0,
        }}
      >
        {children}
      </AccordionDetails>
    </MuiAccordion>
  );
};

export default Accordion; 