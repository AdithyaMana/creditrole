import React from 'react';
import { IconItem } from '../types';
import { DynamicIcon } from './icons';

interface IconDisplayProps {
  icon: IconItem | null;
  isMobile: boolean;
  selectedIconName: string | null;
  onSelect: (iconName: string) => void;
}

export const IconDisplay: React.FC<IconDisplayProps> = ({ icon, isMobile, selectedIconName, onSelect }) => {
  if (!icon) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-4xl">🎉</div>
        <p className="mt-2 text-lg font-medium text-gray-700">All Icons Placed!</p>
        <p className="mt-1 text-sm text-gray-500">You're ready to submit the survey.</p>
      </div>
    );
  }

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', icon.name);
  };
  
  const isSelected = selectedIconName === icon.name;

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{isSelected ? "Icon Selected" : "Next Icon"}</h3>
        <p className="text-sm text-gray-600">{isMobile ? "Tap a role on the right to assign" : "Drag this icon to a matching role"}</p>
      </div>
      <div 
        className={`transition-all duration-200 p-2 bg-white rounded-xl ${isMobile ? 'cursor-pointer' : 'cursor-move'} ${isSelected ? 'scale-110 shadow-xl ring-4 ring-blue-500' : 'hover:scale-105'}`}
        draggable={!isMobile}
        onDragStart={handleDragStart}
        onClick={() => isMobile && onSelect(icon.name)}
      >
        <div className="w-20 h-20 rounded-lg flex items-center justify-center bg-white border border-gray-200">
          <DynamicIcon name={icon.shape} className="w-10 h-10 text-gray-700" />
        </div>
      </div>
    </div>
  );
};