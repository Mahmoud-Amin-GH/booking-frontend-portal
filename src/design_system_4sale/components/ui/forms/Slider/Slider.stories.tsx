import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from './Slider';
import { Button } from '../../core/Button';
import { Card } from '../../data-display/Card';
import { Volume2, Sun, DollarSign } from 'lucide-react';
import React from 'react';

const meta: Meta<typeof Slider> = {
  title: 'Form/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A slider component for selecting numeric values within a range. Supports single values, ranges, marks, tooltips, and different colors and sizes.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'number',
      description: 'The current value (controlled)'
    },
    min: {
      control: 'number',
      description: 'The minimum value'
    },
    max: {
      control: 'number',
      description: 'The maximum value'
    },
    step: {
      control: 'number',
      description: 'The step increment'
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the slider is disabled'
    },
    range: {
      control: 'boolean',
      description: 'Whether to show a range slider with two handles'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the slider'
    },
    color: {
      control: 'select',
      options: ['primary', 'success', 'warning', 'destructive'],
      description: 'The color variant of the slider'
    },
    showTooltip: {
      control: 'boolean',
      description: 'Whether to show value tooltips'
    },
    showValue: {
      control: 'boolean',
      description: 'Whether to display the current value'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Volume',
    defaultValue: 50,
    showValue: true
  }
};

export const Range: Story = {
  args: {
    label: 'Price Range',
    range: true,
    defaultValue: [25, 75],
    showValue: true,
    formatValue: (value) => `$${value}`
  }
};

export const WithMarks: Story = {
  args: {
    label: 'Rating',
    defaultValue: 7,
    min: 0,
    max: 10,
    step: 1,
    marks: [
      { value: 0, label: '0' },
      { value: 2, label: '2' },
      { value: 4, label: '4' },
      { value: 6, label: '6' },
      { value: 8, label: '8' },
      { value: 10, label: '10' }
    ],
    showValue: true
  }
};

export const Sizes: Story = {
  render: () => (
    <div className="w-80 space-y-6">
      <Slider
        label="Small slider"
        size="sm"
        defaultValue={30}
        showValue
      />
      <Slider
        label="Medium slider"
        size="md"
        defaultValue={50}
        showValue
      />
      <Slider
        label="Large slider"
        size="lg"
        defaultValue={70}
        showValue
      />
    </div>
  )
};

export const Colors: Story = {
  render: () => (
    <div className="w-80 space-y-6">
      <Slider
        label="Primary color"
        color="primary"
        defaultValue={60}
        showValue
      />
      <Slider
        label="Success color"
        color="success"
        defaultValue={70}
        showValue
      />
      <Slider
        label="Warning color"
        color="warning"
        defaultValue={40}
        showValue
      />
      <Slider
        label="Destructive color"
        color="destructive"
        defaultValue={30}
        showValue
      />
    </div>
  )
};

export const WithTooltip: Story = {
  args: {
    label: 'Brightness',
    defaultValue: 65,
    showTooltip: true,
    formatValue: (value) => `${value}%`
  }
};

export const Validation: Story = {
  render: () => (
    <div className="w-80 space-y-6">
      <Slider
        label="Required setting"
        defaultValue={0}
        helperText="Please adjust this setting"
        showValue
      />
      <Slider
        label="Invalid range"
        defaultValue={20}
        error="Value is too low"
        showValue
      />
      <Slider
        label="Valid setting"
        defaultValue={80}
        success="Perfect setting!"
        showValue
      />
    </div>
  )
};

export const Controlled: Story = {
  render: () => {
    const ControlledDemo = () => {
      const [value, setValue] = React.useState(50);

      return (
        <div className="w-80 space-y-4">
          <Slider
            label="Controlled slider"
            value={value}
            onValueChange={(newValue) => setValue(Array.isArray(newValue) ? newValue[0]! : newValue)}
            showValue
            helperText={`Current value: ${value}`}
          />
          
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setValue(0)}
            >
              Min
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setValue(25)}
            >
              25%
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setValue(50)}
            >
              50%
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setValue(75)}
            >
              75%
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setValue(100)}
            >
              Max
            </Button>
          </div>
        </div>
      );
    };

    return <ControlledDemo />;
  }
};

export const AudioControls: Story = {
  render: () => {
    const AudioDemo = () => {
      const [volume, setVolume] = React.useState(75);
      const [bass, setBass] = React.useState(50);
      const [treble, setTreble] = React.useState(60);
      const [balance, setBalance] = React.useState(0);

      return (
        <Card className="w-96 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Volume2 className="h-5 w-5" />
            <h3 className="font-semibold">Audio Controls</h3>
          </div>
          
          <div className="space-y-6">
            <Slider
              label="Volume"
              value={volume}
              onValueChange={(value) => setVolume(Array.isArray(value) ? value[0]! : value)}
              min={0}
              max={100}
              showValue
              formatValue={(value) => `${value}%`}
              color="primary"
            />
            
            <Slider
              label="Bass"
              value={bass}
              onValueChange={(value) => setBass(Array.isArray(value) ? value[0]! : value)}
              min={0}
              max={100}
              showValue
              formatValue={(value) => `${value}%`}
              color="success"
            />
            
            <Slider
              label="Treble"
              value={treble}
              onValueChange={(value) => setTreble(Array.isArray(value) ? value[0]! : value)}
              min={0}
              max={100}
              showValue
              formatValue={(value) => `${value}%`}
              color="warning"
            />
            
            <Slider
              label="Balance"
              value={balance}
              onValueChange={(value) => setBalance(Array.isArray(value) ? value[0]! : value)}
              min={-50}
              max={50}
              step={5}
              showValue
              formatValue={(value) => value === 0 ? 'Center' : value > 0 ? `R${value}` : `L${Math.abs(value)}`}
              marks={[
                { value: -50, label: 'L' },
                { value: 0, label: 'C' },
                { value: 50, label: 'R' }
              ]}
            />
          </div>
        </Card>
      );
    };

    return <AudioDemo />;
  }
};

export const PriceRange: Story = {
  render: () => {
    const PriceDemo = () => {
      const [priceRange, setPriceRange] = React.useState<[number, number]>([200, 800]);
      const [budget, setBudget] = React.useState(1000);

      return (
        <div className="w-96 space-y-6">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <h3 className="font-semibold">Price Filters</h3>
          </div>
          
          <Slider
            label="Price Range"
            range
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            min={0}
            max={2000}
            step={50}
            showValue
            formatValue={(value) => `$${value}`}
            helperText={`Showing products from $${priceRange[0]} to $${priceRange[1]}`}
            marks={[
              { value: 0, label: '$0' },
              { value: 500, label: '$500' },
              { value: 1000, label: '$1K' },
              { value: 1500, label: '$1.5K' },
              { value: 2000, label: '$2K' }
            ]}
          />
          
          <Slider
            label="Maximum Budget"
            value={budget}
            onValueChange={(value) => setBudget(Array.isArray(value) ? value[0]! : value)}
            min={100}
            max={5000}
            step={100}
            showValue
            formatValue={(value) => `$${value}`}
            color="success"
            helperText="Set your maximum spending limit"
          />
          
          <div className="p-4 bg-muted rounded-lg text-sm">
            <p><strong>Selected Range:</strong> ${priceRange[0]} - ${priceRange[1]}</p>
            <p><strong>Budget Limit:</strong> ${budget}</p>
            <p><strong>Range Width:</strong> ${priceRange[1] - priceRange[0]}</p>
          </div>
        </div>
      );
    };

    return <PriceDemo />;
  }
};

export const SystemSettings: Story = {
  render: () => {
    const SettingsDemo = () => {
      const [settings, setSettings] = React.useState({
        brightness: 70,
        contrast: 50,
        saturation: 60,
        temperature: 6500
      });

      return (
        <Card className="w-96 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Sun className="h-5 w-5" />
            <h3 className="font-semibold">Display Settings</h3>
          </div>
          
          <div className="space-y-6">
            <Slider
              label="Brightness"
              value={settings.brightness}
              onValueChange={(value) => setSettings(prev => ({ 
                ...prev, 
                brightness: Array.isArray(value) ? value[0]! : value 
              }))}
              min={0}
              max={100}
              showValue
              formatValue={(value) => `${value}%`}
              showTooltip
            />
            
            <Slider
              label="Contrast"
              value={settings.contrast}
              onValueChange={(value) => setSettings(prev => ({ 
                ...prev, 
                contrast: Array.isArray(value) ? value[0]! : value 
              }))}
              min={0}
              max={100}
              showValue
              formatValue={(value) => `${value}%`}
              color="warning"
            />
            
            <Slider
              label="Saturation"
              value={settings.saturation}
              onValueChange={(value) => setSettings(prev => ({ 
                ...prev, 
                saturation: Array.isArray(value) ? value[0]! : value 
              }))}
              min={0}
              max={100}
              showValue
              formatValue={(value) => `${value}%`}
              color="success"
            />
            
            <Slider
              label="Color Temperature"
              value={settings.temperature}
              onValueChange={(value) => setSettings(prev => ({ 
                ...prev, 
                temperature: Array.isArray(value) ? value[0]! : value 
              }))}
              min={2700}
              max={9300}
              step={100}
              showValue
              formatValue={(value) => `${value}K`}
              marks={[
                { value: 2700, label: 'Warm' },
                { value: 6500, label: 'Neutral' },
                { value: 9300, label: 'Cool' }
              ]}
            />
          </div>
        </Card>
      );
    };

    return <SettingsDemo />;
  }
}; 