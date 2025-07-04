import { useState, useEffect } from 'react';
import { CarApiService } from '../services/carApi';

interface InventoryStatus {
  isLoading: boolean;
  isEmpty: boolean;
  totalCars: number;
  error: string | null;
}

export const useInventoryStatus = (userStatus?: string) => {
  const [status, setStatus] = useState<InventoryStatus>({
    isLoading: true,
    isEmpty: true,
    totalCars: 0,
    error: null,
  });

  const checkInventoryStatus = async () => {
    if (userStatus !== 'active') {
      setStatus(prev => ({ ...prev, isLoading: false, isEmpty: true, totalCars: 0 }));
      return;
    }
    try {
      setStatus(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await CarApiService.getCars({ limit: 1, offset: 0 });
      const totalCars = response.total || 0;
      const isEmpty = totalCars === 0;
      setStatus({
        isLoading: false,
        isEmpty,
        totalCars,
        error: null,
      });
    } catch (error) {
      console.error('Error checking inventory status:', error);
      setStatus(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to check inventory status',
      }));
    }
  };

  useEffect(() => {
    checkInventoryStatus();
    // Only re-run if userStatus changes
  }, [userStatus]);

  const refreshStatus = () => {
    checkInventoryStatus();
  };

  return {
    ...status,
    refreshStatus,
  };
}; 