import type { Meta, StoryObj } from '@storybook/react';
import { Toast, ToastProvider, useToast } from './Toast';
import { Button } from '../../core/Button';
import React from 'react';

const meta: Meta<typeof Toast> = {
  title: 'Feedback/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A toast notification component with different variants, auto-dismiss functionality, and action buttons.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'destructive', 'info'],
      description: 'The visual variant of the toast'
    },
    duration: {
      control: 'number',
      description: 'Auto-dismiss duration in milliseconds (null for no auto-dismiss)'
    },
    showIcon: {
      control: 'boolean',
      description: 'Whether to show the variant icon'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// Toast Demo Component
const ToastDemo: React.FC<{ variant?: 'default' | 'success' | 'warning' | 'destructive' | 'info' }> = ({ variant = 'default' }) => {
  const { addToast } = useToast();

  const handleShowToast = () => {
    addToast({
      title: 'Notification',
      description: 'This is a sample toast notification.',
      variant
    });
  };

  return (
    <Button onClick={handleShowToast}>
      Show {variant} Toast
    </Button>
  );
};

export const Default: Story = {
  render: () => (
    <ToastProvider>
      <ToastDemo />
    </ToastProvider>
  )
};

export const Success: Story = {
  render: () => (
    <ToastProvider>
      <ToastDemo variant="success" />
    </ToastProvider>
  )
};

export const Warning: Story = {
  render: () => (
    <ToastProvider>
      <ToastDemo variant="warning" />
    </ToastProvider>
  )
};

export const Destructive: Story = {
  render: () => (
    <ToastProvider>
      <ToastDemo variant="destructive" />
    </ToastProvider>
  )
};

export const Info: Story = {
  render: () => (
    <ToastProvider>
      <ToastDemo variant="info" />
    </ToastProvider>
  )
};

export const WithAction: Story = {
  render: () => {
    const ToastWithActionDemo = () => {
      const { addToast } = useToast();

      const handleShowToast = () => {
        addToast({
          title: 'Update Available',
          description: 'A new version of the app is available.',
          variant: 'info',
          action: {
            label: 'Update',
            onClick: () => alert('Updating...'),
            variant: 'primary'
          }
        });
      };

      return (
        <Button onClick={handleShowToast}>
          Show Toast with Action
        </Button>
      );
    };

    return (
      <ToastProvider>
        <ToastWithActionDemo />
      </ToastProvider>
    );
  }
};

export const Persistent: Story = {
  render: () => {
    const PersistentToastDemo = () => {
      const { addToast } = useToast();

      const handleShowToast = () => {
        addToast({
          title: 'Important Notice',
          description: 'This toast will not auto-dismiss. Click the X to close.',
          variant: 'warning',
          duration: null // No auto-dismiss
        });
      };

      return (
        <Button onClick={handleShowToast}>
          Show Persistent Toast
        </Button>
      );
    };

    return (
      <ToastProvider>
        <PersistentToastDemo />
      </ToastProvider>
    );
  }
};

export const MultipleToasts: Story = {
  render: () => {
    const MultipleToastsDemo = () => {
      const { addToast, clearToasts } = useToast();

      const variants: Array<'default' | 'success' | 'warning' | 'destructive' | 'info'> = 
        ['default', 'success', 'warning', 'destructive', 'info'];

      const handleShowMultiple = () => {
        variants.forEach((variant, index) => {
          setTimeout(() => {
            addToast({
              title: `${variant.charAt(0).toUpperCase() + variant.slice(1)} Toast`,
              description: `This is a ${variant} notification.`,
              variant
            });
          }, index * 500);
        });
      };

      return (
        <div className="space-x-2">
          <Button onClick={handleShowMultiple}>
            Show Multiple Toasts
          </Button>
          <Button variant="outline" onClick={clearToasts}>
            Clear All
          </Button>
        </div>
      );
    };

    return (
      <ToastProvider>
        <MultipleToastsDemo />
      </ToastProvider>
    );
  }
};

export const Positions: Story = {
  render: () => {
    const PositionDemo = () => {
      const positions: Array<'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'> = [
        'top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'
      ];

      return (
        <div className="grid grid-cols-2 gap-4">
          {positions.map((position) => (
            <ToastProvider key={position} position={position}>
              <ToastPositionDemo position={position} />
            </ToastProvider>
          ))}
        </div>
      );
    };

    const ToastPositionDemo: React.FC<{ position: string }> = ({ position }) => {
      const { addToast } = useToast();

      const handleShowToast = () => {
        addToast({
          title: position,
          description: `Toast positioned at ${position}`,
          variant: 'info'
        });
      };

      return (
        <Button size="sm" onClick={handleShowToast}>
          {position}
        </Button>
      );
    };

    return <PositionDemo />;
  }
};

export const CustomDuration: Story = {
  render: () => {
    const CustomDurationDemo = () => {
      const { addToast } = useToast();

      const durations = [1000, 3000, 5000, 10000];

      return (
        <div className="space-x-2">
          {durations.map((duration) => (
            <Button
              key={duration}
              size="sm"
              variant="outline"
              onClick={() => addToast({
                title: `${duration}ms Duration`,
                description: `This toast will dismiss after ${duration / 1000} seconds.`,
                variant: 'default',
                duration
              })}
            >
              {duration / 1000}s
            </Button>
          ))}
        </div>
      );
    };

    return (
      <ToastProvider>
        <CustomDurationDemo />
      </ToastProvider>
    );
  }
};

export const WithoutIcon: Story = {
  render: () => {
    const NoIconDemo = () => {
      const { addToast } = useToast();

      const handleShowToast = () => {
        addToast({
          title: 'Clean Toast',
          description: 'This toast has no icon for a cleaner look.',
          variant: 'success',
          showIcon: false
        });
      };

      return (
        <Button onClick={handleShowToast}>
          Show Toast without Icon
        </Button>
      );
    };

    return (
      <ToastProvider>
        <NoIconDemo />
      </ToastProvider>
    );
  }
};

export const FormExample: Story = {
  render: () => {
    const FormExampleDemo = () => {
      const { addToast } = useToast();
      const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        message: ''
      });

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name || !formData.email || !formData.message) {
          addToast({
            title: 'Validation Error',
            description: 'Please fill in all required fields.',
            variant: 'destructive'
          });
          return;
        }

        // Simulate API call
        addToast({
          title: 'Submitting...',
          description: 'Please wait while we process your request.',
          variant: 'info',
          duration: 2000
        });

        setTimeout(() => {
          addToast({
            title: 'Success!',
            description: 'Your message has been sent successfully.',
            variant: 'success',
            action: {
              label: 'View',
              onClick: () => alert('Viewing message...'),
              variant: 'outline'
            }
          });
          setFormData({ name: '', email: '', message: '' });
        }, 2000);
      };

      return (
        <form onSubmit={handleSubmit} className="space-y-4 w-80">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-md"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-md"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-md"
              rows={3}
              placeholder="Your message"
            />
          </div>
          <Button type="submit" className="w-full">
            Send Message
          </Button>
        </form>
      );
    };

    return (
      <ToastProvider>
        <FormExampleDemo />
      </ToastProvider>
    );
  }
}; 