import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';
import { Star, Heart, CheckCircle, AlertTriangle, Info, X, Zap, Shield, Crown, Flame } from 'lucide-react';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile badge component for displaying status, labels, and notifications. Supports various variants, sizes, icons, and dismissible functionality with accessibility features.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'success', 'warning', 'outline'],
      description: 'The visual variant of the badge'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the badge'
    },
    dismissible: {
      control: 'boolean',
      description: 'Makes the badge dismissible with a close button'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Badge'
  }
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different visual variants of the badge component using the Figma color system.'
      }
    }
  }
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different sizes available for the badge component.'
      }
    }
  }
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge icon={<Star className="h-3 w-3" />}>Featured</Badge>
      <Badge variant="success" icon={<CheckCircle className="h-3 w-3" />}>Verified</Badge>
      <Badge variant="warning" icon={<AlertTriangle className="h-3 w-3" />}>Warning</Badge>
      <Badge variant="destructive" icon={<X className="h-3 w-3" />}>Error</Badge>
      <Badge variant="secondary" icon={<Info className="h-3 w-3" />}>Info</Badge>
      <Badge variant="outline" icon={<Heart className="h-3 w-3" />}>Favorite</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badges with icons for better visual context and meaning.'
      }
    }
  }
};

export const Dismissible: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge dismissible onDismiss={() => alert('Default badge dismissed!')}>
        Dismissible
      </Badge>
      <Badge variant="success" dismissible onDismiss={() => alert('Success badge dismissed!')}>
        Success
      </Badge>
      <Badge variant="warning" dismissible onDismiss={() => alert('Warning badge dismissed!')}>
        Warning
      </Badge>
      <Badge variant="destructive" dismissible onDismiss={() => alert('Error badge dismissed!')}>
        Error
      </Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Dismissible badges with close functionality. Click the X to dismiss.'
      }
    }
  }
};

export const IconAndDismissible: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge 
        icon={<Star className="h-3 w-3" />}
        dismissible 
        onDismiss={() => alert('Featured badge dismissed!')}
      >
        Featured
      </Badge>
      <Badge 
        variant="success"
        icon={<CheckCircle className="h-3 w-3" />}
        dismissible 
        onDismiss={() => alert('Verified badge dismissed!')}
      >
        Verified
      </Badge>
      <Badge 
        variant="warning"
        icon={<Zap className="h-3 w-3" />}
        dismissible 
        onDismiss={() => alert('Premium badge dismissed!')}
      >
        Premium
      </Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badges with both icons and dismissible functionality.'
      }
    }
  }
};

export const StatusBadges: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-2">User Status</h4>
        <div className="flex gap-2">
          <Badge variant="success" icon={<CheckCircle className="h-3 w-3" />}>Online</Badge>
          <Badge variant="warning" icon={<AlertTriangle className="h-3 w-3" />}>Away</Badge>
          <Badge variant="destructive">Offline</Badge>
          <Badge variant="secondary">Busy</Badge>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-2">Order Status</h4>
        <div className="flex gap-2">
          <Badge variant="secondary">Pending</Badge>
          <Badge variant="warning">Processing</Badge>
          <Badge variant="success">Shipped</Badge>
          <Badge variant="default">Delivered</Badge>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-2">Priority Levels</h4>
        <div className="flex gap-2">
          <Badge variant="destructive" icon={<Flame className="h-3 w-3" />}>Critical</Badge>
          <Badge variant="warning">High</Badge>
          <Badge variant="secondary">Medium</Badge>
          <Badge variant="outline">Low</Badge>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Examples of badges used for different status indicators.'
      }
    }
  }
};

export const NotificationBadges: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-2">Notification Counts</h4>
        <div className="flex gap-4">
          <div className="relative">
            <button className="p-2 bg-muted rounded-lg">
              <Heart className="h-5 w-5" />
            </button>
            <Badge size="sm" className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center p-0">
              3
            </Badge>
          </div>
          
          <div className="relative">
            <button className="p-2 bg-muted rounded-lg">
              <Star className="h-5 w-5" />
            </button>
            <Badge variant="destructive" size="sm" className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center p-0">
              99+
            </Badge>
          </div>
          
          <div className="relative">
            <button className="p-2 bg-muted rounded-lg">
              <Info className="h-5 w-5" />
            </button>
            <Badge variant="success" size="sm" className="absolute -top-1 -right-1 w-3 h-3 p-0 border-2 border-background">
            </Badge>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badges used as notification indicators on buttons and icons.'
      }
    }
  }
};

export const CategoryTags: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-2">Skills</h4>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">React</Badge>
          <Badge variant="secondary">TypeScript</Badge>
          <Badge variant="secondary">Node.js</Badge>
          <Badge variant="secondary">Python</Badge>
          <Badge variant="secondary">GraphQL</Badge>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-2">Product Categories</h4>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">Electronics</Badge>
          <Badge variant="outline">Clothing</Badge>
          <Badge variant="outline">Books</Badge>
          <Badge variant="outline">Home & Garden</Badge>
          <Badge variant="outline">Sports</Badge>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-2">Article Tags</h4>
        <div className="flex flex-wrap gap-2">
          <Badge>Technology</Badge>
          <Badge>Design</Badge>
          <Badge>Development</Badge>
          <Badge>Tutorial</Badge>
          <Badge>Best Practices</Badge>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badges used as category tags and labels.'
      }
    }
  }
};

export const SpecialBadges: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-2">Premium Features</h4>
        <div className="flex flex-wrap gap-2">
          <Badge variant="warning" icon={<Crown className="h-3 w-3" />}>Premium</Badge>
          <Badge variant="success" icon={<Shield className="h-3 w-3" />}>Verified</Badge>
          <Badge variant="destructive" icon={<Flame className="h-3 w-3" />}>Hot</Badge>
          <Badge icon={<Zap className="h-3 w-3" />}>Pro</Badge>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-2">Limited Time</h4>
        <div className="flex flex-wrap gap-2">
          <Badge variant="destructive" dismissible onDismiss={() => alert('Sale ended!')}>
            50% OFF
          </Badge>
          <Badge variant="warning" dismissible onDismiss={() => alert('Offer expired!')}>
            Limited Time
          </Badge>
          <Badge variant="success" dismissible onDismiss={() => alert('Deal closed!')}>
            Best Deal
          </Badge>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Special badges for promotions, features, and time-sensitive content.'
      }
    }
  }
};

export const Interactive: Story = {
  args: {
    children: 'Click me!',
    onClick: () => alert('Badge clicked!'),
    className: 'cursor-pointer hover:opacity-80 transition-opacity'
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive badge that responds to click events.'
      }
    }
  }
};

export const CustomStyling: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge className="bg-gradient-to-r from-primary to-secondary text-white">
        Gradient
      </Badge>
      <Badge className="bg-black text-white">
        Custom Black
      </Badge>
      <Badge className="border-2 border-primary text-primary bg-transparent">
        Custom Border
      </Badge>
      <Badge className="rounded-none bg-muted text-foreground">
        Square
      </Badge>
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