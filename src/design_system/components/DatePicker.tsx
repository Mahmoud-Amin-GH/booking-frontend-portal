import React from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from '@emotion/styled';

interface DatePickerProps {
  label?: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  placeholderText?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

const StyledDatePicker = styled(ReactDatePicker)`
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  padding: 0.5rem;
  border: 1px solid var(--outline);
  border-radius: 0.375rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--on-surface);
  background-color: var(--surface);
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px var(--primary-container);
  }
  
  &:disabled {
    background-color: var(--surface-variant);
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: var(--on-surface-variant);
  }
`;

const Container = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--on-surface);
`;

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  placeholderText,
  disabled,
  fullWidth,
  className
}) => {
  return (
    <Container fullWidth={fullWidth} className={className}>
      {label && <Label>{label}</Label>}
      <StyledDatePicker
        selected={value}
        onChange={onChange}
        minDate={minDate}
        maxDate={maxDate}
        placeholderText={placeholderText}
        disabled={disabled}
        fullWidth={fullWidth}
        dateFormat="yyyy-MM-dd"
      />
    </Container>
  );
}; 