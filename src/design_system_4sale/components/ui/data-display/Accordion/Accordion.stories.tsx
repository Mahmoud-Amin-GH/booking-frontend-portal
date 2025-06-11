import type { Meta, StoryObj } from '@storybook/react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent, SimpleAccordion } from './Accordion';
import { Button } from '../../core/Button';
import { Badge } from '../../core/Badge';
import { Input } from '../../forms/Input';
import { ChevronRight, Star, Settings, User, HelpCircle, FileText, Image, Video } from 'lucide-react';
import React from 'react';

const meta: Meta<typeof Accordion> = {
  title: 'Interactive/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A collapsible content component that allows users to toggle the visibility of sections. Supports single and multiple selection modes with smooth animations.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['single', 'multiple'],
      description: 'Whether only one or multiple items can be open at once'
    },
    collapsible: {
      control: 'boolean',
      description: 'Whether items can be collapsed when in single mode'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-96">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>What is React?</AccordionTrigger>
          <AccordionContent>
            React is a JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called "components".
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>What is TypeScript?</AccordionTrigger>
          <AccordionContent>
            TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>What is Tailwind CSS?</AccordionTrigger>
          <AccordionContent>
            Tailwind CSS is a utility-first CSS framework packed with classes that can be composed to build any design, directly in your markup.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
};

export const Multiple: Story = {
  render: () => (
    <div className="w-96">
      <Accordion type="multiple" defaultValue={['features', 'pricing']}>
        <AccordionItem value="features">
          <AccordionTrigger>Features</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-warning" />
                <span>Premium features included</span>
              </div>
              <div className="flex items-center space-x-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span>Customizable settings</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-primary" />
                <span>User management</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="pricing">
          <AccordionTrigger>Pricing</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Basic Plan</span>
                <Badge variant="outline">$9/month</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Pro Plan</span>
                <Badge variant="secondary">$19/month</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Enterprise</span>
                <Badge>Custom</Badge>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="support">
          <AccordionTrigger>Support</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                We offer 24/7 support for all our customers.
              </p>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  Contact Support
                </Button>
                <Button size="sm" variant="ghost">
                  View Documentation
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
};

export const WithIcons: Story = {
  render: () => (
    <div className="w-96">
      <Accordion type="single" collapsible>
        <AccordionItem value="account">
          <AccordionTrigger>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Account Settings</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <Input placeholder="Display name" />
              <Input type="email" placeholder="Email address" />
              <Button size="sm">Save Changes</Button>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="preferences">
          <AccordionTrigger>
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Preferences</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked />
                <span className="text-sm">Email notifications</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" />
                <span className="text-sm">SMS notifications</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked />
                <span className="text-sm">Marketing emails</span>
              </label>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="help">
          <AccordionTrigger>
            <div className="flex items-center space-x-2">
              <HelpCircle className="h-4 w-4" />
              <span>Help & Support</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <a href="#" className="flex items-center space-x-2 text-sm hover:text-primary">
                <ChevronRight className="h-3 w-3" />
                <span>Frequently Asked Questions</span>
              </a>
              <a href="#" className="flex items-center space-x-2 text-sm hover:text-primary">
                <ChevronRight className="h-3 w-3" />
                <span>Contact Support</span>
              </a>
              <a href="#" className="flex items-center space-x-2 text-sm hover:text-primary">
                <ChevronRight className="h-3 w-3" />
                <span>Documentation</span>
              </a>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
};

export const Controlled: Story = {
  render: () => {
    const ControlledDemo = () => {
      const [value, setValue] = React.useState<string>('item-1');

      const handleValueChange = (newValue: string | string[] | undefined) => {
        if (typeof newValue === 'string' || newValue === undefined) {
          setValue(newValue || '');
        }
      };

      return (
        <div className="w-96 space-y-4">
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant={value === 'item-1' ? 'primary' : 'outline'}
              onClick={() => setValue('item-1')}
            >
              Open Item 1
            </Button>
            <Button 
              size="sm" 
              variant={value === 'item-2' ? 'primary' : 'outline'}
              onClick={() => setValue('item-2')}
            >
              Open Item 2
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => setValue('')}
            >
              Close All
            </Button>
          </div>
          
          <Accordion type="single" value={value} onValueChange={handleValueChange}>
            <AccordionItem value="item-1">
              <AccordionTrigger>Controlled Item 1</AccordionTrigger>
              <AccordionContent>
                This accordion is controlled by external buttons. The current value is: {value || 'none'}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Controlled Item 2</AccordionTrigger>
              <AccordionContent>
                You can control this accordion programmatically using the buttons above.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      );
    };

    return <ControlledDemo />;
  }
};

export const DisabledItems: Story = {
  render: () => (
    <div className="w-96">
      <Accordion type="single" collapsible>
        <AccordionItem value="available">
          <AccordionTrigger>Available Feature</AccordionTrigger>
          <AccordionContent>
            This feature is available and can be accessed by all users.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="disabled" disabled>
          <AccordionTrigger>Disabled Feature</AccordionTrigger>
          <AccordionContent>
            This content won't be shown because the item is disabled.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="premium">
          <AccordionTrigger>
            <div className="flex items-center justify-between w-full">
              <span>Premium Feature</span>
              <Badge variant="warning" className="mr-2">Pro</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            This feature is available for premium users only.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
};

export const SimpleAccordionExample: Story = {
  render: () => {
    const items = [
      {
        value: 'getting-started',
        title: 'Getting Started',
        content: (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Welcome to our platform! Here's how to get started:
            </p>
            <ol className="text-sm space-y-1 ml-4">
              <li>1. Create your account</li>
              <li>2. Verify your email</li>
              <li>3. Complete your profile</li>
              <li>4. Start exploring!</li>
            </ol>
          </div>
        )
      },
      {
        value: 'features',
        title: 'Key Features',
        content: (
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm">Document Management</span>
            </div>
            <div className="flex items-center space-x-2">
              <Image className="h-4 w-4 text-success" />
              <span className="text-sm">Image Processing</span>
            </div>
            <div className="flex items-center space-x-2">
              <Video className="h-4 w-4 text-warning" />
              <span className="text-sm">Video Streaming</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-secondary" />
              <span className="text-sm">User Analytics</span>
            </div>
          </div>
        )
      },
      {
        value: 'pricing',
        title: 'Pricing Plans',
        content: (
          <div className="space-y-3">
            <div className="border border-border rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Starter</h4>
                <span className="text-lg font-bold">$9</span>
              </div>
              <p className="text-xs text-muted-foreground">Perfect for individuals</p>
            </div>
            <div className="border border-border rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Professional</h4>
                <span className="text-lg font-bold">$29</span>
              </div>
              <p className="text-xs text-muted-foreground">Great for small teams</p>
            </div>
          </div>
        )
      }
    ];

    return (
      <div className="w-96">
        <SimpleAccordion 
          type="single" 
          collapsible 
          defaultValue="getting-started"
          items={items}
        />
      </div>
    );
  }
};

export const NestedContent: Story = {
  render: () => (
    <div className="w-96">
      <Accordion type="single" collapsible>
        <AccordionItem value="documentation">
          <AccordionTrigger>Documentation</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Comprehensive guides and API references
              </p>
              
              <Accordion type="single" collapsible className="border-l-2 border-muted pl-4">
                <AccordionItem value="api">
                  <AccordionTrigger className="text-sm">API Reference</AccordionTrigger>
                  <AccordionContent>
                    <div className="text-sm space-y-1">
                      <div>• Authentication</div>
                      <div>• Endpoints</div>
                      <div>• Rate Limiting</div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="guides">
                  <AccordionTrigger className="text-sm">Guides</AccordionTrigger>
                  <AccordionContent>
                    <div className="text-sm space-y-1">
                      <div>• Quick Start</div>
                      <div>• Best Practices</div>
                      <div>• Troubleshooting</div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="examples">
          <AccordionTrigger>Code Examples</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="bg-muted rounded p-2 text-xs font-mono">
                <div>import &#123; Accordion &#125; from '@company/design-system';</div>
                <div className="mt-1">// Your code here</div>
              </div>
              <Button size="sm" variant="outline" className="w-full">
                View More Examples
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}; 