import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip, TooltipProvider } from './Tooltip';
import { Button } from '../../core/Button';
import { Info, HelpCircle, Settings, User, Heart } from 'lucide-react';
import React from 'react';

const meta: Meta<typeof Tooltip> = {
  title: 'Feedback/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A tooltip component that displays helpful information on hover or focus. Supports smart positioning and customizable delays.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
      description: 'The preferred side of the trigger to render against'
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
      description: 'The preferred alignment against the trigger'
    },
    delayDuration: {
      control: 'number',
      description: 'The duration from when the mouse enters until the tooltip opens'
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the tooltip is disabled'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip content="This is a helpful tooltip">
        <Button>Hover me</Button>
      </Tooltip>
    </TooltipProvider>
  )
};

export const Positions: Story = {
  render: () => (
    <TooltipProvider>
      <div className="grid grid-cols-2 gap-8 p-8">
        <Tooltip content="Tooltip on top" side="top">
          <Button>Top</Button>
        </Tooltip>
        <Tooltip content="Tooltip on right" side="right">
          <Button>Right</Button>
        </Tooltip>
        <Tooltip content="Tooltip on bottom" side="bottom">
          <Button>Bottom</Button>
        </Tooltip>
        <Tooltip content="Tooltip on left" side="left">
          <Button>Left</Button>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
};

export const Alignments: Story = {
  render: () => (
    <TooltipProvider>
      <div className="space-y-4 p-8">
        <div className="flex space-x-4">
          <Tooltip content="Start aligned tooltip" side="bottom" align="start">
            <Button>Start</Button>
          </Tooltip>
          <Tooltip content="Center aligned tooltip" side="bottom" align="center">
            <Button>Center</Button>
          </Tooltip>
          <Tooltip content="End aligned tooltip" side="bottom" align="end">
            <Button>End</Button>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
};

export const WithIcons: Story = {
  render: () => (
    <TooltipProvider>
      <div className="flex space-x-4">
        <Tooltip content="Get more information about this feature">
          <Button size="sm" variant="ghost">
            <Info className="h-4 w-4" />
          </Button>
        </Tooltip>
        <Tooltip content="Need help? Click for assistance">
          <Button size="sm" variant="ghost">
            <HelpCircle className="h-4 w-4" />
          </Button>
        </Tooltip>
        <Tooltip content="Open settings panel">
          <Button size="sm" variant="ghost">
            <Settings className="h-4 w-4" />
          </Button>
        </Tooltip>
        <Tooltip content="View user profile">
          <Button size="sm" variant="ghost">
            <User className="h-4 w-4" />
          </Button>
        </Tooltip>
        <Tooltip content="Add to favorites">
          <Button size="sm" variant="ghost">
            <Heart className="h-4 w-4" />
          </Button>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
};

export const RichContent: Story = {
  render: () => (
    <TooltipProvider>
      <div className="space-x-4">
        <Tooltip 
          content={
            <div className="space-y-1">
              <div className="font-semibold">Rich Tooltip</div>
              <div className="text-xs">This tooltip contains multiple lines of text and formatting.</div>
            </div>
          }
        >
          <Button>Rich Content</Button>
        </Tooltip>
        <Tooltip 
          content={
            <div className="space-y-2">
              <div className="font-medium">Keyboard Shortcut</div>
              <div className="flex items-center space-x-1 text-xs">
                <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl</kbd>
                <span>+</span>
                <kbd className="px-1 py-0.5 bg-muted rounded text-xs">S</kbd>
              </div>
            </div>
          }
        >
          <Button>Save Document</Button>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
};

export const CustomDelays: Story = {
  render: () => (
    <TooltipProvider>
      <div className="space-x-4">
        <Tooltip content="Fast tooltip (100ms delay)" delayDuration={100}>
          <Button>Fast</Button>
        </Tooltip>
        <Tooltip content="Normal tooltip (700ms delay)" delayDuration={700}>
          <Button>Normal</Button>
        </Tooltip>
        <Tooltip content="Slow tooltip (1500ms delay)" delayDuration={1500}>
          <Button>Slow</Button>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
};

export const DisabledTooltip: Story = {
  render: () => (
    <TooltipProvider>
      <div className="space-x-4">
        <Tooltip content="This tooltip is enabled">
          <Button>Enabled Tooltip</Button>
        </Tooltip>
        <Tooltip content="This tooltip is disabled" disabled>
          <Button>Disabled Tooltip</Button>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
};

export const FormExample: Story = {
  render: () => {
    const FormWithTooltipsDemo = () => {
      const [formData, setFormData] = React.useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

      return (
        <TooltipProvider>
          <form className="space-y-4 w-80">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <label className="block text-sm font-medium">Username</label>
                <Tooltip content="Username must be 3-20 characters long and contain only letters, numbers, and underscores">
                  <Info className="h-3 w-3 text-muted-foreground" />
                </Tooltip>
              </div>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-md"
                placeholder="Enter username"
              />
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-1">
                <label className="block text-sm font-medium">Email</label>
                <Tooltip content="We'll use this email for account verification and important notifications">
                  <Info className="h-3 w-3 text-muted-foreground" />
                </Tooltip>
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-md"
                placeholder="Enter email"
              />
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-1">
                <label className="block text-sm font-medium">Password</label>
                <Tooltip 
                  content={
                    <div className="space-y-1">
                      <div className="font-medium">Password Requirements:</div>
                      <ul className="text-xs space-y-0.5">
                        <li>• At least 8 characters</li>
                        <li>• One uppercase letter</li>
                        <li>• One lowercase letter</li>
                        <li>• One number</li>
                        <li>• One special character</li>
                      </ul>
                    </div>
                  }
                  side="right"
                >
                  <Info className="h-3 w-3 text-muted-foreground" />
                </Tooltip>
              </div>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-md"
                placeholder="Enter password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-md"
                placeholder="Confirm password"
              />
            </div>

            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>
        </TooltipProvider>
      );
    };

    return <FormWithTooltipsDemo />;
  }
};

export const InteractiveElements: Story = {
  render: () => (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex space-x-4">
          <Tooltip content="This is a link tooltip">
            <a href="#" className="text-primary hover:underline">
              Hover this link
            </a>
          </Tooltip>
          <Tooltip content="This input has a tooltip">
            <input 
              type="text" 
              placeholder="Focus me"
              className="px-3 py-2 border border-border rounded-md"
            />
          </Tooltip>
        </div>
        
        <div className="flex space-x-4">
          <Tooltip content="Checkbox tooltip">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" />
              <span>Check me</span>
            </label>
          </Tooltip>
          <Tooltip content="Radio button tooltip">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" name="demo" />
              <span>Select me</span>
            </label>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}; 