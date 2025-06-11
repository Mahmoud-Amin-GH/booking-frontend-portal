import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';
import { Button } from '../../core/Button';
import { Card } from '../../data-display/Card';
import React from 'react';

const meta: Meta<typeof Textarea> = {
  title: 'Form/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A multi-line text input component with support for auto-resize, character counting, validation states, and different sizes.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether the textarea is disabled'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the textarea'
    },
    resize: {
      control: 'select',
      options: ['none', 'vertical', 'horizontal', 'both'],
      description: 'How the textarea can be resized'
    },
    autoResize: {
      control: 'boolean',
      description: 'Whether the textarea should auto-resize based on content'
    },
    showCharacterCount: {
      control: 'boolean',
      description: 'Whether to show character count'
    },
    label: {
      control: 'text',
      description: 'Label text for the textarea'
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Message',
    placeholder: 'Enter your message here...'
  }
};

export const WithHelperText: Story = {
  args: {
    label: 'Description',
    placeholder: 'Describe your project...',
    helperText: 'Provide a detailed description of your project goals and requirements.'
  }
};

export const WithCharacterCount: Story = {
  args: {
    label: 'Bio',
    placeholder: 'Tell us about yourself...',
    showCharacterCount: true,
    maxLength: 500,
    helperText: 'Write a brief bio that will be displayed on your profile.'
  }
};

export const Sizes: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <Textarea
        label="Small textarea"
        size="sm"
        placeholder="Small size..."
        defaultValue="This is a small textarea"
      />
      <Textarea
        label="Medium textarea"
        size="md"
        placeholder="Medium size..."
        defaultValue="This is a medium textarea"
      />
      <Textarea
        label="Large textarea"
        size="lg"
        placeholder="Large size..."
        defaultValue="This is a large textarea"
      />
    </div>
  )
};

export const ResizeOptions: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <Textarea
        label="No resize"
        resize="none"
        placeholder="Cannot be resized..."
        defaultValue="This textarea cannot be resized"
      />
      <Textarea
        label="Vertical resize"
        resize="vertical"
        placeholder="Can be resized vertically..."
        defaultValue="This textarea can be resized vertically"
      />
      <Textarea
        label="Horizontal resize"
        resize="horizontal"
        placeholder="Can be resized horizontally..."
        defaultValue="This textarea can be resized horizontally"
      />
      <Textarea
        label="Both directions"
        resize="both"
        placeholder="Can be resized in both directions..."
        defaultValue="This textarea can be resized in both directions"
      />
    </div>
  )
};

export const AutoResize: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <Textarea
        label="Auto-resize textarea"
        autoResize
        minRows={2}
        maxRows={8}
        placeholder="Start typing and watch it grow..."
        helperText="This textarea will automatically adjust its height based on content"
      />
      <Textarea
        label="Fixed height textarea"
        autoResize={false}
        rows={4}
        placeholder="Fixed height..."
        helperText="This textarea has a fixed height"
      />
    </div>
  )
};

export const Validation: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <Textarea
        label="Required field"
        placeholder="This field is required..."
        required
        helperText="Please provide the required information"
      />
      <Textarea
        label="Invalid input"
        placeholder="Enter valid content..."
        error="This field contains invalid content"
        defaultValue="Invalid content here"
      />
      <Textarea
        label="Valid input"
        placeholder="Content looks good..."
        success="Content validated successfully!"
        defaultValue="This is valid content that meets all requirements."
      />
    </div>
  )
};

export const States: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <Textarea
        label="Default state"
        placeholder="Enter text..."
      />
      <Textarea
        label="Focused state"
        placeholder="This would be focused..."
        defaultValue="Click to see focus state"
      />
      <Textarea
        label="Disabled state"
        placeholder="Cannot edit..."
        disabled
        defaultValue="This textarea is disabled"
      />
    </div>
  )
};

export const Controlled: Story = {
  render: () => {
    const ControlledDemo = () => {
      const [value, setValue] = React.useState('');
      const [wordCount, setWordCount] = React.useState(0);

      React.useEffect(() => {
        const words = value.trim().split(/\s+/).filter(word => word.length > 0);
        setWordCount(words.length);
      }, [value]);

      return (
        <div className="w-96 space-y-4">
          <Textarea
            label="Controlled textarea"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Start typing..."
            showCharacterCount
            maxLength={1000}
            autoResize
            helperText={`Words: ${wordCount} | Characters: ${value.length}`}
          />
          
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setValue('')}
            >
              Clear
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setValue('This is sample text that demonstrates the controlled textarea functionality.')}
            >
              Sample Text
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setValue(value.toUpperCase())}
              disabled={!value}
            >
              Uppercase
            </Button>
          </div>
        </div>
      );
    };

    return <ControlledDemo />;
  }
};

export const FeedbackForm: Story = {
  render: () => {
    const FeedbackDemo = () => {
      const [formData, setFormData] = React.useState({
        subject: '',
        message: '',
        suggestions: ''
      });

      const [errors, setErrors] = React.useState<Record<string, string>>({});

      const handleSubmit = () => {
        const newErrors: Record<string, string> = {};
        
        if (!formData.subject.trim()) {
          newErrors['subject'] = 'Subject is required';
        }
        if (!formData.message.trim()) {
          newErrors['message'] = 'Message is required';
        } else if (formData.message.length < 10) {
          newErrors['message'] = 'Message must be at least 10 characters long';
        }
        
        setErrors(newErrors);
        
        if (Object.keys(newErrors).length === 0) {
          alert('Feedback submitted successfully!');
        }
      };

      return (
        <Card className="w-96 p-6">
          <h3 className="font-semibold mb-4">Send Feedback</h3>
          
          <div className="space-y-4">
            <Textarea
              label="Subject"
              placeholder="Brief summary of your feedback..."
              value={formData.subject}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, subject: e.target.value }));
                if (errors['subject']) {
                  setErrors(prev => ({ ...prev, subject: '' }));
                }
              }}
              required
              rows={2}
              maxLength={100}
              showCharacterCount
              {...(errors['subject'] && { error: errors['subject'] })}
            />
            
            <Textarea
              label="Message"
              placeholder="Describe your feedback in detail..."
              value={formData.message}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, message: e.target.value }));
                if (errors['message']) {
                  setErrors(prev => ({ ...prev, message: '' }));
                }
              }}
              required
              autoResize
              minRows={4}
              maxRows={10}
              maxLength={1000}
              showCharacterCount
              helperText="Please provide detailed feedback to help us improve"
              {...(errors['message'] && { error: errors['message'] })}
            />
            
            <Textarea
              label="Suggestions (Optional)"
              placeholder="Any suggestions for improvement..."
              value={formData.suggestions}
              onChange={(e) => setFormData(prev => ({ ...prev, suggestions: e.target.value }))}
              autoResize
              minRows={2}
              maxRows={6}
              maxLength={500}
              showCharacterCount
              helperText="Share any ideas or suggestions you might have"
            />
            
            <Button onClick={handleSubmit} className="w-full">
              Submit Feedback
            </Button>
          </div>
        </Card>
      );
    };

    return <FeedbackDemo />;
  }
};

export const CodeEditor: Story = {
  render: () => {
    const CodeDemo = () => {
      const [code, setCode] = React.useState(`function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));`);

      const lineCount = code.split('\n').length;

      return (
        <div className="w-96 space-y-4">
          <Textarea
            label="Code Editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter your code here..."
            resize="both"
            rows={12}
            className="font-mono text-sm"
            showCharacterCount
            helperText={`Lines: ${lineCount} | Characters: ${code.length}`}
          />
          
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setCode('')}
            >
              Clear
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                const formatted = code
                  .split('\n')
                  .map(line => line.trim())
                  .join('\n');
                setCode(formatted);
              }}
            >
              Format
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => navigator.clipboard.writeText(code)}
            >
              Copy
            </Button>
          </div>
        </div>
      );
    };

    return <CodeDemo />;
  }
}; 