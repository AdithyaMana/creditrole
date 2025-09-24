import React from 'react';
import { Lightbulb, Database, Search, Coins, Microscope, GitBranch, User, Package, Code, Sigma, ClipboardCheck, BarChart3, Pen, Edit } from 'lucide-react';
import { CustomIcon } from './CustomIcon';

const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
  'lightbulb': (props) => <Lightbulb {...props} />,
  'database': (props) => <Database {...props} />,
  'magnifying-glass': (props) => <Search {...props} />,
  'coin': (props) => <Coins {...props} />,
  'microscope': (props) => <Microscope {...props} />,
  'workflow': (props) => <GitBranch {...props} />,
  'person': (props) => <User {...props} />,
  'box': (props) => <Package {...props} />,
  'code': (props) => <Code {...props} />,
  'org-chart': (props) => <Sigma {...props} />,
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