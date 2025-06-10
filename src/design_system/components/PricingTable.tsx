import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { StatusTags } from './StatusTags';
import { CarImageCell } from './CarImageCell';
import { ActionsDropdown } from './ActionsDropdown';
import { VehicleData, generateMockVehicleData, getTotalCounts } from '../../utils/mockPricingData';

export const PricingTable: React.FC = () => {
  const { t } = useTranslation();
  const vehicleData = generateMockVehicleData();
  const { totalStock, totalRented, totalCars } = getTotalCounts(vehicleData);

  const handleViewDetails = (vehicleId: string) => {
    console.log('View details for vehicle:', vehicleId);
  };

  const handleAddSpecialPrice = (vehicleId: string) => {
    console.log('Add special price for vehicle:', vehicleId);
  };

  const handleMarkRented = (vehicleId: string) => {
    console.log('Mark as rented for vehicle:', vehicleId);
  };

  const handleDelete = (vehicleId: string) => {
    console.log('Delete vehicle:', vehicleId);
  };

  return (
    <Box
      sx={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E9EBF2',
        padding: '24px',
        width: '100%',
        direction: 'rtl', // RTL layout for Arabic
      }}
    >
      {/* Header with Total Counts */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          direction: 'rtl',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <StatusTags stockCount={totalStock} rentedCount={totalRented} />
        </Box>
        
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography
            sx={{
              fontFamily: 'SS Sakr Soft',
              fontWeight: 600,
              fontSize: '16px',
              color: '#021442',
            }}
          >
            {`${totalCars} ${t('pricing.totalCars')}`}
          </Typography>
          <Typography
            sx={{
              fontFamily: 'SS Sakr Soft',
              fontWeight: 400,
              fontSize: '14px',
              color: '#59688E',
            }}
          >
            {t('pricing.inStockAndRental')}
          </Typography>
        </Box>
      </Box>

      {/* Table */}
      <Table
        sx={{
          width: '100%',
          '& .MuiTableCell-root': {
            border: 'none',
            padding: '0px',
          },
        }}
      >
        {/* Table Header */}
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: '#F7F8FA',
              height: '56px',
              borderRadius: '8px',
            }}
          >
            {/* Actions Column Header */}
            <TableCell
              sx={{
                width: '48px',
                textAlign: 'center',
                borderTopLeftRadius: '8px',
                borderBottomLeftRadius: '8px',
                backgroundColor: '#F7F8FA',
              }}
            />
            
            {/* Long Term Header */}
            <TableCell
              sx={{
                width: '108px',
                textAlign: 'center',
                backgroundColor: '#F7F8FA',
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontFamily: 'SS Sakr Soft',
                    fontWeight: 600,
                    fontSize: '12px',
                    color: '#021442',
                    lineHeight: 1.33,
                  }}
                >
                  {t('pricing.longTerm')}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'SS Sakr Soft',
                    fontWeight: 400,
                    fontSize: '10px',
                    color: '#59688E',
                    lineHeight: 1.2,
                  }}
                >
                  {t('pricing.kwd')} / {t('pricing.daily')}
                </Typography>
              </Box>
            </TableCell>

            {/* Medium Term Header */}
            <TableCell
              sx={{
                width: '108px',
                textAlign: 'center',
                backgroundColor: '#F7F8FA',
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontFamily: 'SS Sakr Soft',
                    fontWeight: 600,
                    fontSize: '12px',
                    color: '#021442',
                    lineHeight: 1.33,
                  }}
                >
                  {t('pricing.mediumTerm')}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'SS Sakr Soft',
                    fontWeight: 400,
                    fontSize: '10px',
                    color: '#59688E',
                    lineHeight: 1.2,
                  }}
                >
                  {t('pricing.kwd')} / {t('pricing.daily')}
                </Typography>
              </Box>
            </TableCell>

            {/* Short Term Header */}
            <TableCell
              sx={{
                width: '108px',
                textAlign: 'center',
                backgroundColor: '#F7F8FA',
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontFamily: 'SS Sakr Soft',
                    fontWeight: 600,
                    fontSize: '12px',
                    color: '#021442',
                    lineHeight: 1.33,
                  }}
                >
                  {t('pricing.shortTerm')}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'SS Sakr Soft',
                    fontWeight: 400,
                    fontSize: '10px',
                    color: '#59688E',
                    lineHeight: 1.2,
                  }}
                >
                  {t('pricing.kwd')} / {t('pricing.daily')}
                </Typography>
              </Box>
            </TableCell>

            {/* Daily Header */}
            <TableCell
              sx={{
                width: '108px',
                textAlign: 'center',
                backgroundColor: '#F7F8FA',
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontFamily: 'SS Sakr Soft',
                    fontWeight: 600,
                    fontSize: '12px',
                    color: '#021442',
                    lineHeight: 1.33,
                  }}
                >
                  {t('pricing.daily')}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'SS Sakr Soft',
                    fontWeight: 400,
                    fontSize: '10px',
                    color: '#59688E',
                    lineHeight: 1.2,
                  }}
                >
                  {t('pricing.kwd')} / {t('pricing.daily')}
                </Typography>
              </Box>
            </TableCell>

            {/* Allowed KM Header */}
            <TableCell
              sx={{
                width: '135px',
                textAlign: 'center',
                backgroundColor: '#F7F8FA',
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontFamily: 'SS Sakr Soft',
                    fontWeight: 600,
                    fontSize: '12px',
                    color: '#021442',
                    lineHeight: 1.33,
                  }}
                >
                  {t('pricing.allowedKm')}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'SS Sakr Soft',
                    fontWeight: 400,
                    fontSize: '10px',
                    color: '#59688E',
                    lineHeight: 1.2,
                  }}
                >
                  {t('pricing.kmPerDay')}
                </Typography>
              </Box>
            </TableCell>

            {/* Vehicle Header */}
            <TableCell
              sx={{
                width: '243px',
                textAlign: 'center',
                borderTopRightRadius: '8px',
                borderBottomRightRadius: '8px',
                backgroundColor: '#F7F8FA',
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'SS Sakr Soft',
                  fontWeight: 600,
                  fontSize: '12px',
                  color: '#021442',
                  lineHeight: 1.33,
                }}
              >
                {t('pricing.vehicle')}
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>

        {/* Table Body */}
        <TableBody>
          {vehicleData.map((vehicle) => (
            <TableRow
              key={vehicle.id}
              sx={{
                height: '72px',
                borderBottom: '1px solid #E9EBF2',
                '&:last-child': {
                  borderBottom: 'none',
                },
                '&:hover': {
                  backgroundColor: '#F7F8FA',
                },
              }}
            >
              {/* Actions Column */}
              <TableCell
                sx={{
                  width: '48px',
                  textAlign: 'center',
                  padding: '16px 12px',
                }}
              >
                <ActionsDropdown
                  onViewDetails={() => handleViewDetails(vehicle.id)}
                  onAddSpecialPrice={() => handleAddSpecialPrice(vehicle.id)}
                  onMarkRented={() => handleMarkRented(vehicle.id)}
                  onDelete={() => handleDelete(vehicle.id)}
                />
              </TableCell>

              {/* Long Term Price */}
              <TableCell
                sx={{
                  width: '108px',
                  textAlign: 'center',
                  padding: '16px 12px',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'SS Sakr Soft',
                    fontWeight: 600,
                    fontSize: '14px',
                    color: '#021442',
                    lineHeight: 1.43,
                  }}
                >
                  {vehicle.prices.longTerm}
                </Typography>
              </TableCell>

              {/* Medium Term Price */}
              <TableCell
                sx={{
                  width: '108px',
                  textAlign: 'center',
                  padding: '16px 12px',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'SS Sakr Soft',
                    fontWeight: 600,
                    fontSize: '14px',
                    color: '#021442',
                    lineHeight: 1.43,
                  }}
                >
                  {vehicle.prices.mediumTerm}
                </Typography>
              </TableCell>

              {/* Short Term Price */}
              <TableCell
                sx={{
                  width: '108px',
                  textAlign: 'center',
                  padding: '16px 12px',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'SS Sakr Soft',
                    fontWeight: 600,
                    fontSize: '14px',
                    color: '#021442',
                    lineHeight: 1.43,
                  }}
                >
                  {vehicle.prices.shortTerm}
                </Typography>
              </TableCell>

              {/* Daily Price */}
              <TableCell
                sx={{
                  width: '108px',
                  textAlign: 'center',
                  padding: '16px 12px',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'SS Sakr Soft',
                    fontWeight: 600,
                    fontSize: '14px',
                    color: '#021442',
                    lineHeight: 1.43,
                  }}
                >
                  {vehicle.prices.daily}
                </Typography>
              </TableCell>

              {/* Allowed KM */}
              <TableCell
                sx={{
                  width: '135px',
                  textAlign: 'center',
                  padding: '16px 12px',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'SS Sakr Soft',
                    fontWeight: 600,
                    fontSize: '14px',
                    color: '#021442',
                    lineHeight: 1.43,
                  }}
                >
                  {vehicle.allowedKm.daily}
                </Typography>
              </TableCell>

              {/* Vehicle Info */}
              <TableCell
                sx={{
                  width: '243px',
                  padding: '0px',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  <StatusTags stockCount={vehicle.stockCount} rentedCount={vehicle.rentedCount} />
                  <CarImageCell carName={vehicle.name} carImage={vehicle.image} />
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}; 