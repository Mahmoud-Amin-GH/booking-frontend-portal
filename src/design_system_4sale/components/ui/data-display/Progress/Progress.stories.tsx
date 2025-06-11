import type { Meta, StoryObj } from '@storybook/react';
import { Progress, CircularProgress, StepProgress, MultiProgress } from './Progress';
import { Button } from '../../core/Button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import React from 'react';

const meta: Meta<typeof Progress> = {
  title: 'Interactive/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Progress indicators to show completion status of tasks or processes. Includes linear, circular, and step progress variants.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'The current progress value'
    },
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'destructive', 'secondary'],
      description: 'The visual variant of the progress bar'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the progress bar'
    },
    showValue: {
      control: 'boolean',
      description: 'Whether to show the current value'
    },
    showPercentage: {
      control: 'boolean',
      description: 'Whether to show the percentage'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 60,
    showPercentage: true
  }
};

export const Variants: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <Progress value={60} variant="default" showPercentage>
        <span>Default Progress</span>
      </Progress>
      <Progress value={80} variant="success" showPercentage>
        <span>Success Progress</span>
      </Progress>
      <Progress value={45} variant="warning" showPercentage>
        <span>Warning Progress</span>
      </Progress>
      <Progress value={25} variant="destructive" showPercentage>
        <span>Error Progress</span>
      </Progress>
      <Progress value={70} variant="secondary" showPercentage>
        <span>Secondary Progress</span>
      </Progress>
    </div>
  )
};

export const Sizes: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <Progress value={60} size="sm" showPercentage>
        <span>Small Progress</span>
      </Progress>
      <Progress value={60} size="md" showPercentage>
        <span>Medium Progress</span>
      </Progress>
      <Progress value={60} size="lg" showPercentage>
        <span>Large Progress</span>
      </Progress>
    </div>
  )
};

export const WithValues: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <Progress value={45} max={100} showValue showPercentage>
        <span>Download Progress</span>
      </Progress>
      <Progress value={7} max={10} showValue>
        <span>Steps Completed</span>
      </Progress>
      <Progress value={250} max={500} showValue showPercentage>
        <span>Storage Used (MB)</span>
      </Progress>
    </div>
  )
};

export const Animated: Story = {
  render: () => {
    const AnimatedDemo = () => {
      const [progress, setProgress] = React.useState(0);
      const [isRunning, setIsRunning] = React.useState(false);

      React.useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning && progress < 100) {
          interval = setInterval(() => {
            setProgress(prev => {
              const next = prev + 1;
              if (next >= 100) {
                setIsRunning(false);
              }
              return Math.min(next, 100);
            });
          }, 50);
        }
        return () => clearInterval(interval);
      }, [isRunning, progress]);

      const handleStart = () => setIsRunning(true);
      const handlePause = () => setIsRunning(false);
      const handleReset = () => {
        setProgress(0);
        setIsRunning(false);
      };

      return (
        <div className="w-80 space-y-4">
          <Progress 
            value={progress} 
            showPercentage 
            animated={isRunning}
          >
            <span>Animated Progress</span>
          </Progress>
          
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              onClick={handleStart} 
              disabled={isRunning || progress >= 100}
            >
              <Play className="h-3 w-3 mr-1" />
              Start
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handlePause} 
              disabled={!isRunning}
            >
              <Pause className="h-3 w-3 mr-1" />
              Pause
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={handleReset}
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          </div>
        </div>
      );
    };

    return <AnimatedDemo />;
  }
};

export const Indeterminate: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <Progress indeterminate>
        <span>Loading...</span>
      </Progress>
      <Progress indeterminate variant="success">
        <span>Processing...</span>
      </Progress>
      <Progress indeterminate variant="warning" size="lg">
        <span>Uploading...</span>
      </Progress>
    </div>
  )
};

export const CircularProgressExample: Story = {
  render: () => (
    <div className="flex space-x-8 items-center">
      <CircularProgress value={75} showPercentage />
      <CircularProgress value={45} variant="success" size={80} showPercentage />
      <CircularProgress value={90} variant="warning" size={100} strokeWidth={6}>
        <div className="text-xs font-medium">Complete</div>
      </CircularProgress>
      <CircularProgress value={30} variant="destructive" size={60} showValue max={50} />
    </div>
  )
};

export const StepProgressExample: Story = {
  render: () => {
    const steps = [
      {
        label: 'Account Setup',
        description: 'Create your account',
        completed: true
      },
      {
        label: 'Profile Information',
        description: 'Add your details',
        completed: true
      },
      {
        label: 'Verification',
        description: 'Verify your email',
        current: true
      },
      {
        label: 'Payment',
        description: 'Setup billing',
        completed: false
      },
      {
        label: 'Complete',
        description: 'Start using the app',
        completed: false
      }
    ];

    return (
      <div className="w-full max-w-2xl">
        <StepProgress steps={steps} />
      </div>
    );
  }
};

export const VerticalStepProgress: Story = {
  render: () => {
    const steps = [
      {
        label: 'Order Placed',
        description: 'Your order has been placed',
        completed: true
      },
      {
        label: 'Processing',
        description: 'We are preparing your order',
        completed: true
      },
      {
        label: 'Shipped',
        description: 'Your order is on the way',
        current: true
      },
      {
        label: 'Delivered',
        description: 'Order delivered to your address',
        completed: false
      }
    ];

    return (
      <div className="w-64">
        <StepProgress steps={steps} orientation="vertical" />
      </div>
    );
  }
};

export const StepProgressWithError: Story = {
  render: () => {
    const steps = [
      {
        label: 'Validation',
        description: 'Checking your information',
        completed: true
      },
      {
        label: 'Processing',
        description: 'Processing your request',
        error: true
      },
      {
        label: 'Completion',
        description: 'Finalizing the process',
        completed: false
      }
    ];

    return (
      <div className="w-full max-w-lg">
        <StepProgress steps={steps} />
      </div>
    );
  }
};

export const MultiProgressExample: Story = {
  render: () => {
    const items = [
      {
        label: 'CPU Usage',
        value: 65,
        variant: 'default' as const
      },
      {
        label: 'Memory',
        value: 80,
        variant: 'warning' as const
      },
      {
        label: 'Storage',
        value: 45,
        variant: 'success' as const
      },
      {
        label: 'Network',
        value: 90,
        variant: 'destructive' as const
      }
    ];

    return (
      <div className="w-80">
        <MultiProgress 
          items={items} 
          showPercentages 
          size="md"
        />
      </div>
    );
  }
};

export const RealTimeProgress: Story = {
  render: () => {
    const RealTimeDemo = () => {
      const [downloads, setDownloads] = React.useState<Array<{
        id: number;
        name: string;
        progress: number;
        variant: 'default' | 'success';
      }>>([
        { id: 1, name: 'Document.pdf', progress: 0, variant: 'default' },
        { id: 2, name: 'Image.jpg', progress: 0, variant: 'default' },
        { id: 3, name: 'Video.mp4', progress: 0, variant: 'default' }
      ]);

      React.useEffect(() => {
        const interval = setInterval(() => {
          setDownloads(prev => prev.map(download => {
            if (download.progress >= 100) return download;
            
            const increment = Math.random() * 5;
            const newProgress = Math.min(download.progress + increment, 100);
            const variant: 'default' | 'success' = newProgress >= 100 ? 'success' : 'default';
            
            return {
              ...download,
              progress: newProgress,
              variant
            };
          }));
        }, 200);

        return () => clearInterval(interval);
      }, []);

      const allComplete = downloads.every(d => d.progress >= 100);

      return (
        <div className="w-80 space-y-4">
          <h3 className="font-medium">Download Progress</h3>
          {downloads.map(download => (
            <Progress
              key={download.id}
              value={download.progress}
              variant={download.variant}
              showPercentage
              animated={download.progress < 100}
            >
              <span className="text-sm">{download.name}</span>
            </Progress>
          ))}
          {allComplete && (
            <div className="text-center text-success text-sm font-medium">
              All downloads complete!
            </div>
          )}
        </div>
      );
    };

    return <RealTimeDemo />;
  }
}; 