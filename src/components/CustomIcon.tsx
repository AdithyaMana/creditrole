import React, { useEffect, useState } from 'react';

interface CustomIconProps {
  name: string;
  className?: string;
}

export const CustomIcon: React.FC<CustomIconProps> = ({ name, className }) => {
  const [icon, setIcon] = useState<string | null>(null);

  useEffect(() => {
    const importIcon = async () => {
      try {
        const iconModule = await import(`../assets/icons/${name}.svg`);
        setIcon(iconModule.default);
      } catch (error) {
        console.error(`Error loading icon: ${name}`, error);
      }
    };

    importIcon();
  }, [name]);

  if (!icon) {
    return <div className={`w-6 h-6 rounded-full bg-gray-300 ${className}`} />;
  }

  return <img src={icon} alt={name} className={className} />;
};
