export interface CreditRole {
  id: number;
  title: string;
  description: string;
  assignedIcon?: string;
}

export interface IconItem {
  id: string;
  name: string;
  color: string;
  shape: 'circle' | 'square' | 'triangle' | 'diamond' | 'hexagon' | 'star' | 'heart' | 'lightbulb' | 'gear' | 'chart' | 'pen' | 'eye' | 'users' | 'search';
}

export interface SurveyState {
  currentPage: 'userInfo' | 'flashcards' | 'survey' | 'completed';
  isSubmitted: boolean;
  history: CreditRole[][];
  userInfo?: {
    age: string;
    fieldOfStudy: string;
    region: string;
  };
  surveyData?: {
    roles: CreditRole[];
    currentIconIndex: number;
    availableIcons: IconItem[];
  };
}

export interface UserInfo {
  age: string;
  fieldOfStudy: string;
  region: string;
}
