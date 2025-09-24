import React from 'react';
import { CreditRole } from '../types';
import { iconSet } from '../data/icons';
import { DynamicIcon } from './icons';

interface RoleCardProps {
  role: CreditRole;
  isMobile: boolean;
  isSelectedAndReady: boolean;
  onDrop: (e: React.DragEvent) => void;
  onTap: () => void;
  isDragOver: boolean;
  onDragOver: (isOver: boolean) => void;
}

export const RoleCard: React.FC<RoleCardProps> = ({ 
  role, 
  isMobile,
  isSelectedAndReady,
  onDrop, 
  onTap,
  isDragOver, 
  onDragOver,
}) => {
  const assignedIconData = role.assignedIcon 
    ? iconSet.find(icon => icon.name === role.assignedIcon)
    : null;

  const handleDragStart = (e: React.DragEvent) => {
    if (assignedIconData) {
      e.dataTransfer.setData('text/plain', assignedIconData.name);
    }
  };
  
  const cardClasses = isMobile && !assignedIconData && isSelectedAndReady 
    ? 'border-blue-400 bg-blue-50 scale-105'
    : 'border-gray-200';

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border p-4 transition-all duration-200 hover:shadow-md ${isMobile ? 'cursor-pointer' : ''} ${isDragOver ? 'border-blue-400 bg-blue-50 scale-105' : cardClasses}`}
      onDragOver={(e) => { e.preventDefault(); onDragOver(true); }}
      onDragLeave={() => onDragOver(false)}
      onDrop={onDrop}
      onClick={onTap}
    >
      <div 
        className={`w-16 h-16 border-2 border-dashed rounded-lg mb-3 flex items-center justify-center relative transition-all duration-200 ${assignedIconData ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50'}`}
      >
        {assignedIconData ? (
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center bg-white border border-gray-200 text-gray-700"
            draggable={!isMobile}
            onDragStart={handleDragStart}
          >
            <DynamicIcon name={assignedIconData.shape} className="w-6 h-6" />
          </div>
        ) : (
          <div className="text-gray-400 text-xs text-center px-1">
            {isMobile && isSelectedAndReady ? "Tap to assign" : isMobile ? "" : "Drop icon here"}
          </div>
        )}
      </div>
      <h3 className="font-semibold text-gray-900 text-sm mb-2 leading-tight">{role.title}</h3>
      <p className="text-xs text-gray-600 leading-relaxed">{role.description}</p>
    </div>
  );
};