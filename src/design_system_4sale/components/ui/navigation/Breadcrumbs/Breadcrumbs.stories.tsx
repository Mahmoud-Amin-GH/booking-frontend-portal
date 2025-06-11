import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumbs } from './Breadcrumbs';
import { Home, Folder, FileText, Settings, User } from 'lucide-react';
import React from 'react';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Navigation/Breadcrumbs',
  component: Breadcrumbs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A breadcrumb navigation component that shows the current page location within a navigational hierarchy. Supports icons, custom separators, and different sizes.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the breadcrumbs'
    },
    separator: {
      control: 'text',
      description: 'Custom separator between breadcrumb items'
    },
    maxItems: {
      control: 'number',
      description: 'Maximum number of items to show before collapsing'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

const basicItems = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Electronics', href: '/products/electronics' },
  { label: 'Smartphones', href: '/products/electronics/smartphones' },
  { label: 'iPhone 15 Pro' }
];

export const Default: Story = {
  args: {
    items: basicItems
  }
};

export const WithIcons: Story = {
  args: {
    items: [
      { label: 'Home', href: '/', icon: <Home className="h-4 w-4" /> },
      { label: 'Documents', href: '/documents', icon: <Folder className="h-4 w-4" /> },
      { label: 'Projects', href: '/documents/projects', icon: <Folder className="h-4 w-4" /> },
      { label: 'Report.pdf', icon: <FileText className="h-4 w-4" /> }
    ]
  }
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-2">Small</h3>
        <Breadcrumbs items={basicItems} size="sm" />
      </div>
      <div>
        <h3 className="font-medium mb-2">Medium</h3>
        <Breadcrumbs items={basicItems} size="md" />
      </div>
      <div>
        <h3 className="font-medium mb-2">Large</h3>
        <Breadcrumbs items={basicItems} size="lg" />
      </div>
    </div>
  )
};

export const CustomSeparator: Story = {
  render: () => (
    <div className="space-y-4">
      <Breadcrumbs items={basicItems} separator=">" />
      <Breadcrumbs items={basicItems} separator="•" />
      <Breadcrumbs items={basicItems} separator="|" />
      <Breadcrumbs items={basicItems} separator="→" />
    </div>
  )
};

export const MaxItems: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Level 1', href: '/level1' },
      { label: 'Level 2', href: '/level1/level2' },
      { label: 'Level 3', href: '/level1/level2/level3' },
      { label: 'Level 4', href: '/level1/level2/level3/level4' },
      { label: 'Level 5', href: '/level1/level2/level3/level4/level5' },
      { label: 'Current Page' }
    ],
    maxItems: 4
  }
};

export const AdminPanel: Story = {
  args: {
    items: [
      { label: 'Dashboard', href: '/admin', icon: <Home className="h-4 w-4" /> },
      { label: 'Users', href: '/admin/users', icon: <User className="h-4 w-4" /> },
      { label: 'Settings', href: '/admin/users/settings', icon: <Settings className="h-4 w-4" /> },
      { label: 'Profile Settings' }
    ]
  }
};

export const FileSystem: Story = {
  args: {
    items: [
      { label: 'Root', href: '/', icon: <Home className="h-4 w-4" /> },
      { label: 'Users', href: '/users', icon: <Folder className="h-4 w-4" /> },
      { label: 'john.doe', href: '/users/john.doe', icon: <Folder className="h-4 w-4" /> },
      { label: 'Documents', href: '/users/john.doe/documents', icon: <Folder className="h-4 w-4" /> },
      { label: 'project-proposal.pdf', icon: <FileText className="h-4 w-4" /> }
    ],
    separator: "/"
  }
};

export const ECommerce: Story = {
  render: () => {
    const ECommerceDemo = () => {
      const [currentPath, setCurrentPath] = React.useState([
        { label: 'Home', href: '/' },
        { label: 'Electronics', href: '/electronics' },
        { label: 'Smartphones', href: '/electronics/smartphones' },
        { label: 'iPhone 15 Pro' }
      ]);

      const handleNavigation = (href: string) => {
        // Simulate navigation by updating breadcrumbs
        const pathSegments = href.split('/').filter(Boolean);
        const newPath = [{ label: 'Home', href: '/' }];
        
        pathSegments.forEach((segment, index) => {
          const href = '/' + pathSegments.slice(0, index + 1).join('/');
          const label = segment.charAt(0).toUpperCase() + segment.slice(1);
          newPath.push({ label, href });
        });
        
        setCurrentPath(newPath);
      };

      // Add onClick handlers to breadcrumb items
      const interactiveItems = currentPath.map((item, index) => {
        const result: any = { ...item };
        if (item.href && index < currentPath.length - 1) {
          result.onClick = () => handleNavigation(item.href!);
        }
        return result;
      });

      return (
        <div className="space-y-4">
          <Breadcrumbs items={interactiveItems} />
          
          <div className="text-sm text-muted-foreground">
            Click on any breadcrumb item to navigate
          </div>
          
          <div className="flex space-x-2">
            <button 
              className="px-3 py-1 text-xs bg-muted rounded"
              onClick={() => handleNavigation('/electronics/laptops')}
            >
              Go to Laptops
            </button>
            <button 
              className="px-3 py-1 text-xs bg-muted rounded"
              onClick={() => handleNavigation('/clothing/shoes/sneakers')}
            >
              Go to Sneakers
            </button>
            <button 
              className="px-3 py-1 text-xs bg-muted rounded"
              onClick={() => handleNavigation('/')}
            >
              Go Home
            </button>
          </div>
        </div>
      );
    };

    return <ECommerceDemo />;
  }
}; 