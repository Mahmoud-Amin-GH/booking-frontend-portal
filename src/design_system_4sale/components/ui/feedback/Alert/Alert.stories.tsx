import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertTitle, AlertDescription } from './Alert';
import { AlertCircle, CheckCircle, AlertTriangle, Info, Terminal, Lightbulb, Shield, Zap } from 'lucide-react';

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile alert component for displaying important messages, notifications, and status updates. Supports various variants, custom icons, dismissible functionality, and accessibility features.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'success', 'warning', 'info'],
      description: 'The visual variant of the alert'
    },
    dismissible: {
      control: 'boolean',
      description: 'Makes the alert dismissible with a close button'
    },
    showIcon: {
      control: 'boolean',
      description: 'Controls whether to show the default icon'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'This is a default alert message.'
  }
};

export const Variants: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-2xl">
      <Alert variant="default">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Default Alert</AlertTitle>
        <AlertDescription>
          This is a default alert with neutral styling.
        </AlertDescription>
      </Alert>
      
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Alert</AlertTitle>
        <AlertDescription>
          Something went wrong. Please check your input and try again.
        </AlertDescription>
      </Alert>
      
      <Alert variant="success">
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Success Alert</AlertTitle>
        <AlertDescription>
          Your action was completed successfully!
        </AlertDescription>
      </Alert>
      
      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Warning Alert</AlertTitle>
        <AlertDescription>
          Please review your settings before proceeding.
        </AlertDescription>
      </Alert>
      
      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>Info Alert</AlertTitle>
        <AlertDescription>
          Here's some helpful information for you to consider.
        </AlertDescription>
      </Alert>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different visual variants of the alert component using the Figma color system.'
      }
    }
  }
};

export const SimpleAlerts: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-2xl">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        Simple default alert without title.
      </Alert>
      
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        Error: Unable to save your changes.
      </Alert>
      
      <Alert variant="success">
        <CheckCircle className="h-4 w-4" />
        Successfully saved your preferences.
      </Alert>
      
      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        Your session will expire in 5 minutes.
      </Alert>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Simple alerts without titles for quick notifications.'
      }
    }
  }
};

export const WithCustomIcons: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-2xl">
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Terminal Access</AlertTitle>
        <AlertDescription>
          You now have terminal access to the server.
        </AlertDescription>
      </Alert>
      
      <Alert variant="warning">
        <Lightbulb className="h-4 w-4" />
        <AlertTitle>Pro Tip</AlertTitle>
        <AlertDescription>
          Use keyboard shortcuts to navigate faster through the interface.
        </AlertDescription>
      </Alert>
      
      <Alert variant="success">
        <Shield className="h-4 w-4" />
        <AlertTitle>Security Update</AlertTitle>
        <AlertDescription>
          Your account security has been enhanced with two-factor authentication.
        </AlertDescription>
      </Alert>
      
      <Alert variant="info">
        <Zap className="h-4 w-4" />
        <AlertTitle>Performance Boost</AlertTitle>
        <AlertDescription>
          Your application is now running 40% faster with the latest optimizations.
        </AlertDescription>
      </Alert>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Alerts with custom icons for specific contexts and meanings.'
      }
    }
  }
};

export const Dismissible: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-2xl">
      <Alert dismissible onDismiss={() => alert('Default alert dismissed!')}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Dismissible Alert</AlertTitle>
        <AlertDescription>
          This alert can be dismissed by clicking the X button.
        </AlertDescription>
      </Alert>
      
      <Alert variant="success" dismissible onDismiss={() => alert('Success alert dismissed!')}>
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Task Completed</AlertTitle>
        <AlertDescription>
          Your file has been uploaded successfully. You can dismiss this notification.
        </AlertDescription>
      </Alert>
      
      <Alert variant="warning" dismissible onDismiss={() => alert('Warning alert dismissed!')}>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Storage Almost Full</AlertTitle>
        <AlertDescription>
          You're using 90% of your storage space. Consider upgrading your plan.
        </AlertDescription>
      </Alert>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Dismissible alerts that can be closed by the user. Click the X to dismiss.'
      }
    }
  }
};

export const WithoutIcons: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-2xl">
      <Alert showIcon={false}>
        <AlertTitle>Clean Alert</AlertTitle>
        <AlertDescription>
          This alert doesn't show any icon for a cleaner look.
        </AlertDescription>
      </Alert>
      
      <Alert variant="destructive" showIcon={false}>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Something went wrong. Please try again later.
        </AlertDescription>
      </Alert>
      
      <Alert variant="success" showIcon={false}>
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>
          Your changes have been saved successfully.
        </AlertDescription>
      </Alert>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Alerts without icons for a minimal, text-focused design.'
      }
    }
  }
};

export const ComplexContent: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-2xl">
      <Alert variant="warning" dismissible onDismiss={() => alert('Alert dismissed!')}>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Update Required</AlertTitle>
        <AlertDescription>
          <p className="mb-2">
            A new version of the application is available. This update includes:
          </p>
          <ul className="list-disc list-inside space-y-1 mb-3">
            <li>Security improvements</li>
            <li>Bug fixes and performance enhancements</li>
            <li>New features and UI improvements</li>
          </ul>
          <p>
            <a href="#" className="font-medium underline">
              Learn more about this update
            </a>
          </p>
        </AlertDescription>
      </Alert>
      
      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>Maintenance Scheduled</AlertTitle>
        <AlertDescription>
          <p className="mb-2">
            We'll be performing scheduled maintenance on our servers:
          </p>
          <div className="bg-muted p-3 rounded-md mb-2">
            <p className="font-mono text-sm">
              <strong>Date:</strong> Sunday, December 17, 2023<br />
              <strong>Time:</strong> 2:00 AM - 4:00 AM EST<br />
              <strong>Duration:</strong> Approximately 2 hours
            </p>
          </div>
          <p>
            During this time, some features may be temporarily unavailable.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Alerts with complex content including lists, links, and formatted text.'
      }
    }
  }
};

export const StatusNotifications: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-2xl">
      <Alert variant="success">
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Payment Successful</AlertTitle>
        <AlertDescription>
          Your payment of $29.99 has been processed successfully. Receipt sent to your email.
        </AlertDescription>
      </Alert>
      
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Connection Failed</AlertTitle>
        <AlertDescription>
          Unable to connect to the server. Please check your internet connection and try again.
        </AlertDescription>
      </Alert>
      
      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Unsaved Changes</AlertTitle>
        <AlertDescription>
          You have unsaved changes. Are you sure you want to leave this page?
        </AlertDescription>
      </Alert>
      
      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>New Feature Available</AlertTitle>
        <AlertDescription>
          Dark mode is now available in your settings. Toggle between light and dark themes.
        </AlertDescription>
      </Alert>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Common status notifications and system messages.'
      }
    }
  }
};

export const FormValidation: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-2xl">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Form Validation Error</AlertTitle>
        <AlertDescription>
          Please correct the following errors before submitting:
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Email address is required</li>
            <li>Password must be at least 8 characters</li>
            <li>Please accept the terms and conditions</li>
          </ul>
        </AlertDescription>
      </Alert>
      
      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Weak Password</AlertTitle>
        <AlertDescription>
          Your password is weak. Consider using a combination of uppercase, lowercase, numbers, and special characters.
        </AlertDescription>
      </Alert>
      
      <Alert variant="success">
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Account Created</AlertTitle>
        <AlertDescription>
          Your account has been created successfully. Please check your email to verify your account.
        </AlertDescription>
      </Alert>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Alerts used for form validation and user feedback.'
      }
    }
  }
};

export const CustomStyling: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-2xl">
      <Alert className="border-l-4 border-l-primary bg-primary/5">
        <Info className="h-4 w-4" />
        <AlertTitle>Custom Border</AlertTitle>
        <AlertDescription>
          This alert has a custom left border for emphasis.
        </AlertDescription>
      </Alert>
      
      <Alert className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <Zap className="h-4 w-4" />
        <AlertTitle>Gradient Background</AlertTitle>
        <AlertDescription>
          This alert uses a gradient background with brand colors.
        </AlertDescription>
      </Alert>
      
      <Alert className="rounded-none border-2 border-dashed">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Custom Styling</AlertTitle>
        <AlertDescription>
          This alert demonstrates custom styling with dashed borders and no rounded corners.
        </AlertDescription>
      </Alert>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Examples of custom styling using className overrides.'
      }
    }
  }
}; 