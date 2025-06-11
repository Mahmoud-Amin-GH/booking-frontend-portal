import type { Meta, StoryObj } from '@storybook/react';
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalFooter, ConfirmationModal } from './Modal';
import { Button } from '../../core/Button';
import { Input } from '../../forms/Input';
import React from 'react';

const meta: Meta<typeof Modal> = {
  title: 'Feedback/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A modal dialog component with overlay, animations, and accessibility features. Supports different sizes and customizable content.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: 'The size of the modal'
    },
    showCloseButton: {
      control: 'boolean',
      description: 'Whether to show the close button'
    },
    closeOnOverlayClick: {
      control: 'boolean',
      description: 'Whether clicking the overlay closes the modal'
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Whether pressing escape closes the modal'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Modal Demo
const BasicModalDemo: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'xl' | 'full' }> = ({ size = 'md' }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Open {size.toUpperCase()} Modal
      </Button>
      <Modal open={isOpen} onOpenChange={setIsOpen} size={size}>
        <ModalHeader>
          <ModalTitle>Modal Title</ModalTitle>
          <ModalDescription>
            This is a sample modal dialog. You can put any content here.
          </ModalDescription>
        </ModalHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            This is the modal content area. You can add forms, text, images, or any other content here.
          </p>
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsOpen(false)}>
            Confirm
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export const Default: Story = {
  render: () => <BasicModalDemo />
};

export const Small: Story = {
  render: () => <BasicModalDemo size="sm" />
};

export const Large: Story = {
  render: () => <BasicModalDemo size="lg" />
};

export const ExtraLarge: Story = {
  render: () => <BasicModalDemo size="xl" />
};

export const FullScreen: Story = {
  render: () => <BasicModalDemo size="full" />
};

export const WithForm: Story = {
  render: () => {
    const FormModalDemo = () => {
      const [isOpen, setIsOpen] = React.useState(false);
      const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        message: ''
      });

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        setIsOpen(false);
        setFormData({ name: '', email: '', message: '' });
      };

      return (
        <>
          <Button onClick={() => setIsOpen(true)}>
            Open Form Modal
          </Button>
          <Modal open={isOpen} onOpenChange={setIsOpen} size="md">
            <ModalHeader>
              <ModalTitle>Contact Form</ModalTitle>
              <ModalDescription>
                Fill out the form below to send us a message.
              </ModalDescription>
            </ModalHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-md"
                  rows={3}
                  placeholder="Your message"
                  required
                />
              </div>
              <ModalFooter>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Send Message
                </Button>
              </ModalFooter>
            </form>
          </Modal>
        </>
      );
    };

    return <FormModalDemo />;
  }
};

export const ConfirmationDialog: Story = {
  render: () => {
    const ConfirmationDemo = () => {
      const [isOpen, setIsOpen] = React.useState(false);
      const [isDestructiveOpen, setIsDestructiveOpen] = React.useState(false);
      const [isLoading, setIsLoading] = React.useState(false);

      const handleConfirm = () => {
        console.log('Confirmed!');
      };

      const handleDestructiveConfirm = () => {
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          setIsDestructiveOpen(false);
          console.log('Deleted!');
        }, 2000);
      };

      return (
        <div className="space-x-2">
          <Button onClick={() => setIsOpen(true)}>
            Show Confirmation
          </Button>
          <Button variant="destructive" onClick={() => setIsDestructiveOpen(true)}>
            Delete Item
          </Button>

          <ConfirmationModal
            open={isOpen}
            onOpenChange={setIsOpen}
            title="Confirm Action"
            description="Are you sure you want to proceed with this action?"
            onConfirm={handleConfirm}
          />

          <ConfirmationModal
            open={isDestructiveOpen}
            onOpenChange={setIsDestructiveOpen}
            title="Delete Item"
            description="This action cannot be undone. Are you sure you want to delete this item?"
            confirmText="Delete"
            variant="destructive"
            loading={isLoading}
            onConfirm={handleDestructiveConfirm}
          />
        </div>
      );
    };

    return <ConfirmationDemo />;
  }
};

export const WithoutCloseButton: Story = {
  render: () => {
    const NoCloseButtonDemo = () => {
      const [isOpen, setIsOpen] = React.useState(false);

      return (
        <>
          <Button onClick={() => setIsOpen(true)}>
            Open Modal (No Close Button)
          </Button>
          <Modal open={isOpen} onOpenChange={setIsOpen} showCloseButton={false}>
            <ModalHeader>
              <ModalTitle>Important Notice</ModalTitle>
              <ModalDescription>
                This modal doesn't have a close button. You must use the action buttons below.
              </ModalDescription>
            </ModalHeader>
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                This is useful for critical actions where you want to force the user to make a decision.
              </p>
            </div>
            <ModalFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsOpen(false)}>
                Acknowledge
              </Button>
            </ModalFooter>
          </Modal>
        </>
      );
    };

    return <NoCloseButtonDemo />;
  }
};

export const NonDismissible: Story = {
  render: () => {
    const NonDismissibleDemo = () => {
      const [isOpen, setIsOpen] = React.useState(false);

      return (
        <>
          <Button onClick={() => setIsOpen(true)}>
            Open Non-Dismissible Modal
          </Button>
          <Modal 
            open={isOpen} 
            onOpenChange={setIsOpen}
            closeOnOverlayClick={false}
            closeOnEscape={false}
          >
            <ModalHeader>
              <ModalTitle>Required Action</ModalTitle>
              <ModalDescription>
                This modal cannot be dismissed by clicking outside or pressing escape.
              </ModalDescription>
            </ModalHeader>
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                You must complete the action or explicitly cancel to close this modal.
              </p>
            </div>
            <ModalFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsOpen(false)}>
                Complete Action
              </Button>
            </ModalFooter>
          </Modal>
        </>
      );
    };

    return <NonDismissibleDemo />;
  }
};

export const NestedModals: Story = {
  render: () => {
    const NestedModalsDemo = () => {
      const [firstModalOpen, setFirstModalOpen] = React.useState(false);
      const [secondModalOpen, setSecondModalOpen] = React.useState(false);

      return (
        <>
          <Button onClick={() => setFirstModalOpen(true)}>
            Open First Modal
          </Button>

          <Modal open={firstModalOpen} onOpenChange={setFirstModalOpen}>
            <ModalHeader>
              <ModalTitle>First Modal</ModalTitle>
              <ModalDescription>
                This is the first modal. You can open another modal from here.
              </ModalDescription>
            </ModalHeader>
            <div className="py-4">
              <Button onClick={() => setSecondModalOpen(true)}>
                Open Second Modal
              </Button>
            </div>
            <ModalFooter>
              <Button variant="outline" onClick={() => setFirstModalOpen(false)}>
                Close
              </Button>
            </ModalFooter>
          </Modal>

          <Modal open={secondModalOpen} onOpenChange={setSecondModalOpen}>
            <ModalHeader>
              <ModalTitle>Second Modal</ModalTitle>
              <ModalDescription>
                This is a nested modal on top of the first one.
              </ModalDescription>
            </ModalHeader>
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                Nested modals can be useful for multi-step workflows.
              </p>
            </div>
            <ModalFooter>
              <Button onClick={() => setSecondModalOpen(false)}>
                Close This Modal
              </Button>
            </ModalFooter>
          </Modal>
        </>
      );
    };

    return <NestedModalsDemo />;
  }
}; 