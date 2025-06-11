import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Badge } from './Badge';
import { Star, X } from 'lucide-react';

describe('Badge', () => {
  it('renders with default props', () => {
    render(<Badge>Default Badge</Badge>);
    const badge = screen.getByText('Default Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('inline-flex', 'items-center', 'rounded-full', 'border');
  });

  it('renders different variants', () => {
    const { rerender } = render(<Badge variant="secondary">Secondary</Badge>);
    expect(screen.getByText('Secondary')).toHaveClass('bg-secondary');

    rerender(<Badge variant="destructive">Destructive</Badge>);
    expect(screen.getByText('Destructive')).toHaveClass('bg-destructive');

    rerender(<Badge variant="success">Success</Badge>);
    expect(screen.getByText('Success')).toHaveClass('bg-success');

    rerender(<Badge variant="warning">Warning</Badge>);
    expect(screen.getByText('Warning')).toHaveClass('bg-warning');

    rerender(<Badge variant="outline">Outline</Badge>);
    expect(screen.getByText('Outline')).toHaveClass('text-foreground', 'border-border');
  });

  it('renders different sizes', () => {
    const { rerender } = render(<Badge size="sm">Small</Badge>);
    expect(screen.getByText('Small')).toHaveClass('px-2', 'py-0.5', 'text-xs');

    rerender(<Badge size="lg">Large</Badge>);
    expect(screen.getByText('Large')).toHaveClass('px-3', 'py-1', 'text-sm');
  });

  it('renders with icon', () => {
    render(
      <Badge icon={<Star data-testid="star-icon" />}>
        With Icon
      </Badge>
    );
    
    expect(screen.getByTestId('star-icon')).toBeInTheDocument();
    expect(screen.getByText('With Icon')).toBeInTheDocument();
  });

  it('renders dismissible badge', () => {
    const handleDismiss = vi.fn();
    render(
      <Badge dismissible onDismiss={handleDismiss}>
        Dismissible Badge
      </Badge>
    );
    
    const dismissButton = screen.getByRole('button', { name: 'Remove badge' });
    expect(dismissButton).toBeInTheDocument();
    
    fireEvent.click(dismissButton);
    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });

  it('renders dismissible badge with proper accessibility', () => {
    render(
      <Badge dismissible onDismiss={() => {}}>
        Accessible Badge
      </Badge>
    );
    
    const dismissButton = screen.getByRole('button', { name: 'Remove badge' });
    expect(dismissButton).toHaveAttribute('aria-label', 'Remove badge');
    expect(dismissButton).toHaveClass('focus:outline-none', 'focus:ring-2');
  });

  it('renders with both icon and dismissible', () => {
    const handleDismiss = vi.fn();
    render(
      <Badge 
        icon={<Star data-testid="star-icon" />}
        dismissible 
        onDismiss={handleDismiss}
      >
        Complete Badge
      </Badge>
    );
    
    expect(screen.getByTestId('star-icon')).toBeInTheDocument();
    expect(screen.getByText('Complete Badge')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove badge' })).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    render(<Badge className="custom-class">Custom</Badge>);
    expect(screen.getByText('Custom')).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Badge ref={ref}>Badge</Badge>);
    expect(ref).toHaveBeenCalled();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Badge onClick={handleClick}>Clickable</Badge>);
    
    fireEvent.click(screen.getByText('Clickable'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not render dismiss button when not dismissible', () => {
    render(<Badge>Non-dismissible</Badge>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders dismiss button with X icon', () => {
    render(<Badge dismissible onDismiss={() => {}}>Test</Badge>);
    const dismissButton = screen.getByRole('button');
    const xIcon = dismissButton.querySelector('svg');
    expect(xIcon).toBeInTheDocument();
  });

  it('applies hover styles to dismiss button', () => {
    render(<Badge dismissible onDismiss={() => {}}>Test</Badge>);
    const dismissButton = screen.getByRole('button');
    expect(dismissButton).toHaveClass('hover:bg-black/10');
  });
}); 