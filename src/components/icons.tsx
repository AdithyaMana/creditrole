import React from 'react';
import { 
  // Existing imports
  Lightbulb, Database, Search, Microscope, User, Package, Code, ClipboardCheck, BarChart3, Pen, Edit, DollarSign, Eye, Network, 
  // NEW IMPORTS for Tie-Breaker
  FlaskConical, ClipboardList, Calculator, Sigma, Binary, PenTool, FileText, Keyboard, Scroll, FileCheck, Highlighter, MessageSquareText, Users, Crown, GraduationCap, UserCheck, Briefcase, CalendarCheck, FolderKanban, Map, Ruler, Compass 
} from 'lucide-react';
import { CustomIcon } from './CustomIcon';

const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
  // --- Original Survey Icons ---
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

  // --- NEW TIE-BREAKER ICONS ---
  // Investigation
  'search': (props) => <Search {...props} />,
  'flask': (props) => <FlaskConical {...props} />,
  'clipboard-list': (props) => <ClipboardList {...props} />,
  
  // Formal Analysis
  'calculator': (props) => <Calculator {...props} />,
  'sigma': (props) => <Sigma {...props} />,
  'binary': (props) => <Binary {...props} />,

  // Writing - Original
  'pen-tool': (props) => <PenTool {...props} />,
  'file-text': (props) => <FileText {...props} />,
  'keyboard': (props) => <Keyboard {...props} />,
  'scroll': (props) => <Scroll {...props} />,

  // Writing - Review
  'file-check': (props) => <FileCheck {...props} />,
  'highlighter': (props) => <Highlighter {...props} />,
  'comments': (props) => <MessageSquareText {...props} />,
  'edit': (props) => <Edit {...props} />,

  // Supervision
  'users': (props) => <Users {...props} />,
  'crown': (props) => <Crown {...props} />,
  'grad-cap': (props) => <GraduationCap {...props} />,
  'user-check': (props) => <UserCheck {...props} />,

  // Project Admin
  'briefcase': (props) => <Briefcase {...props} />,
  'calendar': (props) => <CalendarCheck {...props} />,
  'kanban': (props) => <FolderKanban {...props} />,
  
  // Methodology
  'map': (props) => <Map {...props} />,
  'ruler': (props) => <Ruler {...props} />,
  'compass': (props) => <Compass {...props} />,
};

export const DynamicIcon: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  const IconComponent = iconMap[name];
  if (!IconComponent) {
    // Fallback to prevent crash if a name is missing
    console.warn(`Icon "${name}" not found in iconMap, using generic fallback.`);
    return <div className={`${className} bg-gray-200 rounded-full`} />;
  }
  return <IconComponent className={className} />;
};