import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { ChevronRight, Download, Heart, Share, Plus, Settings, Search, Mail, Phone, ShoppingCart, Star, Trash2, Edit, Save, Upload, RefreshCw, ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component with multiple variants, sizes, and states. Supports icons, loading states, and accessibility features. Built with Figma design system colors.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'destructive', 'outline', 'ghost', 'link'],
      description: 'The visual variant of the button'
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'The size of the button'
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button'
    },
    loading: {
      control: 'boolean',
      description: 'Shows loading state with spinner'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button'
  }
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="primary">Primary (4Sale)</Button>
      <Button variant="secondary">Secondary (Q8car)</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different visual variants using the Figma color system. Primary uses 4Sale blue, Secondary uses Q8car teal.'
      }
    }
  }
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different sizes available for various use cases and layouts.'
      }
    }
  }
};

export const WithIcons: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button variant="secondary">
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
        <Button variant="ghost">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-4">
        <Button>
          Save
          <Save className="ml-2 h-4 w-4" />
        </Button>
        <Button variant="destructive">
          Delete
          <Trash2 className="ml-2 h-4 w-4" />
        </Button>
        <Button variant="outline">
          Edit
          <Edit className="ml-2 h-4 w-4" />
        </Button>
        <Button variant="link">
          Learn More
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Buttons with icons positioned before or after the text for better visual context.'
      }
    }
  }
};

export const IconOnly: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Button size="sm" aria-label="Add item">
          <Plus className="h-4 w-4" />
        </Button>
        <Button size="md" aria-label="Favorite">
          <Heart className="h-4 w-4" />
        </Button>
        <Button size="lg" aria-label="Share">
          <Share className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex gap-4">
        <Button variant="outline" size="sm" aria-label="Previous">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" aria-label="Next">
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" aria-label="Refresh">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Icon-only buttons for compact interfaces. Remember to include aria-label for accessibility.'
      }
    }
  }
};

export const LoadingStates: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button loading>Loading...</Button>
      <Button variant="secondary" loading>Processing</Button>
      <Button variant="outline" loading>Saving</Button>
      <Button variant="destructive" loading>Deleting</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Loading states with spinner animation. Buttons are automatically disabled when loading.'
      }
    }
  }
};

export const DisabledStates: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button disabled>Disabled Primary</Button>
      <Button variant="secondary" disabled>Disabled Secondary</Button>
      <Button variant="outline" disabled>Disabled Outline</Button>
      <Button variant="ghost" disabled>Disabled Ghost</Button>
      <Button variant="link" disabled>Disabled Link</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Disabled states for all button variants with proper visual feedback.'
      }
    }
  }
};

export const ActionButtons: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium mb-3">Primary Actions</h4>
        <div className="flex gap-3">
          <Button>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Download Now
          </Button>
          <Button>
            Get Started
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-3">Secondary Actions</h4>
        <div className="flex gap-3">
          <Button variant="secondary">
            <Mail className="mr-2 h-4 w-4" />
            Contact Us
          </Button>
          <Button variant="secondary">
            <Phone className="mr-2 h-4 w-4" />
            Call Now
          </Button>
          <Button variant="outline">
            Learn More
          </Button>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-3">Destructive Actions</h4>
        <div className="flex gap-3">
          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Account
          </Button>
          <Button variant="destructive">
            Remove Item
          </Button>
          <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
            Cancel Subscription
          </Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Common action buttons grouped by their semantic meaning and importance.'
      }
    }
  }
};

export const SocialButtons: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Button variant="outline">
          <Heart className="mr-2 h-4 w-4" />
          Like
        </Button>
        <Button variant="outline">
          <Share className="mr-2 h-4 w-4" />
          Share
        </Button>
        <Button variant="outline">
          <Star className="mr-2 h-4 w-4" />
          Favorite
        </Button>
      </div>
      
      <div className="flex gap-3">
        <Button variant="ghost" size="sm">
          <Heart className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Share className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Star className="h-4 w-4" />
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Social interaction buttons for likes, shares, and favorites.'
      }
    }
  }
};

export const ButtonGroups: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium mb-3">Segmented Control</h4>
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <Button variant="outline" className="rounded-r-none border-r-0">
            Day
          </Button>
          <Button variant="outline" className="rounded-none border-r-0">
            Week
          </Button>
          <Button variant="outline" className="rounded-none border-r-0">
            Month
          </Button>
          <Button variant="outline" className="rounded-l-none">
            Year
          </Button>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-3">Action Group</h4>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-3">Primary + Secondary</h4>
        <div className="flex gap-3">
          <Button>Save Changes</Button>
          <Button variant="outline">Cancel</Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Button groups and combinations for related actions.'
      }
    }
  }
};

export const ResponsiveButtons: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-md">
      <Button className="w-full">
        <Download className="mr-2 h-4 w-4" />
        Full Width Button
      </Button>
      
      <div className="flex gap-2">
        <Button className="flex-1">Save</Button>
        <Button variant="outline" className="flex-1">Cancel</Button>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <Button variant="outline" size="sm">Edit</Button>
        <Button variant="outline" size="sm">Share</Button>
        <Button variant="outline" size="sm">Delete</Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Responsive button layouts for different screen sizes and containers.'
      }
    }
  }
};

export const Interactive: Story = {
  args: {
    children: 'Click me!',
    onClick: () => alert('Button clicked!')
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive button that responds to click events. Check the console for events.'
      }
    }
  }
};

export const CustomStyling: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button className="bg-gradient-to-r from-primary to-secondary text-white">
        Gradient Button
      </Button>
      <Button className="bg-black text-white hover:bg-gray-800">
        Custom Black
      </Button>
      <Button className="rounded-full px-6">
        Rounded Button
      </Button>
      <Button className="rounded-none border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white">
        Custom Border
      </Button>
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