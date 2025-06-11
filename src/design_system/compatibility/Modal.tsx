import React from 'react';
import { Modal as FourSaleModal } from '../../design_system_4sale';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  actions,
  size = 'md',
  className = ''
}) => {
  return (
    <FourSaleModal
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      className={className}
    >
      <div className="p-6">
        {title && (
          <h2 className="text-lg font-semibold mb-4">{title}</h2>
        )}
        
        <div className="mb-6">
          {children}
        </div>
        
        {actions && (
          <div className="flex justify-end border-t pt-4">
            {actions}
          </div>
        )}
      </div>
    </FourSaleModal>
  );
}; 