import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';
import { Button } from '../../core/Button';
import React from 'react';

const meta: Meta<typeof Checkbox> = {
  title: 'Form/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A checkbox input component with support for labels, descriptions, validation states, and indeterminate state. Fully accessible with keyboard navigation.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the checkbox is checked (controlled)'
    },
    indeterminate: {
      control: 'boolean',
      description: 'Whether the checkbox is in an indeterminate state'
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the checkbox is disabled'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the checkbox'
    },
    label: {
      control: 'text',
      description: 'Label text for the checkbox'
    },
    description: {
      control: 'text',
      description: 'Helper text displayed below the label'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Accept terms and conditions'
  }
};

export const Checked: Story = {
  args: {
    label: 'I agree to the terms',
    checked: true
  }
};

export const WithDescription: Story = {
  args: {
    label: 'Email notifications',
    description: 'Receive email updates about your account activity',
    defaultChecked: true
  }
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Checkbox size="sm" label="Small checkbox" />
      <Checkbox size="md" label="Medium checkbox" defaultChecked />
      <Checkbox size="lg" label="Large checkbox" />
    </div>
  )
};

export const States: Story = {
  render: () => (
    <div className="space-y-4">
      <Checkbox label="Default state" />
      <Checkbox label="Checked state" defaultChecked />
      <Checkbox label="Indeterminate state" indeterminate />
      <Checkbox label="Disabled state" disabled />
      <Checkbox label="Disabled checked" disabled defaultChecked />
    </div>
  )
};

export const Validation: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Checkbox 
        label="Terms and conditions" 
        description="You must accept the terms to continue"
        required
      />
      <Checkbox 
        label="Invalid checkbox" 
        error="You must accept the terms and conditions"
      />
      <Checkbox 
        label="Valid checkbox" 
        success="Terms accepted successfully"
        defaultChecked
      />
    </div>
  )
};

export const Controlled: Story = {
  render: () => {
    const ControlledDemo = () => {
      const [checked, setChecked] = React.useState(false);
      const [indeterminate, setIndeterminate] = React.useState(false);

      return (
        <div className="space-y-4">
          <Checkbox
            label="Controlled checkbox"
            description={`Current state: ${indeterminate ? 'indeterminate' : checked ? 'checked' : 'unchecked'}`}
            checked={checked}
            indeterminate={indeterminate}
            onCheckedChange={(newChecked) => {
              setChecked(newChecked);
              setIndeterminate(false);
            }}
          />
          
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                setChecked(true);
                setIndeterminate(false);
              }}
            >
              Check
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                setChecked(false);
                setIndeterminate(false);
              }}
            >
              Uncheck
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                setIndeterminate(true);
                setChecked(false);
              }}
            >
              Indeterminate
            </Button>
          </div>
        </div>
      );
    };

    return <ControlledDemo />;
  }
};

export const CheckboxGroup: Story = {
  render: () => {
    const CheckboxGroupDemo = () => {
      const [selectedItems, setSelectedItems] = React.useState<string[]>(['item2']);

      const items = [
        { id: 'item1', label: 'First item', description: 'This is the first option' },
        { id: 'item2', label: 'Second item', description: 'This is the second option' },
        { id: 'item3', label: 'Third item', description: 'This is the third option' },
        { id: 'item4', label: 'Fourth item', description: 'This option is disabled', disabled: true }
      ];

      const handleItemChange = (itemId: string, checked: boolean) => {
        setSelectedItems(prev => 
          checked 
            ? [...prev, itemId]
            : prev.filter(id => id !== itemId)
        );
      };

      const allSelected = items.filter(item => !item.disabled).every(item => selectedItems.includes(item.id));
      const someSelected = selectedItems.length > 0 && !allSelected;

      const handleSelectAll = (checked: boolean) => {
        if (checked) {
          setSelectedItems(items.filter(item => !item.disabled).map(item => item.id));
        } else {
          setSelectedItems([]);
        }
      };

      return (
        <div className="w-80 space-y-4">
          <Checkbox
            label="Select all"
            checked={allSelected}
            indeterminate={someSelected}
            onCheckedChange={handleSelectAll}
          />
          
          <div className="border-t pt-4 space-y-3">
            {items.map(item => (
              <Checkbox
                key={item.id}
                label={item.label}
                description={item.description}
                checked={selectedItems.includes(item.id)}
                disabled={item.disabled || false}
                onCheckedChange={(checked) => handleItemChange(item.id, checked)}
              />
            ))}
          </div>
          
          <div className="text-sm text-muted-foreground">
            Selected: {selectedItems.length} of {items.filter(item => !item.disabled).length}
          </div>
        </div>
      );
    };

    return <CheckboxGroupDemo />;
  }
};

export const FormExample: Story = {
  render: () => {
    const FormDemo = () => {
      const [formData, setFormData] = React.useState({
        newsletter: false,
        marketing: true,
        terms: false
      });

      const [errors, setErrors] = React.useState<Record<string, string>>({});

      const handleSubmit = () => {
        const newErrors: Record<string, string> = {};
        
        if (!formData.terms) {
          newErrors['terms'] = 'You must accept the terms and conditions';
        }
        
        setErrors(newErrors);
        
        if (Object.keys(newErrors).length === 0) {
          alert('Form submitted successfully!');
        }
      };

      return (
        <div className="w-80 space-y-4">
          <h3 className="font-medium">Notification Preferences</h3>
          
          <Checkbox
            label="Newsletter subscription"
            description="Receive our weekly newsletter with updates and tips"
            checked={formData.newsletter}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, newsletter: checked }))}
          />
          
          <Checkbox
            label="Marketing communications"
            description="Get notified about new features and special offers"
            checked={formData.marketing}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, marketing: checked }))}
          />
          
          <Checkbox
            label="Terms and conditions"
            description="I agree to the terms of service and privacy policy"
            required
            checked={formData.terms}
            onCheckedChange={(checked) => {
              setFormData(prev => ({ ...prev, terms: checked }));
              if (checked && errors['terms']) {
                setErrors(prev => ({ ...prev, terms: '' }));
              }
            }}
            {...(errors['terms'] && { error: errors['terms'] })}
          />
          
          <Button onClick={handleSubmit} className="w-full">
            Save Preferences
          </Button>
        </div>
      );
    };

    return <FormDemo />;
  }
}; 