import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Input } from './Input';
import { Mail, Search } from 'lucide-react';

describe('Input', () => {
  it('renders with default props', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Enter text');
  });

  it('renders with label', () => {
    render(<Input label="Email Address" />);
    expect(screen.getByText('Email Address')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAccessibleName('Email Address');
  });

  it('renders with required indicator', () => {
    render(<Input label="Email" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText('*')).toHaveClass('text-destructive');
  });

  it('renders different sizes', () => {
    const { rerender } = render(<Input size="sm" />);
    expect(screen.getByRole('textbox')).toHaveClass('h-8');

    rerender(<Input size="lg" />);
    expect(screen.getByRole('textbox')).toHaveClass('h-10');
  });

  it('handles error state', () => {
    render(<Input error="This field is required" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-destructive');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('handles success state', () => {
    render(<Input success="Looks good!" />);
    const input = screen.getByRole('textbox');
    expect(screen.getByText('Looks good!')).toBeInTheDocument();
  });

  it('renders with helper text', () => {
    render(<Input helperText="This will be displayed publicly" />);
    expect(screen.getByText('This will be displayed publicly')).toBeInTheDocument();
  });

  it('renders with start icon', () => {
    render(<Input startIcon={<Mail data-testid="mail-icon" />} />);
    expect(screen.getByTestId('mail-icon')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveClass('pl-10');
  });

  it('renders with end icon', () => {
    render(<Input endIcon={<Search data-testid="search-icon" />} />);
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveClass('pr-10');
  });

  it('handles password type with toggle', async () => {
    render(<Input type="password" />);
    const input = document.querySelector('input[type="password"]') as HTMLInputElement;
    const toggleButton = screen.getByRole('button');

    expect(input).toHaveAttribute('type', 'password');
    expect(toggleButton).toHaveAttribute('aria-label', 'Show password');

    fireEvent.click(toggleButton);
    await waitFor(() => {
      expect(input).toHaveAttribute('type', 'text');
      expect(toggleButton).toHaveAttribute('aria-label', 'Hide password');
    });

    fireEvent.click(toggleButton);
    await waitFor(() => {
      expect(input).toHaveAttribute('type', 'password');
    });
  });

  it('handles disabled state', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:cursor-not-allowed');
  });

  it('calls onChange when value changes', () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Input ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  it('associates helper text with input', () => {
    render(<Input helperText="Helper text" />);
    const input = screen.getByRole('textbox');
    const helperText = screen.getByText('Helper text');
    
    expect(input).toHaveAttribute('aria-describedby');
    expect(helperText).toHaveAttribute('id', input.getAttribute('aria-describedby'));
  });

  it('associates error message with input', () => {
    render(<Input error="Error message" />);
    const input = screen.getByRole('textbox');
    const errorMessage = screen.getByRole('alert');
    
    expect(input).toHaveAttribute('aria-describedby');
    expect(errorMessage).toHaveAttribute('id', input.getAttribute('aria-describedby'));
  });

  it('renders with custom className', () => {
    render(<Input className="custom-class" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom-class');
  });

  it('renders with container className', () => {
    const { container } = render(<Input containerClassName="container-class" />);
    const containerDiv = container.firstChild as HTMLElement;
    expect(containerDiv).toHaveClass('container-class');
  });
}); 