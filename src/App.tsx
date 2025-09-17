import React, { useState } from 'react';
import { UserInfoPage } from './components/UserInfoPage';
import { FlashcardsPage } from './components/FlashcardsPage';
import { SurveyPage } from './components/SurveyPage';
import { CompletionPage } from './components/CompletionPage';
import { SurveyState, UserInfo, CreditRole, IconItem } from './types';

// Local storage keys
const STORAGE_KEYS = {
  SURVEY_STATE: 'credit_survey_state',
  USER_INFO: 'credit_survey_user_info',
  SURVEY_DATA: 'credit_survey_data'
};

// Helper functions for localStorage
const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
};

const loadFromStorage = (key: string) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.warn('Failed to load from localStorage:', error);
    return null;
  }
};

const clearStorage = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

function App() {
  // Initialize state from localStorage or defaults
  const [surveyState, setSurveyState] = useState<SurveyState>(() => {
    const savedState = loadFromStorage(STORAGE_KEYS.SURVEY_STATE);
    const savedUserInfo = loadFromStorage(STORAGE_KEYS.USER_INFO);
    const savedSurveyData = loadFromStorage(STORAGE_KEYS.SURVEY_DATA);
    
    return {
      currentPage: savedState?.currentPage || 'userInfo',
      isSubmitted: savedState?.isSubmitted || false,
      history: savedState?.history || [],
      userInfo: savedUserInfo,
      surveyData: savedSurveyData
    };
  });

  // Save state to localStorage whenever it changes
  React.useEffect(() => {
    saveToStorage(STORAGE_KEYS.SURVEY_STATE, {
      currentPage: surveyState.currentPage,
      isSubmitted: surveyState.isSubmitted,
      history: surveyState.history
    });
    
    if (surveyState.userInfo) {
      saveToStorage(STORAGE_KEYS.USER_INFO, surveyState.userInfo);
    }
    
    if (surveyState.surveyData) {
      saveToStorage(STORAGE_KEYS.SURVEY_DATA, surveyState.surveyData);
    }
  }, [surveyState]);

  const handleUserInfoSubmit = (userInfo: UserInfo) => {
    setSurveyState(prev => ({
      ...prev,
      currentPage: 'flashcards',
      userInfo
    }));
  };

  const handleFlashcardsNext = () => {
    setSurveyState(prev => ({
      ...prev,
      currentPage: 'survey'
    }));
  };

  const handleBackToUserInfo = () => {
    setSurveyState(prev => ({
      ...prev,
      currentPage: 'userInfo'
    }));
  };

  const handleBackToFlashcards = () => {
    setSurveyState(prev => ({
      ...prev,
      currentPage: 'flashcards'
    }));
  };

  const handleCompleteSurvey = () => {
    setSurveyState(prev => ({
      ...prev,
      currentPage: 'completed',
      isSubmitted: true
    }));
  };

  const handleRestartSurvey = () => {
    clearStorage();
    setSurveyState({
      currentPage: 'userInfo',
      isSubmitted: false,
      history: []
    });
  };

  const handleSurveyDataChange = (data: {
    roles: CreditRole[];
    currentIconIndex: number;
    availableIcons: IconItem[];
  }) => {
    setSurveyState(prev => ({
      ...prev,
      surveyData: data
    }));
  };

  // Render current page based on state
  switch (surveyState.currentPage) {
    case 'userInfo':
      return <UserInfoPage onNext={handleUserInfoSubmit} />;
    
    case 'flashcards':
      return (
        <FlashcardsPage 
          onNext={handleFlashcardsNext}
          onBack={handleBackToUserInfo}
        />
      );
    
    case 'survey':
      return (
        <SurveyPage 
          onBack={handleBackToFlashcards}
          onComplete={handleCompleteSurvey}
          userInfo={surveyState.userInfo}
          initialSurveyData={surveyState.surveyData}
          onSurveyDataChange={handleSurveyDataChange}
        />
      );
    
    case 'completed':
      return <CompletionPage onRestart={handleRestartSurvey} />;
    
    default:
      return <UserInfoPage onNext={handleUserInfoSubmit} />;
  }
}

export default App;