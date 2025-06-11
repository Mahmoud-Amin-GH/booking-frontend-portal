import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './Switch';
import { Button } from '../../core/Button';
import { Card } from '../../data-display/Card';
import { Bell, Moon, Wifi, Volume2, Shield, Eye } from 'lucide-react';
import React from 'react';

const meta: Meta<typeof Switch> = {
  title: 'Form/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A toggle switch component for binary on/off states. Supports labels, descriptions, validation states, and different colors and sizes.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the switch is checked (controlled)'
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the switch is disabled'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the switch'
    },
    color: {
      control: 'select',
      options: ['primary', 'success', 'warning', 'destructive'],
      description: 'The color variant of the switch'
    },
    label: {
      control: 'text',
      description: 'Label text for the switch'
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
    label: 'Enable notifications'
  }
};

export const Checked: Story = {
  args: {
    label: 'Dark mode',
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
      <Switch size="sm" label="Small switch" />
      <Switch size="md" label="Medium switch" defaultChecked />
      <Switch size="lg" label="Large switch" />
    </div>
  )
};

export const Colors: Story = {
  render: () => (
    <div className="space-y-4">
      <Switch color="primary" label="Primary color" defaultChecked />
      <Switch color="success" label="Success color" defaultChecked />
      <Switch color="warning" label="Warning color" defaultChecked />
      <Switch color="destructive" label="Destructive color" defaultChecked />
    </div>
  )
};

export const States: Story = {
  render: () => (
    <div className="space-y-4">
      <Switch label="Default state" />
      <Switch label="Checked state" defaultChecked />
      <Switch label="Disabled state" disabled />
      <Switch label="Disabled checked" disabled defaultChecked />
    </div>
  )
};

export const Validation: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Switch 
        label="Terms and conditions" 
        description="You must accept the terms to continue"
        required
      />
      <Switch 
        label="Invalid switch" 
        error="You must enable this setting"
      />
      <Switch 
        label="Valid switch" 
        success="Setting enabled successfully"
        defaultChecked
      />
    </div>
  )
};

export const Controlled: Story = {
  render: () => {
    const ControlledDemo = () => {
      const [checked, setChecked] = React.useState(false);

      return (
        <div className="space-y-4">
          <Switch
            label="Controlled switch"
            description={`Current state: ${checked ? 'enabled' : 'disabled'}`}
            checked={checked}
            onCheckedChange={setChecked}
          />
          
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setChecked(true)}
            >
              Enable
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setChecked(false)}
            >
              Disable
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setChecked(!checked)}
            >
              Toggle
            </Button>
          </div>
        </div>
      );
    };

    return <ControlledDemo />;
  }
};

export const SettingsPanel: Story = {
  render: () => {
    const SettingsDemo = () => {
      const [settings, setSettings] = React.useState({
        notifications: true,
        darkMode: false,
        autoSave: true,
        soundEffects: false,
        dataSharing: false,
        twoFactor: true
      });

      const updateSetting = (key: keyof typeof settings, value: boolean) => {
        setSettings(prev => ({ ...prev, [key]: value }));
      };

      return (
        <Card className="w-96 p-6">
          <h3 className="font-semibold mb-4">Application Settings</h3>
          
          <div className="space-y-4">
            <Switch
              label="Push Notifications"
              description="Receive push notifications on your device"
              checked={settings.notifications}
              onCheckedChange={(checked) => updateSetting('notifications', checked)}
            />
            
            <Switch
              label="Dark Mode"
              description="Use dark theme throughout the application"
              checked={settings.darkMode}
              onCheckedChange={(checked) => updateSetting('darkMode', checked)}
            />
            
            <Switch
              label="Auto Save"
              description="Automatically save your work every few minutes"
              checked={settings.autoSave}
              onCheckedChange={(checked) => updateSetting('autoSave', checked)}
              color="success"
            />
            
            <Switch
              label="Sound Effects"
              description="Play sounds for various actions and notifications"
              checked={settings.soundEffects}
              onCheckedChange={(checked) => updateSetting('soundEffects', checked)}
            />
            
            <Switch
              label="Data Sharing"
              description="Share anonymous usage data to help improve the app"
              checked={settings.dataSharing}
              onCheckedChange={(checked) => updateSetting('dataSharing', checked)}
              color="warning"
            />
            
            <Switch
              label="Two-Factor Authentication"
              description="Add an extra layer of security to your account"
              checked={settings.twoFactor}
              onCheckedChange={(checked) => updateSetting('twoFactor', checked)}
              color="success"
            />
          </div>
        </Card>
      );
    };

    return <SettingsDemo />;
  }
};

export const WithIcons: Story = {
  render: () => {
    const IconDemo = () => {
      const [settings, setSettings] = React.useState({
        notifications: true,
        darkMode: false,
        wifi: true,
        volume: false,
        security: true,
        privacy: false
      });

      return (
        <div className="w-80 space-y-4">
          <div className="flex items-center space-x-3">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <Switch
              label="Notifications"
              checked={settings.notifications}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, notifications: checked }))}
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <Moon className="h-5 w-5 text-muted-foreground" />
            <Switch
              label="Dark Mode"
              checked={settings.darkMode}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, darkMode: checked }))}
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <Wifi className="h-5 w-5 text-muted-foreground" />
            <Switch
              label="Wi-Fi"
              checked={settings.wifi}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, wifi: checked }))}
              color="success"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <Volume2 className="h-5 w-5 text-muted-foreground" />
            <Switch
              label="Sound"
              checked={settings.volume}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, volume: checked }))}
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <Switch
              label="Security"
              checked={settings.security}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, security: checked }))}
              color="success"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <Eye className="h-5 w-5 text-muted-foreground" />
            <Switch
              label="Privacy Mode"
              checked={settings.privacy}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, privacy: checked }))}
              color="warning"
            />
          </div>
        </div>
      );
    };

    return <IconDemo />;
  }
};

export const FormExample: Story = {
  render: () => {
    const FormDemo = () => {
      const [formData, setFormData] = React.useState({
        emailNotifications: true,
        smsNotifications: false,
        marketingEmails: false,
        newsletter: true,
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
          alert('Preferences saved successfully!');
        }
      };

      return (
        <div className="w-80 space-y-4">
          <h3 className="font-medium">Communication Preferences</h3>
          
          <Switch
            label="Email Notifications"
            description="Receive important updates via email"
            checked={formData.emailNotifications}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, emailNotifications: checked }))}
          />
          
          <Switch
            label="SMS Notifications"
            description="Get urgent alerts via text message"
            checked={formData.smsNotifications}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, smsNotifications: checked }))}
          />
          
          <Switch
            label="Marketing Emails"
            description="Receive promotional offers and product updates"
            checked={formData.marketingEmails}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, marketingEmails: checked }))}
            color="warning"
          />
          
          <Switch
            label="Newsletter Subscription"
            description="Get our weekly newsletter with tips and insights"
            checked={formData.newsletter}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, newsletter: checked }))}
          />
          
          <Switch
            label="Accept Terms and Conditions"
            description="I agree to the terms of service and privacy policy"
            required
            checked={formData.terms}
            onCheckedChange={(checked) => {
              setFormData(prev => ({ ...prev, terms: checked }));
              if (checked && errors['terms']) {
                setErrors(prev => ({ ...prev, terms: '' }));
              }
            }}
            color="success"
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