import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card';
import { Button } from '../../core/Button';
import { Badge } from '../../core/Badge';
import { Heart, Share, MoreHorizontal, Star, MapPin, Calendar } from 'lucide-react';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible card component that serves as a container for content. Supports various layouts, padding options, and interactive states. Can be composed with CardHeader, CardTitle, CardDescription, CardContent, and CardFooter.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'elevated', 'ghost'],
      description: 'The visual variant of the card'
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      description: 'The padding inside the card'
    },
    interactive: {
      control: 'boolean',
      description: 'Makes the card interactive with hover effects'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'This is a basic card with default styling.'
  }
};

export const Variants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-full max-w-4xl">
      <Card variant="default" className="p-6">
        <h3 className="font-semibold mb-2">Default Card</h3>
        <p className="text-muted-foreground">Standard card with border and background.</p>
      </Card>
      <Card variant="outlined" className="p-6">
        <h3 className="font-semibold mb-2">Outlined Card</h3>
        <p className="text-muted-foreground">Card with thicker border for emphasis.</p>
      </Card>
      <Card variant="elevated" className="p-6">
        <h3 className="font-semibold mb-2">Elevated Card</h3>
        <p className="text-muted-foreground">Card with shadow for depth effect.</p>
      </Card>
      <Card variant="ghost" className="p-6">
        <h3 className="font-semibold mb-2">Ghost Card</h3>
        <p className="text-muted-foreground">Minimal card with no border or background.</p>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different visual variants of the card component.'
      }
    }
  }
};

export const PaddingOptions: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 w-full max-w-6xl">
      <Card padding="sm">
        <h3 className="font-semibold mb-2">Small Padding</h3>
        <p className="text-muted-foreground">Compact card with minimal spacing.</p>
      </Card>
      <Card padding="md">
        <h3 className="font-semibold mb-2">Medium Padding</h3>
        <p className="text-muted-foreground">Default padding for most use cases.</p>
      </Card>
      <Card padding="lg">
        <h3 className="font-semibold mb-2">Large Padding</h3>
        <p className="text-muted-foreground">Spacious card with generous padding.</p>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different padding options for various content densities.'
      }
    }
  }
};

export const Interactive: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
      <Card className="p-6">
        <h3 className="font-semibold mb-2">Static Card</h3>
        <p className="text-muted-foreground">This card has no hover effects.</p>
      </Card>
      <Card interactive className="p-6" onClick={() => alert('Card clicked!')}>
        <h3 className="font-semibold mb-2">Interactive Card</h3>
        <p className="text-muted-foreground">This card responds to hover and click.</p>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison between static and interactive cards.'
      }
    }
  }
};

export const BasicComposition: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>
          This is a description that provides additional context about the card content.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the main content area of the card. You can put any content here including text, images, forms, or other components.</p>
      </CardContent>
      <CardFooter>
        <Button variant="primary">Primary Action</Button>
        <Button variant="outline">Secondary</Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Basic card composition using all available card components.'
      }
    }
  }
};

export const ProductCard: Story = {
  render: () => (
    <Card className="w-80" interactive>
      <CardContent className="p-0">
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-t-lg flex items-center justify-center">
          <span className="text-muted-foreground">Product Image</span>
        </div>
      </CardContent>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Premium Headphones</CardTitle>
            <CardDescription>Wireless noise-cancelling headphones</CardDescription>
          </div>
          <Badge variant="success">In Stock</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">$299.99</span>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-warning text-warning" />
            ))}
            <span className="text-sm text-muted-foreground ml-1">(4.8)</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Add to Cart</Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of a product card with image, rating, and actions.'
      }
    }
  }
};

export const UserProfileCard: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">
          JD
        </div>
        <CardTitle>John Doe</CardTitle>
        <CardDescription>Senior Frontend Developer</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>San Francisco, CA</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Joined March 2020</span>
          </div>
        </div>
        <div className="mt-4 flex space-x-2">
          <Badge variant="secondary">React</Badge>
          <Badge variant="secondary">TypeScript</Badge>
          <Badge variant="secondary">Node.js</Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="primary" className="flex-1">
          <Heart className="h-4 w-4 mr-2" />
          Follow
        </Button>
        <Button variant="outline" size="sm">
          <Share className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of a user profile card with avatar, info, and social actions.'
      }
    }
  }
};

export const StatisticsCard: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 w-full max-w-4xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v20m9-9H3" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$45,231.89</div>
          <p className="text-xs text-muted-foreground">+20.1% from last month</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
          <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+2350</div>
          <p className="text-xs text-muted-foreground">+180.1% from last month</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sales</CardTitle>
          <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+12,234</div>
          <p className="text-xs text-muted-foreground">+19% from last month</p>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of statistics cards commonly used in dashboards.'
      }
    }
  }
};

export const ArticleCard: Story = {
  render: () => (
    <Card className="w-96" interactive>
      <CardContent className="p-0">
        <div className="aspect-video bg-gradient-to-br from-warning/20 to-energy/20 rounded-t-lg flex items-center justify-center">
          <span className="text-muted-foreground">Article Image</span>
        </div>
      </CardContent>
      <CardHeader>
        <div className="flex items-center space-x-2 mb-2">
          <Badge variant="outline">Technology</Badge>
          <span className="text-sm text-muted-foreground">5 min read</span>
        </div>
        <CardTitle className="text-xl">The Future of Web Development</CardTitle>
        <CardDescription>
          Exploring the latest trends and technologies that are shaping the future of web development in 2024 and beyond.
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
            A
          </div>
          <div>
            <p className="text-sm font-medium">Alex Johnson</p>
            <p className="text-xs text-muted-foreground">Dec 15, 2023</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm">
            <Heart className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Share className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of an article/blog post card with author info and actions.'
      }
    }
  }
};

export const CustomStyling: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
      <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">Gradient Card</CardTitle>
          <CardDescription>Custom background with gradient colors</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card uses custom styling with gradient background.</p>
        </CardContent>
      </Card>
      
      <Card className="border-2 border-dashed border-muted-foreground/30">
        <CardHeader>
          <CardTitle>Dashed Border</CardTitle>
          <CardDescription>Custom border styling</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card has a custom dashed border style.</p>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Examples of custom styling using className overrides.'
      }
    }
  }
}; 