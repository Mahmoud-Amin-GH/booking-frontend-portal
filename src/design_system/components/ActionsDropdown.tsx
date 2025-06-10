import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, IconButton, Menu, MenuItem, Divider } from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';

interface ActionsDropdownProps {
  onViewDetails: () => void;
  onAddSpecialPrice: () => void;
  onMarkRented: () => void;
  onDelete: () => void;
}

export const ActionsDropdown: React.FC<ActionsDropdownProps> = ({
  onViewDetails,
  onAddSpecialPrice,
  onMarkRented,
  onDelete,
}) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action: () => void) => {
    action();
    handleClose();
  };

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Three-dot menu button */}
      <IconButton
        onClick={handleClick}
        sx={{
          width: 32,
          height: 32,
          backgroundColor: '#F7F8FA',
          borderRadius: '50%',
          padding: 0,
          '&:hover': {
            backgroundColor: '#E9EBF2',
          },
        }}
      >
        <MoreVertIcon
          sx={{
            width: 20,
            height: 20,
            color: '#021442',
          }}
        />
      </IconButton>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            boxShadow: '0px 8px 24px 0px rgba(2, 20, 66, 0.12), 0px 0px 0px 1px rgba(233, 235, 242, 1)',
            padding: '8px 0px',
            minWidth: '289px',
            direction: 'rtl', // RTL for Arabic
          },
        }}
      >
        <MenuItem
          onClick={() => handleAction(onViewDetails)}
          sx={{
            padding: '0px 0px 0px 12px',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 1.5,
            height: 48,
            '&:hover': {
              backgroundColor: 'transparent',
            },
          }}
        >
          <Box
            sx={{
              fontFamily: 'SS Sakr Soft',
              fontWeight: 500,
              fontSize: '14px',
              color: '#021442',
              textAlign: 'right',
            }}
          >
            {t('actions.viewDetails')}
          </Box>
          <Box
            sx={{
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Info icon placeholder */}
            <Box
              sx={{
                width: 18,
                height: 22,
                backgroundColor: '#59688E',
                borderRadius: '2px',
              }}
            />
          </Box>
        </MenuItem>

        <MenuItem
          onClick={() => handleAction(onAddSpecialPrice)}
          sx={{
            padding: '0px 0px 0px 12px',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 1.5,
            height: 48,
            '&:hover': {
              backgroundColor: 'transparent',
            },
          }}
        >
          <Box
            sx={{
              fontFamily: 'SS Sakr Soft',
              fontWeight: 500,
              fontSize: '14px',
              color: '#021442',
              textAlign: 'right',
            }}
          >
            {t('actions.addSpecialPrice')}
          </Box>
          <Box
            sx={{
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Calendar plus icon placeholder */}
            <Box
              sx={{
                width: 20,
                height: 22,
                backgroundColor: '#59688E',
                borderRadius: '2px',
              }}
            />
          </Box>
        </MenuItem>

        <MenuItem
          onClick={() => handleAction(onMarkRented)}
          sx={{
            padding: '0px 0px 0px 12px',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 1.5,
            height: 48,
            '&:hover': {
              backgroundColor: 'transparent',
            },
          }}
        >
          <Box
            sx={{
              fontFamily: 'SS Sakr Soft',
              fontWeight: 500,
              fontSize: '14px',
              color: '#021442',
              textAlign: 'right',
            }}
          >
            {t('actions.markRented')}
          </Box>
          <Box
            sx={{
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Calendar check icon placeholder */}
            <Box
              sx={{
                width: 20,
                height: 22,
                backgroundColor: '#59688E',
                borderRadius: '2px',
              }}
            />
          </Box>
        </MenuItem>

        <Divider sx={{ margin: '8px 10px', backgroundColor: '#E9EBF2' }} />

        <MenuItem
          onClick={() => handleAction(onDelete)}
          sx={{
            padding: '0px 0px 0px 12px',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 1.5,
            height: 48,
            '&:hover': {
              backgroundColor: 'transparent',
            },
          }}
        >
          <Box
            sx={{
              fontFamily: 'SS Sakr Soft',
              fontWeight: 500,
              fontSize: '14px',
              color: '#E53217',
              textAlign: 'right',
            }}
          >
            {t('actions.deleteVehicle')}
          </Box>
          <Box
            sx={{
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Delete icon placeholder */}
            <Box
              sx={{
                width: 18,
                height: 21,
                backgroundColor: '#E53217',
                borderRadius: '2px',
              }}
            />
          </Box>
        </MenuItem>
      </Menu>
    </Box>
  );
}; 