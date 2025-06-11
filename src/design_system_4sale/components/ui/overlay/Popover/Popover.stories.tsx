import type { Meta, StoryObj } from '@storybook/react';
import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverDescription, PopoverFooter } from './Popover';
import { Button } from '../../core/Button';
import { Input } from '../../forms/Input';
import { ChevronDown, Settings, User, Calendar, Filter, MoreHorizontal } from 'lucide-react';
import React from 'react';

const meta: Meta<typeof Popover> = {
  title: 'Feedback/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A popover component that displays rich content in a floating panel. Supports click triggers, smart positioning, and customizable content.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
      description: 'The preferred side of the trigger to render against'
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
      description: 'The preferred alignment against the trigger'
    },
    modal: {
      control: 'boolean',
      description: 'Whether the popover should be modal'
    },
    closeOnClickOutside: {
      control: 'boolean',
      description: 'Whether clicking outside closes the popover'
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Whether pressing escape closes the popover'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover
      content={
        <PopoverContent>
          <div className="space-y-2">
            <h4 className="font-medium">Popover Content</h4>
            <p className="text-sm text-muted-foreground">
              This is the default popover content. You can put any content here.
            </p>
          </div>
        </PopoverContent>
      }
    >
      <Button>Open Popover</Button>
    </Popover>
  )
};

export const Positions: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8 p-8">
      <Popover
        side="top"
        content={
          <PopoverContent>
            <p className="text-sm">Popover positioned on top</p>
          </PopoverContent>
        }
      >
        <Button>Top</Button>
      </Popover>
      
      <Popover
        side="right"
        content={
          <PopoverContent>
            <p className="text-sm">Popover positioned on right</p>
          </PopoverContent>
        }
      >
        <Button>Right</Button>
      </Popover>
      
      <Popover
        side="bottom"
        content={
          <PopoverContent>
            <p className="text-sm">Popover positioned on bottom</p>
          </PopoverContent>
        }
      >
        <Button>Bottom</Button>
      </Popover>
      
      <Popover
        side="left"
        content={
          <PopoverContent>
            <p className="text-sm">Popover positioned on left</p>
          </PopoverContent>
        }
      >
        <Button>Left</Button>
      </Popover>
    </div>
  )
};

export const WithHeaderAndFooter: Story = {
  render: () => (
    <Popover
      content={
        <div className="w-80">
          <PopoverHeader>
            <PopoverTitle>Settings</PopoverTitle>
            <PopoverDescription>
              Manage your account settings and preferences.
            </PopoverDescription>
          </PopoverHeader>
          <PopoverContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Display Name</label>
                <Input placeholder="Enter your display name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input type="email" placeholder="Enter your email" />
              </div>
            </div>
          </PopoverContent>
          <PopoverFooter>
            <Button variant="outline" size="sm">Cancel</Button>
            <Button size="sm">Save Changes</Button>
          </PopoverFooter>
        </div>
      }
    >
      <Button>
        <Settings className="h-4 w-4 mr-2" />
        Settings
      </Button>
    </Popover>
  )
};

export const UserMenu: Story = {
  render: () => (
    <Popover
      content={
        <div className="w-56">
          <PopoverContent>
            <div className="space-y-1">
              <div className="flex items-center space-x-2 p-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">john@example.com</p>
                </div>
              </div>
              <div className="border-t pt-2">
                <button className="w-full text-left px-2 py-1.5 text-sm hover:bg-muted rounded">
                  Profile
                </button>
                <button className="w-full text-left px-2 py-1.5 text-sm hover:bg-muted rounded">
                  Settings
                </button>
                <button className="w-full text-left px-2 py-1.5 text-sm hover:bg-muted rounded">
                  Billing
                </button>
                <div className="border-t mt-2 pt-2">
                  <button className="w-full text-left px-2 py-1.5 text-sm hover:bg-muted rounded text-destructive">
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </div>
      }
    >
      <Button variant="ghost" size="sm">
        <User className="h-4 w-4 mr-2" />
        Account
        <ChevronDown className="h-3 w-3 ml-2" />
      </Button>
    </Popover>
  )
};

export const DatePicker: Story = {
  render: () => {
    const DatePickerDemo = () => {
      const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);

      const generateCalendar = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
          days.push(null);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
          days.push(new Date(year, month, day));
        }

        return days;
      };

      const formatDate = (date: Date | null) => {
        if (!date) return 'Select date';
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
      };

      return (
        <Popover
          content={
            <div className="w-64">
              <PopoverContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <h4 className="font-medium">
                      {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h4>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-xs">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                      <div key={day} className="p-2 font-medium text-muted-foreground">
                        {day}
                      </div>
                    ))}
                    {generateCalendar().map((date, index) => (
                      <button
                        key={index}
                        onClick={() => date && setSelectedDate(date)}
                        disabled={!date}
                        className={`
                          p-2 text-sm rounded hover:bg-muted
                          ${!date ? 'invisible' : ''}
                          ${selectedDate && date && selectedDate.toDateString() === date.toDateString() 
                            ? 'bg-primary text-primary-foreground' 
                            : ''
                          }
                        `}
                      >
                        {date?.getDate()}
                      </button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </div>
          }
        >
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            {formatDate(selectedDate)}
          </Button>
        </Popover>
      );
    };

    return <DatePickerDemo />;
  }
};

export const FilterMenu: Story = {
  render: () => {
    const FilterMenuDemo = () => {
      const [filters, setFilters] = React.useState({
        status: [] as string[],
        priority: [] as string[],
        assignee: [] as string[]
      });

      const toggleFilter = (category: keyof typeof filters, value: string) => {
        setFilters(prev => ({
          ...prev,
          [category]: prev[category].includes(value)
            ? prev[category].filter(item => item !== value)
            : [...prev[category], value]
        }));
      };

      const getActiveFilterCount = () => {
        return Object.values(filters).flat().length;
      };

      return (
        <Popover
          content={
            <div className="w-72">
              <PopoverHeader>
                <PopoverTitle>Filters</PopoverTitle>
                <PopoverDescription>
                  Filter items by status, priority, and assignee.
                </PopoverDescription>
              </PopoverHeader>
              <PopoverContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Status</h4>
                    <div className="space-y-1">
                      {['Open', 'In Progress', 'Review', 'Closed'].map(status => (
                        <label key={status} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={filters.status.includes(status)}
                            onChange={() => toggleFilter('status', status)}
                          />
                          <span className="text-sm">{status}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Priority</h4>
                    <div className="space-y-1">
                      {['Low', 'Medium', 'High', 'Critical'].map(priority => (
                        <label key={priority} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={filters.priority.includes(priority)}
                            onChange={() => toggleFilter('priority', priority)}
                          />
                          <span className="text-sm">{priority}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Assignee</h4>
                    <div className="space-y-1">
                      {['Alice', 'Bob', 'Charlie', 'Diana'].map(assignee => (
                        <label key={assignee} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={filters.assignee.includes(assignee)}
                            onChange={() => toggleFilter('assignee', assignee)}
                          />
                          <span className="text-sm">{assignee}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </PopoverContent>
              <PopoverFooter>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setFilters({ status: [], priority: [], assignee: [] })}
                >
                  Clear All
                </Button>
                <Button size="sm">Apply Filters</Button>
              </PopoverFooter>
            </div>
          }
        >
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {getActiveFilterCount() > 0 && (
              <span className="ml-2 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                {getActiveFilterCount()}
              </span>
            )}
          </Button>
        </Popover>
      );
    };

    return <FilterMenuDemo />;
  }
};

export const ContextMenu: Story = {
  render: () => (
    <Popover
      content={
        <div className="w-48">
          <PopoverContent className="p-1">
            <div className="space-y-1">
              <button className="w-full text-left px-2 py-1.5 text-sm hover:bg-muted rounded">
                Edit
              </button>
              <button className="w-full text-left px-2 py-1.5 text-sm hover:bg-muted rounded">
                Duplicate
              </button>
              <button className="w-full text-left px-2 py-1.5 text-sm hover:bg-muted rounded">
                Share
              </button>
              <div className="border-t my-1"></div>
              <button className="w-full text-left px-2 py-1.5 text-sm hover:bg-muted rounded">
                Archive
              </button>
              <button className="w-full text-left px-2 py-1.5 text-sm hover:bg-muted rounded text-destructive">
                Delete
              </button>
            </div>
          </PopoverContent>
        </div>
      }
    >
      <Button variant="ghost" size="sm">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </Popover>
  )
};

export const ControlledPopover: Story = {
  render: () => {
    const ControlledDemo = () => {
      const [isOpen, setIsOpen] = React.useState(false);

      return (
        <div className="space-x-2">
          <Popover
            open={isOpen}
            onOpenChange={setIsOpen}
            content={
              <PopoverContent>
                <div className="space-y-2">
                  <p className="text-sm">This is a controlled popover.</p>
                  <Button size="sm" onClick={() => setIsOpen(false)}>
                    Close from inside
                  </Button>
                </div>
              </PopoverContent>
            }
          >
            <Button>Controlled Popover</Button>
          </Popover>
          
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? 'Close' : 'Open'} Externally
          </Button>
        </div>
      );
    };

    return <ControlledDemo />;
  }
};

export const ModalPopover: Story = {
  render: () => (
    <Popover
      modal
      content={
        <div className="w-80">
          <PopoverHeader>
            <PopoverTitle>Modal Popover</PopoverTitle>
            <PopoverDescription>
              This popover is modal and will block interaction with the background.
            </PopoverDescription>
          </PopoverHeader>
          <PopoverContent>
            <p className="text-sm text-muted-foreground">
              Notice the backdrop overlay that prevents interaction with other elements.
            </p>
          </PopoverContent>
          <PopoverFooter>
            <Button size="sm">Got it</Button>
          </PopoverFooter>
        </div>
      }
    >
      <Button>Open Modal Popover</Button>
    </Popover>
  )
}; 