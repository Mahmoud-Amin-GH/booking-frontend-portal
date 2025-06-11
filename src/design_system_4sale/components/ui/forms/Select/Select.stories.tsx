import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';
import { User, Globe, Star, Heart, ShoppingCart, Settings } from 'lucide-react';
import React from 'react';

const meta: Meta<typeof Select> = {
  title: 'Form/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A comprehensive select/dropdown component with single and multi-select capabilities, search functionality, and accessibility features.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the select component'
    },
    multiple: {
      control: 'boolean',
      description: 'Enable multi-select functionality'
    },
    searchable: {
      control: 'boolean',
      description: 'Enable search functionality'
    },
    clearable: {
      control: 'boolean',
      description: 'Show clear button when value is selected'
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the select component'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

const basicOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry' }
];

const countryOptions = [
  { value: 'us', label: 'United States', icon: <Globe className="h-4 w-4" /> },
  { value: 'uk', label: 'United Kingdom', icon: <Globe className="h-4 w-4" /> },
  { value: 'ca', label: 'Canada', icon: <Globe className="h-4 w-4" /> },
  { value: 'au', label: 'Australia', icon: <Globe className="h-4 w-4" /> },
  { value: 'de', label: 'Germany', icon: <Globe className="h-4 w-4" /> }
];

const userOptions = [
  { 
    value: 'john', 
    label: 'John Doe', 
    description: 'Software Engineer',
    icon: <User className="h-4 w-4" />
  },
  { 
    value: 'jane', 
    label: 'Jane Smith', 
    description: 'Product Manager',
    icon: <User className="h-4 w-4" />
  },
  { 
    value: 'bob', 
    label: 'Bob Johnson', 
    description: 'Designer',
    icon: <User className="h-4 w-4" />
  },
  { 
    value: 'alice', 
    label: 'Alice Brown', 
    description: 'Marketing Specialist',
    icon: <User className="h-4 w-4" />
  }
];

const categoryOptions = [
  { value: 'electronics', label: 'Electronics', icon: <Settings className="h-4 w-4" /> },
  { value: 'clothing', label: 'Clothing', icon: <Heart className="h-4 w-4" /> },
  { value: 'books', label: 'Books', icon: <Star className="h-4 w-4" /> },
  { value: 'home', label: 'Home & Garden', icon: <ShoppingCart className="h-4 w-4" /> },
  { value: 'sports', label: 'Sports & Outdoors', icon: <Star className="h-4 w-4" /> },
  { value: 'toys', label: 'Toys & Games', icon: <Heart className="h-4 w-4" /> }
];

export const Default: Story = {
  args: {
    options: basicOptions,
    placeholder: 'Select a fruit...',
    label: 'Favorite Fruit'
  }
};

export const WithIcons: Story = {
  args: {
    options: countryOptions,
    placeholder: 'Select a country...',
    label: 'Country',
    helperText: 'Choose your country of residence'
  }
};

export const WithDescriptions: Story = {
  args: {
    options: userOptions,
    placeholder: 'Select a user...',
    label: 'Assign to User',
    helperText: 'Select a team member to assign this task'
  }
};

export const Searchable: Story = {
  args: {
    options: categoryOptions,
    placeholder: 'Search categories...',
    label: 'Product Category',
    searchable: true,
    helperText: 'Type to search through categories'
  }
};

export const MultiSelect: Story = {
  args: {
    options: basicOptions,
    placeholder: 'Select fruits...',
    label: 'Favorite Fruits',
    multiple: true,
    helperText: 'You can select multiple fruits'
  }
};

export const MultiSelectWithSearch: Story = {
  args: {
    options: categoryOptions,
    placeholder: 'Select categories...',
    label: 'Product Categories',
    multiple: true,
    searchable: true,
    clearable: true,
    helperText: 'Search and select multiple categories'
  }
};

export const Clearable: Story = {
  args: {
    options: basicOptions,
    placeholder: 'Select a fruit...',
    label: 'Favorite Fruit',
    clearable: true,
    defaultValue: 'apple',
    helperText: 'Click the X to clear selection'
  }
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-6 w-80">
      <Select
        options={basicOptions}
        placeholder="Small select..."
        label="Small Size"
        size="sm"
      />
      <Select
        options={basicOptions}
        placeholder="Medium select..."
        label="Medium Size (Default)"
        size="md"
      />
      <Select
        options={basicOptions}
        placeholder="Large select..."
        label="Large Size"
        size="lg"
      />
    </div>
  )
};

export const States: Story = {
  render: () => (
    <div className="space-y-6 w-80">
      <Select
        options={basicOptions}
        placeholder="Normal state..."
        label="Normal"
        helperText="This is a normal select"
      />
      <Select
        options={basicOptions}
        placeholder="Success state..."
        label="Success"
        success="Great choice!"
        defaultValue="apple"
      />
      <Select
        options={basicOptions}
        placeholder="Error state..."
        label="Error"
        error="Please select a valid option"
      />
      <Select
        options={basicOptions}
        placeholder="Disabled state..."
        label="Disabled"
        disabled
        helperText="This select is disabled"
      />
    </div>
  )
};

export const WithDisabledOptions: Story = {
  args: {
    options: [
      { value: 'option1', label: 'Available Option 1' },
      { value: 'option2', label: 'Disabled Option', disabled: true },
      { value: 'option3', label: 'Available Option 2' },
      { value: 'option4', label: 'Another Disabled Option', disabled: true },
      { value: 'option5', label: 'Available Option 3' }
    ],
    placeholder: 'Select an option...',
    label: 'Options with Disabled Items',
    helperText: 'Some options are disabled and cannot be selected'
  }
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState<string>('');
    
    return (
      <div className="space-y-4 w-80">
        <Select
          options={basicOptions}
          placeholder="Select a fruit..."
          label="Controlled Select"
          value={value}
          onValueChange={(newValue) => setValue(newValue as string)}
          helperText={`Selected value: ${value || 'none'}`}
        />
        <div className="flex gap-2">
          <button
            onClick={() => setValue('apple')}
            className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm"
          >
            Set Apple
          </button>
          <button
            onClick={() => setValue('banana')}
            className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm"
          >
            Set Banana
          </button>
          <button
            onClick={() => setValue('')}
            className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm"
          >
            Clear
          </button>
        </div>
      </div>
    );
  }
};

export const MultiSelectControlled: Story = {
  render: () => {
    const [values, setValues] = React.useState<string[]>([]);
    
    return (
      <div className="space-y-4 w-80">
        <Select
          options={basicOptions}
          placeholder="Select fruits..."
          label="Controlled Multi-Select"
          multiple
          value={values}
          onValueChange={(newValues) => setValues(newValues as string[])}
          helperText={`Selected: ${values.length} items`}
        />
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setValues(['apple', 'banana'])}
            className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm"
          >
            Set Apple & Banana
          </button>
          <button
            onClick={() => setValues([])}
            className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm"
          >
            Clear All
          </button>
        </div>
      </div>
    );
  }
};

export const FormExample: Story = {
  render: () => {
    const [formData, setFormData] = React.useState({
      country: '',
      categories: [] as string[],
      assignee: '',
      priority: ''
    });
    
    return (
      <div className="space-y-6 w-96 p-6 border border-border rounded-lg">
        <h3 className="text-lg font-semibold">Project Settings</h3>
        
        <Select
          options={countryOptions}
          placeholder="Select country..."
          label="Country"
          value={formData.country}
          onValueChange={(value) => setFormData(prev => ({ ...prev, country: value as string }))}
          required
        />
        
        <Select
          options={categoryOptions}
          placeholder="Select categories..."
          label="Categories"
          multiple
          searchable
          clearable
          value={formData.categories}
          onValueChange={(value) => setFormData(prev => ({ ...prev, categories: value as string[] }))}
          helperText="Select one or more categories"
        />
        
        <Select
          options={userOptions}
          placeholder="Assign to..."
          label="Assignee"
          searchable
          value={formData.assignee}
          onValueChange={(value) => setFormData(prev => ({ ...prev, assignee: value as string }))}
        />
        
        <Select
          options={[
            { value: 'low', label: 'Low Priority' },
            { value: 'medium', label: 'Medium Priority' },
            { value: 'high', label: 'High Priority' },
            { value: 'urgent', label: 'Urgent' }
          ]}
          placeholder="Select priority..."
          label="Priority"
          value={formData.priority}
          onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as string }))}
          required
        />
        
        <div className="pt-4 border-t border-border">
          <h4 className="font-medium mb-2">Form Data:</h4>
          <pre className="text-xs bg-muted p-3 rounded overflow-auto">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      </div>
    );
  }
}; 