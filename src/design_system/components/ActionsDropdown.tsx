import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon, Modal } from '../compatibility';
import { DropdownMenu } from '../../design_system_4sale';

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
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 p-0 bg-gray-100 hover:bg-gray-200 rounded-full"
      >
        <Icon name="more-vert" size="small" />
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 z-50 min-w-[280px] bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="py-2">
            <button
              onClick={() => handleAction(onViewDetails)}
              className="w-full flex items-center justify-end gap-3 px-4 py-3 text-right hover:bg-gray-50 text-sm font-medium text-gray-900"
            >
              <span className="font-sakr">{t('actions.viewDetails')}</span>
              <div className="w-6 h-6 flex items-center justify-center">
                <Icon name="eye" size="small" />
              </div>
            </button>

            <button
              onClick={() => handleAction(onAddSpecialPrice)}
              className="w-full flex items-center justify-end gap-3 px-4 py-3 text-right hover:bg-gray-50 text-sm font-medium text-gray-900"
            >
              <span className="font-sakr">{t('actions.addSpecialPrice')}</span>
              <div className="w-6 h-6 flex items-center justify-center">
                <Icon name="plus" size="small" />
              </div>
            </button>

            <button
              onClick={() => handleAction(onMarkRented)}
              className="w-full flex items-center justify-end gap-3 px-4 py-3 text-right hover:bg-gray-50 text-sm font-medium text-gray-900"
            >
              <span className="font-sakr">{t('actions.markRented')}</span>
              <div className="w-6 h-6 flex items-center justify-center">
                <Icon name="check" size="small" />
              </div>
            </button>

            <div className="border-t border-gray-200 my-1" />

            <button
              onClick={() => handleAction(onDelete)}
              className="w-full flex items-center justify-end gap-3 px-4 py-3 text-right hover:bg-red-50 text-sm font-medium text-red-600"
            >
              <span className="font-sakr">{t('actions.delete')}</span>
              <div className="w-6 h-6 flex items-center justify-center">
                <Icon name="delete" size="small" />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}; 