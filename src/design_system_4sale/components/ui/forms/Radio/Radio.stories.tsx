import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from './Radio';
import { Button } from '../../core/Button';
import React from 'react';

const meta: Meta<typeof Radio> = {
  title: 'Form/Radio',
  component: Radio,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A radio button group component for single selection from multiple options. Supports labels, descriptions, validation states, and different orientations.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'The currently selected value (controlled)'
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the entire radio group is disabled'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the radio buttons'
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'The layout orientation of the radio group'
    },
    label: {
      control: 'text',
      description: 'Label text for the radio group'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

const basicOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' }
];

export const Default: Story = {
  args: {
    label: 'Choose an option',
    options: basicOptions,
    defaultValue: 'option1'
  }
};

export const WithDescriptions: Story = {
  args: {
    label: 'Select your plan',
    options: [
      { 
        value: 'basic', 
        label: 'Basic Plan', 
        description: 'Perfect for individuals getting started' 
      },
      { 
        value: 'pro', 
        label: 'Pro Plan', 
        description: 'Great for small teams and growing businesses' 
      },
      { 
        value: 'enterprise', 
        label: 'Enterprise Plan', 
        description: 'Advanced features for large organizations' 
      }
    ],
    defaultValue: 'pro'
  }
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-6">
      <Radio
        label="Small radio group"
        size="sm"
        options={basicOptions}
        defaultValue="option1"
      />
      <Radio
        label="Medium radio group"
        size="md"
        options={basicOptions}
        defaultValue="option2"
      />
      <Radio
        label="Large radio group"
        size="lg"
        options={basicOptions}
        defaultValue="option3"
      />
    </div>
  )
};

export const Orientations: Story = {
  render: () => (
    <div className="space-y-8">
      <Radio
        label="Vertical orientation (default)"
        orientation="vertical"
        options={basicOptions}
        defaultValue="option1"
      />
      <Radio
        label="Horizontal orientation"
        orientation="horizontal"
        options={basicOptions}
        defaultValue="option2"
      />
    </div>
  )
};

export const WithDisabledOptions: Story = {
  render: () => (
    <Radio
      label="Select your preference"
      options={[
        { value: 'available1', label: 'Available Option 1' },
        { value: 'available2', label: 'Available Option 2' },
        { value: 'disabled1', label: 'Disabled Option 1', disabled: true },
        { value: 'available3', label: 'Available Option 3' },
        { value: 'disabled2', label: 'Disabled Option 2', disabled: true }
      ]}
      defaultValue="available1"
    />
  )
};

export const Validation: Story = {
  render: () => (
    <div className="space-y-6 w-80">
      <Radio
        label="Required selection"
        options={basicOptions}
        required
        helperText="Please select one of the options above"
      />
      <Radio
        label="Invalid selection"
        options={basicOptions}
        error="Please make a valid selection"
        defaultValue="option1"
      />
      <Radio
        label="Valid selection"
        options={basicOptions}
        success="Great choice!"
        defaultValue="option2"
      />
    </div>
  )
};

export const Controlled: Story = {
  render: () => {
    const ControlledDemo = () => {
      const [value, setValue] = React.useState('option2');

      const options = [
        { value: 'option1', label: 'First Option', description: 'This is the first choice' },
        { value: 'option2', label: 'Second Option', description: 'This is the second choice' },
        { value: 'option3', label: 'Third Option', description: 'This is the third choice' }
      ];

      return (
        <div className="space-y-4">
          <Radio
            label="Controlled radio group"
            options={options}
            value={value}
            onValueChange={setValue}
            helperText={`Currently selected: ${value}`}
          />
          
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setValue('option1')}
            >
              Select Option 1
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setValue('option2')}
            >
              Select Option 2
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setValue('option3')}
            >
              Select Option 3
            </Button>
          </div>
        </div>
      );
    };

    return <ControlledDemo />;
  }
};

export const PaymentMethod: Story = {
  render: () => {
    const PaymentDemo = () => {
      const [paymentMethod, setPaymentMethod] = React.useState('card');

      const paymentOptions = [
        {
          value: 'card',
          label: 'Credit Card',
          description: 'Pay with Visa, Mastercard, or American Express'
        },
        {
          value: 'paypal',
          label: 'PayPal',
          description: 'Pay securely with your PayPal account'
        },
        {
          value: 'bank',
          label: 'Bank Transfer',
          description: 'Direct transfer from your bank account'
        },
        {
          value: 'crypto',
          label: 'Cryptocurrency',
          description: 'Pay with Bitcoin, Ethereum, or other cryptocurrencies',
          disabled: true
        }
      ];

      return (
        <div className="w-96 space-y-4">
          <Radio
            label="Payment Method"
            options={paymentOptions}
            value={paymentMethod}
            onValueChange={setPaymentMethod}
            helperText="Choose how you'd like to pay for your order"
          />
          
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium">Selected: {paymentMethod}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {paymentOptions.find(option => option.value === paymentMethod)?.description}
            </p>
          </div>
        </div>
      );
    };

    return <PaymentDemo />;
  }
};

export const FormExample: Story = {
  render: () => {
    const FormDemo = () => {
      const [formData, setFormData] = React.useState({
        experience: '',
        frequency: '',
        recommendation: ''
      });

      const [errors, setErrors] = React.useState<Record<string, string>>({});

      const handleSubmit = () => {
        const newErrors: Record<string, string> = {};
        
        if (!formData.experience) {
          newErrors['experience'] = 'Please select your experience level';
        }
        if (!formData.frequency) {
          newErrors['frequency'] = 'Please select how often you use our service';
        }
        if (!formData.recommendation) {
          newErrors['recommendation'] = 'Please let us know if you would recommend us';
        }
        
        setErrors(newErrors);
        
        if (Object.keys(newErrors).length === 0) {
          alert('Survey submitted successfully!');
        }
      };

      return (
        <div className="w-96 space-y-6">
          <h3 className="font-medium">Customer Survey</h3>
          
          <Radio
            label="What's your experience level?"
            options={[
              { value: 'beginner', label: 'Beginner', description: 'New to this type of service' },
              { value: 'intermediate', label: 'Intermediate', description: 'Some experience with similar services' },
              { value: 'advanced', label: 'Advanced', description: 'Very experienced user' }
            ]}
            value={formData.experience}
            onValueChange={(value) => {
              setFormData(prev => ({ ...prev, experience: value }));
              if (errors['experience']) {
                setErrors(prev => ({ ...prev, experience: '' }));
              }
            }}
            required
            {...(errors['experience'] && { error: errors['experience'] })}
          />
          
          <Radio
            label="How often do you use our service?"
            options={[
              { value: 'daily', label: 'Daily' },
              { value: 'weekly', label: 'Weekly' },
              { value: 'monthly', label: 'Monthly' },
              { value: 'rarely', label: 'Rarely' }
            ]}
            orientation="horizontal"
            value={formData.frequency}
            onValueChange={(value) => {
              setFormData(prev => ({ ...prev, frequency: value }));
              if (errors['frequency']) {
                setErrors(prev => ({ ...prev, frequency: '' }));
              }
            }}
            required
            {...(errors['frequency'] && { error: errors['frequency'] })}
          />
          
          <Radio
            label="Would you recommend us to others?"
            options={[
              { value: 'definitely', label: 'Definitely' },
              { value: 'probably', label: 'Probably' },
              { value: 'maybe', label: 'Maybe' },
              { value: 'probably-not', label: 'Probably not' },
              { value: 'definitely-not', label: 'Definitely not' }
            ]}
            value={formData.recommendation}
            onValueChange={(value) => {
              setFormData(prev => ({ ...prev, recommendation: value }));
              if (errors['recommendation']) {
                setErrors(prev => ({ ...prev, recommendation: '' }));
              }
            }}
            required
            {...(errors['recommendation'] && { error: errors['recommendation'] })}
          />
          
          <Button onClick={handleSubmit} className="w-full">
            Submit Survey
          </Button>
        </div>
      );
    };

    return <FormDemo />;
  }
}; 