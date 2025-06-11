import React from 'react';
import { Typography } from '../index';

interface CarImageCellProps {
  carName: string;
  carImage: string;
}

export const CarImageCell: React.FC<CarImageCellProps> = ({
  carName,
  carImage,
}) => {
  return (
    <div className="flex items-center gap-3 p-3">
      {/* Car Image */}
      <div className="w-12 h-12 flex-shrink-0">
        <img
          src={carImage}
          alt={carName}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Car Name */}
      <Typography
        variant="body-medium"
        className="font-semibold text-gray-900 text-right font-sakr"
      >
        {carName}
      </Typography>
    </div>
  );
}; 