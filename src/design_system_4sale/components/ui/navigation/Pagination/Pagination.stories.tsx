import type { Meta, StoryObj } from '@storybook/react';
import { Pagination } from './Pagination';
import { Button } from '../../core/Button';
import React from 'react';

const meta: Meta<typeof Pagination> = {
  title: 'Navigation/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A pagination component for navigating through multiple pages of content. Supports different sizes, variants, and customizable navigation options.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    currentPage: {
      control: 'number',
      description: 'The current active page'
    },
    totalPages: {
      control: 'number',
      description: 'Total number of pages'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the pagination'
    },
    variant: {
      control: 'select',
      options: ['default', 'outline', 'ghost'],
      description: 'The visual style of the pagination'
    },
    showFirstLast: {
      control: 'boolean',
      description: 'Whether to show first and last page buttons'
    },
    showPrevNext: {
      control: 'boolean',
      description: 'Whether to show previous and next buttons'
    },
    showPageNumbers: {
      control: 'boolean',
      description: 'Whether to show page number buttons'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: (page: number) => console.log('Page changed to:', page)
  }
};

export const WithoutFirstLast: Story = {
  args: {
    currentPage: 5,
    totalPages: 20,
    showFirstLast: false,
    onPageChange: (page: number) => console.log('Page changed to:', page)
  }
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-medium mb-4">Small</h3>
        <Pagination
          currentPage={3}
          totalPages={10}
          size="sm"
          onPageChange={(page) => console.log('Small pagination:', page)}
        />
      </div>
      <div>
        <h3 className="font-medium mb-4">Medium</h3>
        <Pagination
          currentPage={3}
          totalPages={10}
          size="md"
          onPageChange={(page) => console.log('Medium pagination:', page)}
        />
      </div>
      <div>
        <h3 className="font-medium mb-4">Large</h3>
        <Pagination
          currentPage={3}
          totalPages={10}
          size="lg"
          onPageChange={(page) => console.log('Large pagination:', page)}
        />
      </div>
    </div>
  )
};

export const Variants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-medium mb-4">Default</h3>
        <Pagination
          currentPage={3}
          totalPages={10}
          variant="default"
          onPageChange={(page) => console.log('Default pagination:', page)}
        />
      </div>
      <div>
        <h3 className="font-medium mb-4">Outline</h3>
        <Pagination
          currentPage={3}
          totalPages={10}
          variant="outline"
          onPageChange={(page) => console.log('Outline pagination:', page)}
        />
      </div>
      <div>
        <h3 className="font-medium mb-4">Ghost</h3>
        <Pagination
          currentPage={3}
          totalPages={10}
          variant="ghost"
          onPageChange={(page) => console.log('Ghost pagination:', page)}
        />
      </div>
    </div>
  )
};

export const ManyPages: Story = {
  args: {
    currentPage: 15,
    totalPages: 50,
    showFirstLast: true,
    onPageChange: (page: number) => console.log('Page changed to:', page)
  }
};

export const EdgeCases: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-medium mb-4">Single Page</h3>
        <Pagination
          currentPage={1}
          totalPages={1}
          onPageChange={(page) => console.log('Single page:', page)}
        />
      </div>
      <div>
        <h3 className="font-medium mb-4">Two Pages</h3>
        <Pagination
          currentPage={1}
          totalPages={2}
          onPageChange={(page) => console.log('Two pages:', page)}
        />
      </div>
      <div>
        <h3 className="font-medium mb-4">Many Pages (Current: 25/100)</h3>
        <Pagination
          currentPage={25}
          totalPages={100}
          showFirstLast
          onPageChange={(page) => console.log('Many pages:', page)}
        />
      </div>
    </div>
  )
};

export const Controlled: Story = {
  render: () => {
    const ControlledDemo = () => {
      const [currentPage, setCurrentPage] = React.useState(1);
      const [itemsPerPage, setItemsPerPage] = React.useState(10);
      
      const totalItems = 247;
      const totalPages = Math.ceil(totalItems / itemsPerPage);

      const handlePageChange = (page: number) => {
        setCurrentPage(page);
      };

      const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1); // Reset to first page when changing items per page
      };

      return (
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">Items per page:</span>
            <select 
              value={itemsPerPage} 
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="px-3 py-1 border rounded text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            showFirstLast
            onPageChange={handlePageChange}
          />

          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              Go to First
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setCurrentPage(Math.floor(totalPages / 2))}
            >
              Go to Middle
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Go to Last
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Current page: {currentPage}</p>
            <p>Total pages: {totalPages}</p>
            <p>Showing items {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}</p>
          </div>
        </div>
      );
    };

    return <ControlledDemo />;
  }
};

export const DataTable: Story = {
  render: () => {
    const DataTableDemo = () => {
      const [currentPage, setCurrentPage] = React.useState(1);
      const itemsPerPage = 5;
      
      // Sample data
      const allUsers = Array.from({ length: 47 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        role: ['Admin', 'User', 'Editor'][i % 3],
        status: ['Active', 'Inactive'][i % 2]
      }));

      const totalPages = Math.ceil(allUsers.length / itemsPerPage);
      const startIndex = (currentPage - 1) * itemsPerPage;
      const currentUsers = allUsers.slice(startIndex, startIndex + itemsPerPage);

      return (
        <div className="w-full max-w-4xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">User Management</h3>
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, allUsers.length)} of {allUsers.length} users
            </div>
          </div>
          
          {/* Data Table */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => (
                  <tr key={user.id} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/50'}>
                    <td className="px-4 py-3 text-sm">{user.name}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{user.email}</td>
                    <td className="px-4 py-3 text-sm">{user.role}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        user.status === 'Active' 
                          ? 'bg-success/10 text-success' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      );
    };

    return <DataTableDemo />;
  }
};

export const SearchResults: Story = {
  render: () => {
    const SearchDemo = () => {
      const [currentPage, setCurrentPage] = React.useState(1);
      const [searchQuery, setSearchQuery] = React.useState('react components');
      
      const itemsPerPage = 8;
      const totalResults = 156;
      const totalPages = Math.ceil(totalResults / itemsPerPage);

      // Simulate search results
      const results = Array.from({ length: itemsPerPage }, (_, i) => {
        const resultIndex = (currentPage - 1) * itemsPerPage + i + 1;
        return {
          id: resultIndex,
          title: `React Component Library ${resultIndex}`,
          description: `A comprehensive collection of reusable React components for building modern web applications. Result ${resultIndex} of ${totalResults}.`,
          url: `https://example.com/result-${resultIndex}`
        };
      });

      const startIndex = (currentPage - 1) * itemsPerPage;

      return (
        <div className="w-full max-w-2xl space-y-6">
          <div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div className="text-sm text-muted-foreground">
            About {totalResults.toLocaleString()} results for "{searchQuery}" (showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalResults)})
          </div>

          {/* Search Results */}
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result.id} className="border-b pb-4">
                <h3 className="text-lg font-medium text-primary hover:underline cursor-pointer">
                  {result.title}
                </h3>
                <p className="text-sm text-success">{result.url}</p>
                <p className="text-sm text-muted-foreground mt-1">{result.description}</p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            showFirstLast
            onPageChange={setCurrentPage}
          />
        </div>
      );
    };

    return <SearchDemo />;
  }
}; 