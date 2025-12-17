// src/App.tsx
import React, { useState } from 'react';
import { UserInfoPage } from './components/UserInfoPage';
import { FlashcardsPage } from './components/FlashcardsPage';
import { SurveyPage } from './components/SurveyPage';
import { CompletionPage } from './components/CompletionPage';
import { ResultsPage } from './components/ResultsPage';
import { ContributorExamplePage } from './components/ContributorExamplePage';
import { RankingSurveyPage } from './components/RankingSurveyPage';
import { SurveyState, UserInfo, CreditRole, IconItem } from './types';

// Local storage keys and helper functions
const STORAGE_KEYS = {
  SURVEY_STATE: 'credit_survey_state',
  USER_INFO: 'credit_survey_user_info',
  SURVEY_DATA: 'credit_survey_data',
};

const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save to storage: ${key}`, e);
  }
};

const loadFromStorage = (key: string) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    console.error(`Failed to load from storage: ${key}`, e);
    return null;
  }
};

const clearStorage = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

function App() {
  const [surveyState, setSurveyState] = useState<SurveyState>(() => {
    const savedState = loadFromStorage(STORAGE_KEYS.SURVEY_STATE);
    const savedUserInfo = loadFromStorage(STORAGE_KEYS.USER_INFO);
    const savedSurveyData = loadFromStorage(STORAGE_KEYS.SURVEY_DATA);

    // If survey was submitted, force to 'completed', 'example', 'results' or 'rankingSurvey' page
    if (savedState?.isSubmitted) {
      const allowedPages = ['completed', 'contributorExample', 'results', 'rankingSurvey'];
      return {
        currentPage: allowedPages.includes(savedState?.currentPage)
          ? savedState.currentPage
          : 'completed',
        isSubmitted: true,
        history: [],
        userInfo: savedUserInfo,
        surveyData: null, // Clear survey data after submission
      };
    }

    return {
      currentPage: savedState?.currentPage || 'userInfo',
      isSubmitted: savedState?.isSubmitted || false,
      history: savedState?.history || [],
      userInfo: savedUserInfo,
      surveyData: savedSurveyData,
    };
  });

  React.useEffect(() => {
    saveToStorage(STORAGE_KEYS.SURVEY_STATE, {
      currentPage: surveyState.currentPage,
      isSubmitted: surveyState.isSubmitted,
      history: surveyState.history,
    });
    if (surveyState.userInfo) {
      saveToStorage(STORAGE_KEYS.USER_INFO, surveyState.userInfo);
    }
    if (surveyState.surveyData) {
      saveToStorage(STORAGE_KEYS.SURVEY_DATA, surveyState.surveyData);
    }
  }, [surveyState]);

  const handleUserInfoSubmit = (userInfo: UserInfo) => {
    setSurveyState(prev => ({ ...prev, currentPage: 'flashcards', userInfo }));
  };

  const handleFlashcardsNext = () => {
    setSurveyState(prev => ({ ...prev, currentPage: 'survey' }));
  };

  const handleBackToUserInfo = () => {
    setSurveyState(prev => ({ ...prev, currentPage: 'userInfo' }));
  };

  const handleBackToFlashcards = () => {
    setSurveyState(prev => ({ ...prev, currentPage: 'flashcards' }));
  };

  const handleBackToCompletion = () => {
    setSurveyState(prev => ({ ...prev, currentPage: 'completed' }));
  };

  const handleCompleteSurvey = () => {
    setSurveyState(prev => ({
      ...prev,
      currentPage: 'completed',
      isSubmitted: true,
      surveyData: undefined,
    }));
    localStorage.removeItem(STORAGE_KEYS.SURVEY_DATA);
  };

  const handleSeeResults = () => {
    setSurveyState(prev => ({ ...prev, currentPage: 'results' }));
  };

  const handleSkipToResults = () => {
    setSurveyState(prev => ({ ...prev, currentPage: 'results' }));
  };

  const handleSeeExample = () => {
    setSurveyState(prev => ({ ...prev, currentPage: 'contributorExample' }));
  };

  const handleRestartSurvey = () => {
    clearStorage();
    setSurveyState({
      currentPage: 'userInfo',
      isSubmitted: false,
      history: [],
    });
  };

  // Handler for the new Tie-Breaker survey
  const handleTakeRankingSurvey = () => {
    const currentUserInfo = surveyState.userInfo || {
      age: 'Returning',
      fieldOfStudy: 'Returning',
      countryOfResidence: 'Returning'
    };

    setSurveyState(prev => ({ 
      ...prev, 
      currentPage: 'rankingSurvey',
      userInfo: currentUserInfo
    }));
  };

  const handleSurveyDataChange = (data: {
    roles: CreditRole[];
    currentIconIndex: number;
    availableIcons: IconItem[];
  }) => {
    setSurveyState(prev => ({ ...prev, surveyData: data }));
  };

  switch (surveyState.currentPage) {
    case 'userInfo':
      return (
        <UserInfoPage 
          onNext={handleUserInfoSubmit} 
          onSkip={handleSkipToResults} 
          onTakeRanking={handleTakeRankingSurvey}
        />
      );

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
          // @ts-expect-error - initialSurveyData inferred type mismatch
          initialSurveyData={surveyState.surveyData}
          onSurveyDataChange={handleSurveyDataChange}
        />
      );

    case 'completed':
      return (
        <CompletionPage
          onSeeResults={handleSeeResults}
          onRestart={handleRestartSurvey}
          onSeeExample={handleSeeExample}
        />
      );

    case 'results':
      return (
        <ResultsPage
          onRestart={handleRestartSurvey}
          onBack={handleBackToCompletion}
        />
      );

    case 'contributorExample':
      return (
        <ContributorExamplePage
          onBack={handleBackToCompletion}
          onNext={handleSeeResults}
        />
      );

    case 'rankingSurvey':
      return (
        <RankingSurveyPage
          userInfo={surveyState.userInfo}
          onBack={() => setSurveyState(prev => ({ ...prev, currentPage: 'userInfo' }))}
          // CHANGE: Now redirects to 'userInfo' (Start) instead of 'completed'
          onComplete={() => setSurveyState(prev => ({ ...prev, currentPage: 'userInfo' }))}
        />
      );

    default:
      return (
        <UserInfoPage 
          onNext={handleUserInfoSubmit} 
          onSkip={handleSkipToResults}
          onTakeRanking={handleTakeRankingSurvey}
        />
      );
  }
}

export default App;