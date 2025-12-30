import React from 'react';
import { 
  // Existing imports
  Lightbulb, Database, Search, Microscope, User, Package, Code, ClipboardCheck, BarChart3, Pen, Edit, DollarSign, Eye, Network, 
  FlaskConical, ClipboardList, Calculator, Sigma, Binary, PenTool, FileText, Keyboard, Scroll, FileCheck, Highlighter, MessageSquareText, Users, Crown, GraduationCap, UserCheck, Briefcase, CalendarCheck, FolderKanban, Map, Ruler, Compass,
  // NEW IMPORTS
  TestTube, Pencil, TextCursorInput, MessagesSquare, UserRound, UserRoundCheck, FolderTree, FolderCog, Inbox, Workflow, GitCompareArrows, Waypoints
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

  // --- TIE-BREAKER ICONS ---
  
  // Investigation
  'search': (props) => <Search {...props} />,
  'flask': (props) => <FlaskConical {...props} />,
  'test-tube': (props) => <TestTube {...props} />, // Replaces test-tube-diagonal
  
  // Formal Analysis
  'calculator': (props) => <Calculator {...props} />,
  'sigma': (props) => <Sigma {...props} />,
  'binary': (props) => <Binary {...props} />,
  // Microscope reused here

  // Writing - Original
  'pen-tool': (props) => <PenTool {...props} />,
  'file-text': (props) => <FileText {...props} />,
  'keyboard': (props) => <Keyboard {...props} />,
  'scroll': (props) => <Scroll {...props} />,
  'pencil': (props) => <Pencil {...props} />,

  // Writing - Review
  'file-check': (props) => <FileCheck {...props} />,
  'highlighter': (props) => <Highlighter {...props} />,
  'message-square-text': (props) => <MessageSquareText {...props} />,
  'messages-square': (props) => <MessagesSquare {...props} />,
  'text-cursor-input': (props) => <TextCursorInput {...props} />,
  'edit': (props) => <Edit {...props} />,

  // Supervision
  'users': (props) => <Users {...props} />,
  'crown': (props) => <Crown {...props} />,
  'grad-cap': (props) => <GraduationCap {...props} />,
  'user-check': (props) => <UserCheck {...props} />,
  'user-round': (props) => <UserRound {...props} />,
  'user-round-check': (props) => <UserRoundCheck {...props} />,

  // Project Admin
  'briefcase': (props) => <Briefcase {...props} />,
  'calendar': (props) => <CalendarCheck {...props} />,
  'kanban': (props) => <FolderKanban {...props} />,
  'folder-tree': (props) => <FolderTree {...props} />,
  'folder-cog': (props) => <FolderCog {...props} />,
  'inbox': (props) => <Inbox {...props} />,
  
  // Methodology
  'map': (props) => <Map {...props} />,
  'ruler': (props) => <Ruler {...props} />,
  'compass': (props) => <Compass {...props} />,
  'workflow': (props) => <Workflow {...props} />,
  'git-compare-arrows': (props) => <GitCompareArrows {...props} />,
  'waypoints': (props) => <Waypoints {...props} />,
};

export const DynamicIcon: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  const IconComponent = iconMap[name];
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in iconMap, using generic fallback.`);
    return <div className={`${className} bg-gray-200 rounded-full`} />;
  }
  return <IconComponent className={className} />;
};