// src/types.ts
// creditrole-main/src/types.ts
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
  shape:
    | 'circle'
    | 'square'
    | 'triangle'
    | 'diamond'
    | 'hexagon'
    | 'star'
    | 'heart'
    | 'lightbulb'
    | 'gear'
    | 'chart'
    | 'pen'
    | 'eye'
    | 'users'
    | 'search'
    // Add shapes from iconSet
    | 'database'
    | 'magnifying-glass'
    | 'pen-caret'
    | 'microscope'
    | 'network'
    | 'person'
    | 'dollar-sign'
    | 'box'
    | 'code'
    | 'clipboard';
}

export interface SurveyState {
  currentPage:
    | 'userInfo'
    | 'flashcards'
    | 'survey'
    | 'completed'
    | 'results'
    | 'contributorExample'; // Added new page state
  isSubmitted: boolean;
  history: any[]; // Kept as 'any' to avoid breaking changes if structure varies.
  userInfo?: UserInfo;
  surveyData?: {
    roles: CreditRole[];
    currentIconIndex: number;
    availableIcons: IconItem[];
  };
}

export interface UserInfo {
  age: string;
  fieldOfStudy: string;
  countryOfResidence: string;
}

export interface SurveyResult {
  role_title: string;
  assigned_icon: string;
  selection_count: number;
}