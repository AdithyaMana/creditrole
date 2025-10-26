import React from 'react';
import { Lightbulb, Database, Search, Microscope, User, Package, Code, ClipboardCheck, BarChart3, Pen, Edit, DollarSign, Eye, Network } from 'lucide-react';
import { CustomIcon } from './CustomIcon';

const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
  'lightbulb': (props) => <Lightbulb {...props} />,
  'database': (props) => <Database {...props} />,
  'magnifying-glass': (props) => <Search {...props} />,
  'dollar-sign': (props) => <DollarSign {...props} />,
  'microscope': (props) => <Microscope {...props} />,
  'network': (props) => <Network {...props} />,
  'person': (props) => <User {...props} />,
  'box': (props) => <Package {...props} />,
  'code': (props) => <Code {...props} />,
  'eye': (props) => <Eye {...props} />,
  'clipboard': (props) => <ClipboardCheck {...props} />,
  'chart': (props) => <BarChart3 {...props} />,
  'pen': (props) => <Pen {...props} />,
  'pen-caret': (props) => <Edit {...props} />,
};

export const DynamicIcon: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  const IconComponent = iconMap[name];
  if (!IconComponent) {
    return <CustomIcon name={name} className={className} />;
  }
  return <IconComponent className={className} />;
};