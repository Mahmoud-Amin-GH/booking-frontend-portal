import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
import { Mail, Search, User, Lock, Phone, CreditCard, Eye, EyeOff } from 'lucide-react';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile input component with validation states, icons, helper text, and accessibility features. Supports various input types including password with visibility toggle.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the input'
    },
    state: {
      control: 'select',
      options: ['default', 'error', 'success'],
      description: 'The visual state of the input'
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
      description: 'The input type'
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input'
    },
    required: {
      control: 'boolean',
      description: 'Marks the input as required'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...'
  }
};

export const WithLabel: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email',
    type: 'email'
  }
};

export const Required: Story = {
  args: {
    label: 'Full Name',
    placeholder: 'Enter your full name',
    required: true
  }
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input size="sm" label="Small" placeholder="Small input" />
      <Input size="md" label="Medium (default)" placeholder="Medium input" />
      <Input size="lg" label="Large" placeholder="Large input" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different sizes available for the input component.'
      }
    }
  }
};

export const WithIcons: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input 
        label="Email" 
        placeholder="Enter email"
        startIcon={<Mail className="h-4 w-4" />}
      />
      <Input 
        label="Search" 
        placeholder="Search..."
        startIcon={<Search className="h-4 w-4" />}
      />
      <Input 
        label="Username" 
        placeholder="Enter username"
        startIcon={<User className="h-4 w-4" />}
      />
      <Input 
        label="Phone" 
        placeholder="Enter phone number"
        type="tel"
        startIcon={<Phone className="h-4 w-4" />}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Inputs with start icons for better visual context.'
      }
    }
  }
};

export const ValidationStates: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input 
        label="Default State" 
        placeholder="Default input"
        helperText="This is helper text"
      />
      <Input 
        label="Error State" 
        placeholder="Invalid input"
        error="This field is required"
      />
      <Input 
        label="Success State" 
        placeholder="Valid input"
        success="Looks good!"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different validation states with appropriate styling and messages.'
      }
    }
  }
};

export const PasswordInput: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input 
        label="Password" 
        type="password"
        placeholder="Enter your password"
        helperText="Password must be at least 8 characters"
      />
      <Input 
        label="Confirm Password" 
        type="password"
        placeholder="Confirm your password"
        success="Passwords match!"
      />
      <Input 
        label="Current Password" 
        type="password"
        placeholder="Enter current password"
        error="Incorrect password"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Password inputs with visibility toggle functionality.'
      }
    }
  }
};

export const InputTypes: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input 
        label="Email" 
        type="email"
        placeholder="user@example.com"
        startIcon={<Mail className="h-4 w-4" />}
      />
      <Input 
        label="Phone Number" 
        type="tel"
        placeholder="+1 (555) 123-4567"
        startIcon={<Phone className="h-4 w-4" />}
      />
      <Input 
        label="Website URL" 
        type="url"
        placeholder="https://example.com"
      />
      <Input 
        label="Age" 
        type="number"
        placeholder="25"
        min="0"
        max="120"
      />
      <Input 
        label="Search Query" 
        type="search"
        placeholder="Search products..."
        startIcon={<Search className="h-4 w-4" />}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Various input types with appropriate validation and formatting.'
      }
    }
  }
};

export const DisabledState: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input 
        label="Disabled Input" 
        placeholder="This input is disabled"
        disabled
      />
      <Input 
        label="Disabled with Value" 
        value="Cannot edit this"
        disabled
      />
      <Input 
        label="Disabled with Icon" 
        placeholder="Disabled with icon"
        startIcon={<User className="h-4 w-4" />}
        disabled
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Disabled inputs with proper visual feedback.'
      }
    }
  }
};

export const FormExample: Story = {
  render: () => (
    <div className="space-y-6 w-96 p-6 border rounded-lg">
      <h3 className="text-lg font-semibold">User Registration</h3>
      <div className="space-y-4">
        <Input 
          label="Full Name" 
          placeholder="John Doe"
          startIcon={<User className="h-4 w-4" />}
          required
        />
        <Input 
          label="Email Address" 
          type="email"
          placeholder="john@example.com"
          startIcon={<Mail className="h-4 w-4" />}
          required
        />
        <Input 
          label="Phone Number" 
          type="tel"
          placeholder="+1 (555) 123-4567"
          startIcon={<Phone className="h-4 w-4" />}
          helperText="We'll use this for account verification"
        />
        <Input 
          label="Password" 
          type="password"
          placeholder="Create a strong password"
          helperText="Must be at least 8 characters with numbers and symbols"
          required
        />
        <Input 
          label="Confirm Password" 
          type="password"
          placeholder="Confirm your password"
          required
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A complete form example showing various input configurations working together.'
      }
    }
  }
};

export const Interactive: Story = {
  args: {
    label: 'Interactive Input',
    placeholder: 'Type something...',
    helperText: 'This input responds to your typing',
    onChange: (e) => console.log('Input value:', e.target.value)
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive input that responds to user input. Check the console for onChange events.'
      }
    }
  }
};

export const CustomStyling: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input 
        label="Custom Border" 
        placeholder="Custom styling"
        className="border-2 border-primary focus:border-primary"
      />
      <Input 
        label="Custom Container" 
        placeholder="Custom container"
        containerClassName="bg-neutral-50 p-2 rounded-lg"
      />
      <Input 
        label="Custom Label" 
        placeholder="Custom label styling"
        labelClassName="text-primary font-bold"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Examples of custom styling using className props.'
      }
    }
  }
}; 