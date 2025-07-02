import React from 'react';
import { render, screen, fireEvent, waitFor } from '../test-utils/test-setup';
import CarAvailability from '../pages/CarAvailability';
import { AvailabilityApi } from '../services/availabilityApi';

// Mock the API
jest.mock('../services/availabilityApi');
const mockAvailabilityApi = AvailabilityApi as jest.Mocked<typeof AvailabilityApi>;

describe('CarAvailability', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup default mock responses
    mockAvailabilityApi.getAvailabilityPeriods.mockResolvedValue([
      {
        id: 1,
        car_id: 1,
        start_date: '2025-07-01',
        end_date: '2025-07-15',
        available_count: 5,
        period_type: 'available',
        reason: null,
        created_by: 1,
        created_at: '2025-07-01T00:00:00Z',
        updated_at: '2025-07-01T00:00:00Z'
      }
    ]);
  });

  it('renders without crashing', async () => {
    render(<CarAvailability />);
    
    // Check for main elements
    expect(screen.getByText(/Car Availability/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(mockAvailabilityApi.getAvailabilityPeriods).toHaveBeenCalled();
    });
  });

  it('displays availability periods after loading', async () => {
    render(<CarAvailability />);
    
    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByText('2025-07-01')).toBeInTheDocument();
      expect(screen.getByText('2025-07-15')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  it('opens add period modal when clicking add button', async () => {
    render(<CarAvailability />);
    
    // Click the add button
    const addButton = screen.getByRole('button', { name: /add period/i });
    fireEvent.click(addButton);
    
    // Check if modal is displayed
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/Add Availability Period/i)).toBeInTheDocument();
  });

  it('handles form submission for new period', async () => {
    mockAvailabilityApi.createAvailabilityPeriod.mockResolvedValue({
      id: 2,
      car_id: 1,
      start_date: '2025-08-01',
      end_date: '2025-08-15',
      available_count: 3,
      period_type: 'available',
      reason: null,
      created_by: 1,
      created_at: '2025-07-01T00:00:00Z',
      updated_at: '2025-07-01T00:00:00Z'
    });

    render(<CarAvailability />);
    
    // Open modal
    const addButton = screen.getByRole('button', { name: /add period/i });
    fireEvent.click(addButton);
    
    // Fill form
    fireEvent.change(screen.getByLabelText(/start date/i), {
      target: { value: '2025-08-01' }
    });
    fireEvent.change(screen.getByLabelText(/end date/i), {
      target: { value: '2025-08-15' }
    });
    fireEvent.change(screen.getByLabelText(/available count/i), {
      target: { value: '3' }
    });
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(submitButton);
    
    // Verify API call
    await waitFor(() => {
      expect(mockAvailabilityApi.createAvailabilityPeriod).toHaveBeenCalledWith({
        car_id: expect.any(Number),
        start_date: '2025-08-01',
        end_date: '2025-08-15',
        available_count: 3,
        period_type: 'available'
      });
    });
  });

  it('shows error message when API call fails', async () => {
    mockAvailabilityApi.getAvailabilityPeriods.mockRejectedValue(new Error('Failed to load'));
    
    render(<CarAvailability />);
    
    await waitFor(() => {
      expect(screen.getByText(/error loading availability periods/i)).toBeInTheDocument();
    });
  });
}); 