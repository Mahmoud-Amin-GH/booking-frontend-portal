import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './Tabs';
import { Button } from '../../core/Button';
import { Card } from '../../data-display/Card';
import { Badge } from '../../core/Badge';
import { User, Settings, Bell, Shield, CreditCard, FileText, BarChart3, Users } from 'lucide-react';
import React from 'react';

const meta: Meta<typeof Tabs> = {
  title: 'Navigation/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A tabs component for organizing content into multiple panels. Supports different variants, sizes, orientations, and interactive features like badges and icons.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'pills', 'underline', 'bordered'],
      description: 'The visual style of the tabs'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the tabs'
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'The layout orientation of the tabs'
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether tabs should take full width'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

const basicTabs = [
  {
    id: 'tab1',
    label: 'Overview',
    content: (
      <div className="p-4">
        <h3 className="font-semibold mb-2">Overview</h3>
        <p className="text-muted-foreground">
          This is the overview tab content. Here you can see a summary of all important information.
        </p>
      </div>
    )
  },
  {
    id: 'tab2',
    label: 'Details',
    content: (
      <div className="p-4">
        <h3 className="font-semibold mb-2">Details</h3>
        <p className="text-muted-foreground">
          This tab contains detailed information about the selected item or topic.
        </p>
      </div>
    )
  },
  {
    id: 'tab3',
    label: 'Settings',
    content: (
      <div className="p-4">
        <h3 className="font-semibold mb-2">Settings</h3>
        <p className="text-muted-foreground">
          Configure your preferences and settings in this tab.
        </p>
      </div>
    )
  }
];

export const Default: Story = {
  args: {
    items: basicTabs,
    defaultValue: 'tab1'
  }
};

export const Variants: Story = {
  render: () => (
    <div className="w-full max-w-2xl space-y-8">
      <div>
        <h3 className="font-medium mb-4">Default</h3>
        <Tabs items={basicTabs} variant="default" defaultValue="tab1" />
      </div>
      
      <div>
        <h3 className="font-medium mb-4">Pills</h3>
        <Tabs items={basicTabs} variant="pills" defaultValue="tab1" />
      </div>
      
      <div>
        <h3 className="font-medium mb-4">Underline</h3>
        <Tabs items={basicTabs} variant="underline" defaultValue="tab1" />
      </div>
      
      <div>
        <h3 className="font-medium mb-4">Bordered</h3>
        <Tabs items={basicTabs} variant="bordered" defaultValue="tab1" />
      </div>
    </div>
  )
};

export const Sizes: Story = {
  render: () => (
    <div className="w-full max-w-2xl space-y-8">
      <div>
        <h3 className="font-medium mb-4">Small</h3>
        <Tabs items={basicTabs} size="sm" defaultValue="tab1" />
      </div>
      
      <div>
        <h3 className="font-medium mb-4">Medium</h3>
        <Tabs items={basicTabs} size="md" defaultValue="tab1" />
      </div>
      
      <div>
        <h3 className="font-medium mb-4">Large</h3>
        <Tabs items={basicTabs} size="lg" defaultValue="tab1" />
      </div>
    </div>
  )
};

export const WithIcons: Story = {
  args: {
    items: [
      {
        id: 'profile',
        label: 'Profile',
        icon: <User className="h-4 w-4" />,
        content: (
          <div className="p-4">
            <h3 className="font-semibold mb-2">Profile Settings</h3>
            <p className="text-muted-foreground">Manage your profile information and preferences.</p>
          </div>
        )
      },
      {
        id: 'notifications',
        label: 'Notifications',
        icon: <Bell className="h-4 w-4" />,
        content: (
          <div className="p-4">
            <h3 className="font-semibold mb-2">Notification Settings</h3>
            <p className="text-muted-foreground">Configure how you receive notifications.</p>
          </div>
        )
      },
      {
        id: 'security',
        label: 'Security',
        icon: <Shield className="h-4 w-4" />,
        content: (
          <div className="p-4">
            <h3 className="font-semibold mb-2">Security Settings</h3>
            <p className="text-muted-foreground">Manage your account security and privacy.</p>
          </div>
        )
      }
    ],
    variant: 'pills',
    defaultValue: 'profile'
  }
};

export const WithBadges: Story = {
  args: {
    items: [
      {
        id: 'inbox',
        label: 'Inbox',
        badge: 12,
        content: (
          <div className="p-4">
            <h3 className="font-semibold mb-2">Inbox</h3>
            <p className="text-muted-foreground">You have 12 unread messages.</p>
          </div>
        )
      },
      {
        id: 'drafts',
        label: 'Drafts',
        badge: 3,
        content: (
          <div className="p-4">
            <h3 className="font-semibold mb-2">Drafts</h3>
            <p className="text-muted-foreground">You have 3 draft messages.</p>
          </div>
        )
      },
      {
        id: 'sent',
        label: 'Sent',
        content: (
          <div className="p-4">
            <h3 className="font-semibold mb-2">Sent Messages</h3>
            <p className="text-muted-foreground">View your sent messages.</p>
          </div>
        )
      },
      {
        id: 'archive',
        label: 'Archive',
        badge: 'New',
        content: (
          <div className="p-4">
            <h3 className="font-semibold mb-2">Archive</h3>
            <p className="text-muted-foreground">Archived messages and conversations.</p>
          </div>
        )
      }
    ],
    variant: 'underline',
    defaultValue: 'inbox'
  }
};

export const VerticalTabs: Story = {
  args: {
    items: [
      {
        id: 'general',
        label: 'General',
        icon: <Settings className="h-4 w-4" />,
        content: (
          <Card className="p-6">
            <h3 className="font-semibold mb-4">General Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Display Name</label>
                <input className="w-full px-3 py-2 border rounded-md" defaultValue="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input className="w-full px-3 py-2 border rounded-md" defaultValue="john@example.com" />
              </div>
            </div>
          </Card>
        )
      },
      {
        id: 'billing',
        label: 'Billing',
        icon: <CreditCard className="h-4 w-4" />,
        content: (
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Billing Information</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Current Plan</span>
                <Badge>Pro</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Next Billing Date</span>
                <span className="text-muted-foreground">March 15, 2024</span>
              </div>
            </div>
          </Card>
        )
      },
      {
        id: 'team',
        label: 'Team',
        icon: <Users className="h-4 w-4" />,
        badge: 5,
        content: (
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Team Members</h3>
            <p className="text-muted-foreground">Manage your team members and their permissions.</p>
          </Card>
        )
      }
    ],
    orientation: 'vertical',
    variant: 'pills',
    defaultValue: 'general'
  }
};

export const DisabledTabs: Story = {
  args: {
    items: [
      {
        id: 'available1',
        label: 'Available',
        content: <div className="p-4">This tab is available.</div>
      },
      {
        id: 'disabled1',
        label: 'Disabled',
        disabled: true,
        content: <div className="p-4">This content won't be shown.</div>
      },
      {
        id: 'available2',
        label: 'Another Available',
        content: <div className="p-4">This tab is also available.</div>
      },
      {
        id: 'disabled2',
        label: 'Also Disabled',
        disabled: true,
        content: <div className="p-4">This content won't be shown either.</div>
      }
    ],
    defaultValue: 'available1'
  }
};

export const FullWidth: Story = {
  args: {
    items: basicTabs,
    fullWidth: true,
    variant: 'bordered',
    defaultValue: 'tab1'
  }
};

export const Controlled: Story = {
  render: () => {
    const ControlledDemo = () => {
      const [activeTab, setActiveTab] = React.useState('overview');

      const tabs = [
        {
          id: 'overview',
          label: 'Overview',
          content: (
            <div className="p-4">
              <h3 className="font-semibold mb-2">Overview</h3>
              <p className="text-muted-foreground">Current tab: {activeTab}</p>
            </div>
          )
        },
        {
          id: 'analytics',
          label: 'Analytics',
          icon: <BarChart3 className="h-4 w-4" />,
          content: (
            <div className="p-4">
              <h3 className="font-semibold mb-2">Analytics</h3>
              <p className="text-muted-foreground">View your analytics data here.</p>
            </div>
          )
        },
        {
          id: 'reports',
          label: 'Reports',
          icon: <FileText className="h-4 w-4" />,
          content: (
            <div className="p-4">
              <h3 className="font-semibold mb-2">Reports</h3>
              <p className="text-muted-foreground">Generate and view reports.</p>
            </div>
          )
        }
      ];

      return (
        <div className="w-full max-w-2xl space-y-4">
          <Tabs
            items={tabs}
            value={activeTab}
            onValueChange={setActiveTab}
            variant="underline"
          />
          
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setActiveTab('overview')}
            >
              Go to Overview
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setActiveTab('analytics')}
            >
              Go to Analytics
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setActiveTab('reports')}
            >
              Go to Reports
            </Button>
          </div>
        </div>
      );
    };

    return <ControlledDemo />;
  }
};

export const DashboardExample: Story = {
  render: () => {
    const DashboardDemo = () => {
      const [activeTab, setActiveTab] = React.useState('dashboard');

      const dashboardTabs = [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: <BarChart3 className="h-4 w-4" />,
          content: (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <Card className="p-4">
                <h4 className="font-medium mb-2">Total Users</h4>
                <p className="text-2xl font-bold">1,234</p>
                <p className="text-sm text-success">+12% from last month</p>
              </Card>
              <Card className="p-4">
                <h4 className="font-medium mb-2">Revenue</h4>
                <p className="text-2xl font-bold">$45,678</p>
                <p className="text-sm text-success">+8% from last month</p>
              </Card>
              <Card className="p-4">
                <h4 className="font-medium mb-2">Orders</h4>
                <p className="text-2xl font-bold">567</p>
                <p className="text-sm text-destructive">-3% from last month</p>
              </Card>
              <Card className="p-4">
                <h4 className="font-medium mb-2">Conversion Rate</h4>
                <p className="text-2xl font-bold">3.2%</p>
                <p className="text-sm text-success">+0.5% from last month</p>
              </Card>
            </div>
          )
        },
        {
          id: 'users',
          label: 'Users',
          icon: <Users className="h-4 w-4" />,
          badge: 12,
          content: (
            <div className="p-4">
              <h3 className="font-semibold mb-4">User Management</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-muted-foreground">john@example.com</p>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <p className="font-medium">Jane Smith</p>
                    <p className="text-sm text-muted-foreground">jane@example.com</p>
                  </div>
                  <Badge variant="warning">Pending</Badge>
                </div>
              </div>
            </div>
          )
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: <Settings className="h-4 w-4" />,
          content: (
            <div className="p-4">
              <h3 className="font-semibold mb-4">Application Settings</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Email Notifications</span>
                  <input type="checkbox" defaultChecked />
                </div>
                <div className="flex justify-between items-center">
                  <span>Auto-save</span>
                  <input type="checkbox" defaultChecked />
                </div>
                <div className="flex justify-between items-center">
                  <span>Dark Mode</span>
                  <input type="checkbox" />
                </div>
              </div>
            </div>
          )
        }
      ];

      return (
        <div className="w-full max-w-4xl">
          <Tabs
            items={dashboardTabs}
            value={activeTab}
            onValueChange={setActiveTab}
            variant="pills"
            size="md"
          />
        </div>
      );
    };

    return <DashboardDemo />;
  }
}; 