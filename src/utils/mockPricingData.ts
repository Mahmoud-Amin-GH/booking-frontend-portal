export interface VehicleData {
  id: string;
  name: string;
  image?: string;
  stockCount: number;
  rentedCount: number;
  allowedKm: {
    daily: number;
    shortTerm: number;
    mediumTerm: number;
    longTerm: number;
  };
  prices: {
    daily: number;
    shortTerm: number;
    mediumTerm: number;
    longTerm: number;
  };
}

export const generateMockVehicleData = (): VehicleData[] => [
  {
    id: '1',
    name: 'Chevrolet Spark 2025',
    stockCount: 5,
    rentedCount: 3,
    allowedKm: {
      daily: 150,
      shortTerm: 150,
      mediumTerm: 150,
      longTerm: 150,
    },
    prices: {
      daily: 25,
      shortTerm: 23,
      mediumTerm: 20,
      longTerm: 18,
    },
  },
  {
    id: '2',
    name: 'Honda Civic 2024',
    stockCount: 8,
    rentedCount: 2,
    allowedKm: {
      daily: 200,
      shortTerm: 200,
      mediumTerm: 200,
      longTerm: 200,
    },
    prices: {
      daily: 35,
      shortTerm: 32,
      mediumTerm: 28,
      longTerm: 25,
    },
  },
  {
    id: '3',
    name: 'Toyota Corolla 2024',
    stockCount: 6,
    rentedCount: 4,
    allowedKm: {
      daily: 180,
      shortTerm: 180,
      mediumTerm: 180,
      longTerm: 180,
    },
    prices: {
      daily: 30,
      shortTerm: 28,
      mediumTerm: 25,
      longTerm: 22,
    },
  },
  {
    id: '4',
    name: 'Nissan Altima 2023',
    stockCount: 4,
    rentedCount: 2,
    allowedKm: {
      daily: 220,
      shortTerm: 220,
      mediumTerm: 220,
      longTerm: 220,
    },
    prices: {
      daily: 40,
      shortTerm: 37,
      mediumTerm: 33,
      longTerm: 30,
    },
  },
  {
    id: '5',
    name: 'BMW X3 2024',
    stockCount: 2,
    rentedCount: 1,
    allowedKm: {
      daily: 250,
      shortTerm: 250,
      mediumTerm: 250,
      longTerm: 250,
    },
    prices: {
      daily: 80,
      shortTerm: 75,
      mediumTerm: 70,
      longTerm: 65,
    },
  },
  {
    id: '6',
    name: 'Mercedes C-Class 2023',
    stockCount: 3,
    rentedCount: 2,
    allowedKm: {
      daily: 300,
      shortTerm: 300,
      mediumTerm: 300,
      longTerm: 300,
    },
    prices: {
      daily: 90,
      shortTerm: 85,
      mediumTerm: 80,
      longTerm: 75,
    },
  },
  {
    id: '7',
    name: 'Kia Rio 2024',
    stockCount: 7,
    rentedCount: 1,
    allowedKm: {
      daily: 140,
      shortTerm: 140,
      mediumTerm: 140,
      longTerm: 140,
    },
    prices: {
      daily: 22,
      shortTerm: 20,
      mediumTerm: 18,
      longTerm: 16,
    },
  },
  {
    id: '8',
    name: 'Hyundai Elantra 2024',
    stockCount: 5,
    rentedCount: 3,
    allowedKm: {
      daily: 190,
      shortTerm: 190,
      mediumTerm: 190,
      longTerm: 190,
    },
    prices: {
      daily: 32,
      shortTerm: 30,
      mediumTerm: 27,
      longTerm: 24,
    },
  },
];

export const getTotalCounts = (data: VehicleData[]) => {
  const totalStock = data.reduce((sum, vehicle) => sum + vehicle.stockCount, 0);
  const totalRented = data.reduce((sum, vehicle) => sum + vehicle.rentedCount, 0);
  const totalCars = totalStock + totalRented;
  
  return { totalStock, totalRented, totalCars };
}; 