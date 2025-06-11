import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Alert, AlertTitle, AlertDescription } from './Alert';
import { AlertCircle } from 'lucide-react';

describe('Alert', () => {
  it('renders with default props', () => {
    render(<Alert>Default alert message</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveClass('relative', 'w-full', 'rounded-lg', 'border', 'p-4');
    expect(screen.getByText('Default alert message')).toBeInTheDocument();
  });

  it('renders different variants', () => {
    const { rerender } = render(<Alert variant="destructive">Error alert</Alert>);
    let alert = screen.getByRole('alert');
    expect(alert).toHaveClass('border-destructive/50', 'text-destructive');

    rerender(<Alert variant="success">Success alert</Alert>);
    alert = screen.getByRole('alert');
    expect(alert).toHaveClass('border-success/50', 'text-success');

    rerender(<Alert variant="warning">Warning alert</Alert>);
    alert = screen.getByRole('alert');
    expect(alert).toHaveClass('border-warning/50', 'text-warning');

    rerender(<Alert variant="info">Info alert</Alert>);
    alert = screen.getByRole('alert');
    expect(alert).toHaveClass('border-info/50', 'text-info');
  });

  it('renders with title', () => {
    render(<Alert title="Alert Title">Alert message</Alert>);
    expect(screen.getByText('Alert Title')).toBeInTheDocument();
    expect(screen.getByText('Alert Title')).toHaveClass('text-sm', 'font-medium', 'mb-1');
    expect(screen.getByText('Alert message')).toBeInTheDocument();
  });

  it('renders with default icon based on variant', () => {
    const { rerender } = render(<Alert variant="destructive">Error</Alert>);
    expect(screen.getByRole('alert')).toContainElement(screen.getByRole('alert').querySelector('svg'));

    rerender(<Alert variant="success">Success</Alert>);
    expect(screen.getByRole('alert')).toContainElement(screen.getByRole('alert').querySelector('svg'));

    rerender(<Alert variant="warning">Warning</Alert>);
    expect(screen.getByRole('alert')).toContainElement(screen.getByRole('alert').querySelector('svg'));

    rerender(<Alert variant="info">Info</Alert>);
    expect(screen.getByRole('alert')).toContainElement(screen.getByRole('alert').querySelector('svg'));
  });

  it('renders with custom icon', () => {
    render(
      <Alert icon={<AlertCircle data-testid="custom-icon" />}>
        Custom icon alert
      </Alert>
    );
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('hides icon when showIcon is false', () => {
    render(<Alert showIcon={false}>No icon alert</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert.querySelector('svg')).not.toBeInTheDocument();
  });

  it('renders dismissible alert', () => {
    const handleDismiss = vi.fn();
    render(
      <Alert dismissible onDismiss={handleDismiss}>
        Dismissible alert
      </Alert>
    );
    
    const dismissButton = screen.getByRole('button', { name: 'Dismiss alert' });
    expect(dismissButton).toBeInTheDocument();
    
    fireEvent.click(dismissButton);
    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });

  it('renders dismissible alert with proper accessibility', () => {
    render(
      <Alert dismissible onDismiss={() => {}}>
        Accessible dismissible alert
      </Alert>
    );
    
    const dismissButton = screen.getByRole('button', { name: 'Dismiss alert' });
    expect(dismissButton).toHaveAttribute('aria-label', 'Dismiss alert');
    expect(dismissButton).toHaveClass('focus:outline-none', 'focus:ring-2');
  });

  it('renders with custom className', () => {
    render(<Alert className="custom-class">Custom alert</Alert>);
    expect(screen.getByRole('alert')).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Alert ref={ref}>Alert</Alert>);
    expect(ref).toHaveBeenCalled();
  });

  it('renders complex content structure', () => {
    render(
      <Alert title="Complex Alert" dismissible onDismiss={() => {}}>
        <p>This is a complex alert with multiple elements.</p>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </Alert>
    );

    expect(screen.getByText('Complex Alert')).toBeInTheDocument();
    expect(screen.getByText('This is a complex alert with multiple elements.')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Dismiss alert' })).toBeInTheDocument();
  });

  it('does not render dismiss button when not dismissible', () => {
    render(<Alert>Non-dismissible alert</Alert>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

describe('AlertTitle', () => {
  it('renders as h5 with proper styling', () => {
    render(<AlertTitle>Alert Title</AlertTitle>);
    const title = screen.getByRole('heading', { level: 5 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('mb-1', 'font-medium', 'leading-none', 'tracking-tight');
  });

  it('renders with custom className', () => {
    render(<AlertTitle className="custom-title">Title</AlertTitle>);
    expect(screen.getByRole('heading')).toHaveClass('custom-title');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<AlertTitle ref={ref}>Title</AlertTitle>);
    expect(ref).toHaveBeenCalled();
  });
});

describe('AlertDescription', () => {
  it('renders with proper styling', () => {
    render(<AlertDescription>Alert description</AlertDescription>);
    const description = screen.getByText('Alert description');
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass('text-sm');
  });

  it('renders with custom className', () => {
    render(<AlertDescription className="custom-desc">Description</AlertDescription>);
    expect(screen.getByText('Description')).toHaveClass('custom-desc');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<AlertDescription ref={ref}>Description</AlertDescription>);
    expect(ref).toHaveBeenCalled();
  });

  it('handles complex content', () => {
    render(
      <AlertDescription>
        <p>Paragraph content</p>
        <a href="#link">Link content</a>
      </AlertDescription>
    );

    expect(screen.getByText('Paragraph content')).toBeInTheDocument();
    expect(screen.getByText('Link content')).toBeInTheDocument();
  });
});

describe('Alert composition', () => {
  it('renders complete alert structure', () => {
    render(
      <Alert variant="warning" dismissible onDismiss={() => {}}>
        <AlertTitle>Warning Alert</AlertTitle>
        <AlertDescription>
          This is a warning message with detailed information.
        </AlertDescription>
      </Alert>
    );

    expect(screen.getByRole('heading', { name: 'Warning Alert' })).toBeInTheDocument();
    expect(screen.getByText('This is a warning message with detailed information.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Dismiss alert' })).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('border-warning/50', 'text-warning');
  });
}); 