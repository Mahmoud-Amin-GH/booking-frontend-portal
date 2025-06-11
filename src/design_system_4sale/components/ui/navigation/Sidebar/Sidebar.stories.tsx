import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar } from './Sidebar';
import { Button } from '../../core/Button';
import { Badge } from '../../core/Badge';
import { 
  Home, 
  Users, 
  Settings, 
  FileText, 
  BarChart3, 
  Mail, 
  Calendar, 
  Folder,
  Search,
  Bell,
  Shield,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import React from 'react';

const meta: Meta<typeof Sidebar> = {
  title: 'Navigation/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A sidebar navigation component for organizing navigation links and content. Supports collapsible state, icons, badges, and different layouts.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    collapsed: {
      control: 'boolean',
      description: 'Whether the sidebar is collapsed'
    },
    position: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Position of the sidebar'
    },
    variant: {
      control: 'select',
      options: ['default', 'floating', 'bordered'],
      description: 'Visual style of the sidebar'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

const basicItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <Home className="h-5 w-5" />,
    href: '/dashboard'
  },
  {
    id: 'users',
    label: 'Users',
    icon: <Users className="h-5 w-5" />,
    href: '/users',
    badge: '12'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <BarChart3 className="h-5 w-5" />,
    href: '/analytics'
  },
  {
    id: 'documents',
    label: 'Documents',
    icon: <FileText className="h-5 w-5" />,
    href: '/documents'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="h-5 w-5" />,
    href: '/settings'
  }
];

export const Default: Story = {
  args: {
    items: basicItems,
    activeItem: 'dashboard'
  }
};

export const Collapsed: Story = {
  args: {
    items: basicItems,
    activeItem: 'users',
    collapsed: true
  }
};

export const WithSections: Story = {
  args: {
    sections: [
      {
        title: 'Main',
        items: [
          {
            id: 'dashboard',
            label: 'Dashboard',
            icon: <Home className="h-5 w-5" />,
            href: '/dashboard'
          },
          {
            id: 'search',
            label: 'Search',
            icon: <Search className="h-5 w-5" />,
            href: '/search'
          }
        ]
      },
      {
        title: 'Management',
        items: [
          {
            id: 'users',
            label: 'Users',
            icon: <Users className="h-5 w-5" />,
            href: '/users',
            badge: '12'
          },
          {
            id: 'documents',
            label: 'Documents',
            icon: <FileText className="h-5 w-5" />,
            href: '/documents',
            badge: 'New'
          }
        ]
      },
      {
        title: 'System',
        items: [
          {
            id: 'settings',
            label: 'Settings',
            icon: <Settings className="h-5 w-5" />,
            href: '/settings'
          },
          {
            id: 'help',
            label: 'Help',
            icon: <HelpCircle className="h-5 w-5" />,
            href: '/help'
          }
        ]
      }
    ],
    activeItem: 'users'
  }
};

export const Variants: Story = {
  render: () => {
    const [variant, setVariant] = React.useState<'default' | 'floating' | 'bordered'>('default');

    return (
      <div className="h-screen flex flex-col">
        <div className="p-4 border-b bg-background">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">Variant:</span>
            <select 
              value={variant} 
              onChange={(e) => setVariant(e.target.value as any)}
              className="px-3 py-1 border rounded text-sm"
            >
              <option value="default">Default</option>
              <option value="floating">Floating</option>
              <option value="bordered">Bordered</option>
            </select>
          </div>
        </div>
        
        <div className="flex-1 flex">
          <Sidebar
            items={basicItems}
            activeItem="dashboard"
            variant={variant}
          />
          <div className="flex-1 p-6 bg-muted/20">
            <h2 className="text-2xl font-bold mb-4">Main Content</h2>
            <p className="text-muted-foreground">
              This is the main content area. The sidebar variant is currently set to "{variant}".
            </p>
          </div>
        </div>
      </div>
    );
  }
};

export const Controlled: Story = {
  render: () => {
    const ControlledDemo = () => {
      const [collapsed, setCollapsed] = React.useState(false);
      const [activeItem, setActiveItem] = React.useState('dashboard');

      const items = [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: <Home className="h-5 w-5" />,
          href: '/dashboard'
        },
        {
          id: 'mail',
          label: 'Mail',
          icon: <Mail className="h-5 w-5" />,
          href: '/mail',
          badge: '5'
        },
        {
          id: 'calendar',
          label: 'Calendar',
          icon: <Calendar className="h-5 w-5" />,
          href: '/calendar'
        },
        {
          id: 'files',
          label: 'Files',
          icon: <Folder className="h-5 w-5" />,
          href: '/files'
        },
        {
          id: 'notifications',
          label: 'Notifications',
          icon: <Bell className="h-5 w-5" />,
          href: '/notifications',
          badge: '3'
        }
      ];

      return (
        <div className="h-screen flex">
          <Sidebar
            items={items}
            activeItem={activeItem}
            collapsed={collapsed}
            onItemClick={(itemId) => setActiveItem(itemId)}
            onToggleCollapse={() => setCollapsed(!collapsed)}
          />
          
          <div className="flex-1 flex flex-col">
            <header className="p-4 border-b bg-background flex items-center justify-between">
              <h1 className="text-xl font-semibold">
                {items.find(item => item.id === activeItem)?.label || 'Dashboard'}
              </h1>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCollapsed(!collapsed)}
                >
                  {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                  {collapsed ? 'Expand' : 'Collapse'}
                </Button>
              </div>
            </header>
            
            <main className="flex-1 p-6 bg-muted/20">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold mb-4">
                  {items.find(item => item.id === activeItem)?.label}
                </h2>
                <p className="text-muted-foreground mb-4">
                  This is the content for the {items.find(item => item.id === activeItem)?.label} page.
                  The sidebar is currently {collapsed ? 'collapsed' : 'expanded'}.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        item.id === activeItem 
                          ? 'bg-primary/10 border-primary' 
                          : 'bg-background hover:bg-muted'
                      }`}
                      onClick={() => setActiveItem(item.id)}
                    >
                      <div className="flex items-center space-x-3">
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                        {item.badge && (
                          <Badge size="sm" variant="secondary">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </main>
          </div>
        </div>
      );
    };

    return <ControlledDemo />;
  }
};

export const AdminDashboard: Story = {
  render: () => {
    const AdminDemo = () => {
      const [activeItem, setActiveItem] = React.useState('overview');
      const [collapsed, setCollapsed] = React.useState(false);

      const sections = [
        {
          title: 'Overview',
          items: [
            {
              id: 'overview',
              label: 'Overview',
              icon: <Home className="h-5 w-5" />,
              href: '/admin'
            },
            {
              id: 'analytics',
              label: 'Analytics',
              icon: <BarChart3 className="h-5 w-5" />,
              href: '/admin/analytics'
            }
          ]
        },
        {
          title: 'User Management',
          items: [
            {
              id: 'users',
              label: 'All Users',
              icon: <Users className="h-5 w-5" />,
              href: '/admin/users',
              badge: '1,234'
            },
            {
              id: 'roles',
              label: 'Roles & Permissions',
              icon: <Shield className="h-5 w-5" />,
              href: '/admin/roles'
            }
          ]
        },
        {
          title: 'Content',
          items: [
            {
              id: 'documents',
              label: 'Documents',
              icon: <FileText className="h-5 w-5" />,
              href: '/admin/documents',
              badge: 'New'
            },
            {
              id: 'media',
              label: 'Media Library',
              icon: <Folder className="h-5 w-5" />,
              href: '/admin/media'
            }
          ]
        },
        {
          title: 'System',
          items: [
            {
              id: 'billing',
              label: 'Billing',
              icon: <CreditCard className="h-5 w-5" />,
              href: '/admin/billing'
            },
            {
              id: 'settings',
              label: 'Settings',
              icon: <Settings className="h-5 w-5" />,
              href: '/admin/settings'
            }
          ]
        }
      ];

      const footerItems = [
        {
          id: 'help',
          label: 'Help & Support',
          icon: <HelpCircle className="h-5 w-5" />,
          href: '/help'
        },
        {
          id: 'logout',
          label: 'Logout',
          icon: <LogOut className="h-5 w-5" />,
          href: '/logout'
        }
      ];

      return (
        <div className="h-screen flex">
          <Sidebar
            sections={sections}
            footerItems={footerItems}
            activeItem={activeItem}
            collapsed={collapsed}
            onItemClick={(itemId) => setActiveItem(itemId)}
            onToggleCollapse={() => setCollapsed(!collapsed)}
            variant="bordered"
          />
          
          <div className="flex-1 flex flex-col">
            <header className="p-4 border-b bg-background">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-semibold">Admin Dashboard</h1>
                  <p className="text-sm text-muted-foreground">
                    Manage your application settings and users
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCollapsed(!collapsed)}
                  >
                    {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </header>
            
            <main className="flex-1 p-6 bg-muted/20 overflow-auto">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-background p-6 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                        <p className="text-2xl font-bold">1,234</p>
                      </div>
                      <Users className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-success mt-2">+12% from last month</p>
                  </div>
                  
                  <div className="bg-background p-6 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Documents</p>
                        <p className="text-2xl font-bold">567</p>
                      </div>
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-success mt-2">+8% from last month</p>
                  </div>
                  
                  <div className="bg-background p-6 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                        <p className="text-2xl font-bold">$12,345</p>
                      </div>
                      <CreditCard className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-destructive mt-2">-3% from last month</p>
                  </div>
                  
                  <div className="bg-background p-6 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Active Sessions</p>
                        <p className="text-2xl font-bold">89</p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-success mt-2">+5% from last hour</p>
                  </div>
                </div>
                
                <div className="bg-background p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span>New user registered: john.doe@example.com</span>
                      <span className="text-muted-foreground ml-auto">2 minutes ago</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Document uploaded: project-proposal.pdf</span>
                      <span className="text-muted-foreground ml-auto">5 minutes ago</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-warning rounded-full"></div>
                      <span>System backup completed</span>
                      <span className="text-muted-foreground ml-auto">1 hour ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      );
    };

    return <AdminDemo />;
  }
}; 