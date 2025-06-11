import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.css';
import { Button } from './components/ui/core/Button';
import { Input } from './components/ui/forms/Input';
import { Card } from './components/ui/data-display/Card';
import { Badge } from './components/ui/core/Badge';
import { Alert } from './components/ui/feedback/Alert';
import { Plus, Mail, Heart } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Design System</h1>
          <p className="text-muted-foreground">
            A comprehensive React design system built with TypeScript and Tailwind CSS
          </p>
        </div>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-4">
            <Button leftIcon={<Plus className="h-4 w-4" />}>Add Item</Button>
            <Button loading>Loading...</Button>
            <Button disabled>Disabled</Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Inputs</h2>
          <div className="space-y-4 max-w-md">
            <Input 
              label="Email" 
              type="email" 
              placeholder="Enter your email"
              startIcon={<Mail className="h-4 w-4" />}
            />
            <Input 
              label="Password" 
              type="password" 
              placeholder="Enter your password"
            />
            <Input 
              label="Name" 
              placeholder="Enter your name"
              helperText="This will be displayed publicly"
            />
            <Input 
              label="Error Example" 
              placeholder="This has an error"
              error="This field is required"
            />
            <Input 
              label="Success Example" 
              placeholder="This is valid"
              success="Looks good!"
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Badges</h2>
          <div className="flex flex-wrap gap-4">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-4">
            <Badge icon={<Heart className="h-3 w-3" />}>With Icon</Badge>
            <Badge dismissible onDismiss={() => alert('Dismissed!')}>
              Dismissible
            </Badge>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Alerts</h2>
          <div className="space-y-4">
            <Alert title="Default Alert">
              This is a default alert message.
            </Alert>
            <Alert variant="destructive" title="Error Alert">
              Something went wrong. Please try again.
            </Alert>
            <Alert variant="success" title="Success Alert">
              Your changes have been saved successfully.
            </Alert>
            <Alert variant="warning" title="Warning Alert">
              Please review your information before proceeding.
            </Alert>
            <Alert variant="info" title="Info Alert">
              Here's some helpful information for you.
            </Alert>
            <Alert 
              variant="info" 
              title="Dismissible Alert" 
              dismissible 
              onDismiss={() => alert('Alert dismissed!')}
            >
              This alert can be dismissed by clicking the X button.
            </Alert>
          </div>
        </Card>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 