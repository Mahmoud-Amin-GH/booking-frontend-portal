import type { Meta, StoryObj } from '@storybook/react';
import { Navigation } from './Navigation';
import { Button } from '../../core/Button';
import { Badge } from '../../core/Badge';
import { Bell, Search, User, Settings, ShoppingCart, Heart, Menu, X } from 'lucide-react';
import React from 'react';

const meta: Meta<typeof Navigation> = {
  title: 'Navigation/Navigation',
  component: Navigation,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A comprehensive navigation component with logo, menu items, dropdowns, and mobile responsiveness. Supports various variants, sizes, and user actions.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'transparent', 'bordered'],
      description: 'The visual variant of the navigation'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the navigation'
    },
    sticky: {
      control: 'boolean',
      description: 'Makes the navigation sticky at the top'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleItems = [
  { label: 'Home', active: true, onClick: () => console.log('Home clicked') },
  { label: 'Products', onClick: () => console.log('Products clicked') },
  { label: 'Services', onClick: () => console.log('Services clicked') },
  { label: 'About', onClick: () => console.log('About clicked') },
  { label: 'Contact', onClick: () => console.log('Contact clicked') }
];

const dropdownItems = [
  { label: 'Dashboard', active: true, onClick: () => console.log('Dashboard clicked') },
  { 
    label: 'Products', 
    children: [
      { label: 'All Products', onClick: () => console.log('All Products clicked') },
      { label: 'Categories', onClick: () => console.log('Categories clicked') },
      { label: 'New Arrivals', badge: 'New', onClick: () => console.log('New Arrivals clicked') }
    ],
    onClick: () => console.log('Products clicked') 
  },
  { label: 'Orders', badge: 5, onClick: () => console.log('Orders clicked') },
  { label: 'Analytics', onClick: () => console.log('Analytics clicked') }
];

export const Default: Story = {
  render: () => {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    
    return (
      <Navigation
        logo={
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
              DS
            </div>
            <span className="font-bold text-lg">Design System</span>
          </div>
        }
        items={sampleItems}
        actions={
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          </div>
        }
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
      />
    );
  }
};

export const WithDropdowns: Story = {
  render: () => {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    
    return (
      <Navigation
        logo={
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center text-white font-bold">
              Q8
            </div>
            <span className="font-bold text-lg">Q8car</span>
          </div>
        }
        items={dropdownItems}
        actions={
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <ShoppingCart className="h-4 w-4" />
              <Badge size="sm" variant="destructive" className="ml-1">3</Badge>
            </Button>
            <Button variant="ghost" size="sm">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="primary" size="sm">
              Get Started
            </Button>
          </div>
        }
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
      />
    );
  }
};

export const Variants: Story = {
  render: () => {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Default Variant</h3>
          <Navigation
            variant="default"
            logo={<span className="font-bold">Default</span>}
            items={sampleItems.slice(0, 3)}
            actions={<Button variant="outline" size="sm">Action</Button>}
            mobileMenuOpen={mobileMenuOpen}
            onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Transparent Variant</h3>
          <div className="bg-gradient-to-r from-primary to-secondary p-4 rounded-lg">
            <Navigation
              variant="transparent"
              logo={<span className="font-bold text-white">Transparent</span>}
              items={sampleItems.slice(0, 3)}
              actions={<Button variant="outline" size="sm">Action</Button>}
              mobileMenuOpen={mobileMenuOpen}
              onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
            />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Bordered Variant</h3>
          <div className="p-4">
            <Navigation
              variant="bordered"
              logo={<span className="font-bold">Bordered</span>}
              items={sampleItems.slice(0, 3)}
              actions={<Button variant="outline" size="sm">Action</Button>}
              mobileMenuOpen={mobileMenuOpen}
              onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
            />
          </div>
        </div>
      </div>
    );
  }
};

export const Sizes: Story = {
  render: () => {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Small Size</h3>
          <Navigation
            size="sm"
            logo={<span className="font-bold">Small</span>}
            items={sampleItems.slice(0, 3)}
            actions={<Button variant="outline" size="sm">Action</Button>}
            mobileMenuOpen={mobileMenuOpen}
            onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Medium Size (Default)</h3>
          <Navigation
            size="md"
            logo={<span className="font-bold">Medium</span>}
            items={sampleItems.slice(0, 3)}
            actions={<Button variant="outline" size="sm">Action</Button>}
            mobileMenuOpen={mobileMenuOpen}
            onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Large Size</h3>
          <Navigation
            size="lg"
            logo={<span className="font-bold">Large</span>}
            items={sampleItems.slice(0, 3)}
            actions={<Button variant="outline" size="sm">Action</Button>}
            mobileMenuOpen={mobileMenuOpen}
            onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          />
        </div>
      </div>
    );
  }
};

export const EcommerceExample: Story = {
  render: () => {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    
    const ecommerceItems = [
      { label: 'Home', active: true, onClick: () => console.log('Home clicked') },
      { 
        label: 'Categories', 
        children: [
          { label: 'Electronics', onClick: () => console.log('Electronics clicked') },
          { label: 'Clothing', onClick: () => console.log('Clothing clicked') },
          { label: 'Home & Garden', onClick: () => console.log('Home & Garden clicked') },
          { label: 'Sports', onClick: () => console.log('Sports clicked') }
        ],
        onClick: () => console.log('Categories clicked') 
      },
      { label: 'Deals', badge: 'Hot', onClick: () => console.log('Deals clicked') },
      { label: 'About', onClick: () => console.log('About clicked') }
    ];
    
    return (
      <Navigation
        logo={
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold">
              E
            </div>
            <span className="font-bold text-lg">E-Shop</span>
          </div>
        }
        items={ecommerceItems}
        actions={
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Heart className="h-4 w-4" />
              <Badge size="sm" variant="destructive" className="ml-1">2</Badge>
            </Button>
            <Button variant="ghost" size="sm">
              <ShoppingCart className="h-4 w-4" />
              <Badge size="sm" variant="destructive" className="ml-1">5</Badge>
            </Button>
            <Button variant="primary" size="sm">
              Sign In
            </Button>
          </div>
        }
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
      />
    );
  }
};

export const DashboardExample: Story = {
  render: () => {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    
    const dashboardItems = [
      { label: 'Dashboard', active: true, onClick: () => console.log('Dashboard clicked') },
      { label: 'Analytics', onClick: () => console.log('Analytics clicked') },
      { label: 'Users', badge: 12, onClick: () => console.log('Users clicked') },
      { 
        label: 'Settings', 
        children: [
          { label: 'General', onClick: () => console.log('General clicked') },
          { label: 'Security', onClick: () => console.log('Security clicked') },
          { label: 'Billing', badge: '!', onClick: () => console.log('Billing clicked') },
          { label: 'Team', onClick: () => console.log('Team clicked') }
        ],
        onClick: () => console.log('Settings clicked') 
      }
    ];
    
    return (
      <Navigation
        logo={
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-success to-warning rounded-lg flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="font-bold text-lg">Admin Panel</span>
          </div>
        }
        items={dashboardItems}
        actions={
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
              <Badge size="sm" variant="destructive" className="ml-1">3</Badge>
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-2 pl-2 border-l border-border">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                JD
              </div>
              <span className="text-sm font-medium hidden md:block">John Doe</span>
            </div>
          </div>
        }
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
      />
    );
  }
};

export const StickyNavigation: Story = {
  render: () => {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    
    return (
      <div className="h-screen overflow-y-auto">
        <Navigation
          sticky
          logo={
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                S
              </div>
              <span className="font-bold text-lg">Sticky Nav</span>
            </div>
          }
          items={sampleItems}
          actions={
            <Button variant="primary" size="sm">
              Get Started
            </Button>
          }
          mobileMenuOpen={mobileMenuOpen}
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
        
        <div className="p-8 space-y-8">
          <div className="h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
            <h2 className="text-2xl font-bold">Scroll down to see sticky navigation</h2>
          </div>
          <div className="h-96 bg-gradient-to-br from-success/10 to-warning/10 rounded-lg flex items-center justify-center">
            <h2 className="text-2xl font-bold">Content Section 1</h2>
          </div>
          <div className="h-96 bg-gradient-to-br from-destructive/10 to-energy/10 rounded-lg flex items-center justify-center">
            <h2 className="text-2xl font-bold">Content Section 2</h2>
          </div>
          <div className="h-96 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-lg flex items-center justify-center">
            <h2 className="text-2xl font-bold">Content Section 3</h2>
          </div>
        </div>
      </div>
    );
  }
}; 