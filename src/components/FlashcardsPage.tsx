import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, CheckCircle } from 'lucide-react';
import { creditDefinitions } from '../data/creditDefinitions';

interface FlashcardsPageProps {
  onNext: () => void;
  onBack: () => void;
}

export const FlashcardsPage: React.FC<FlashcardsPageProps> = ({ onNext, onBack }) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [viewedCards, setViewedCards] = useState<Set<number>>(new Set([creditDefinitions[0].id]));
  
  const mainCardRef = useRef<HTMLDivElement>(null);

  const currentRole = creditDefinitions[currentCard];
  const isLastCard = currentCard === creditDefinitions.length - 1;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        if (!isLastCard) handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentCard]);

  const updateViewedCards = (index: number) => {
    setViewedCards(prev => new Set(prev).add(creditDefinitions[index].id));
  };
  
  const handleNext = () => {
    if (!isLastCard) {
      const nextIndex = currentCard + 1;
      setCurrentCard(nextIndex);
      updateViewedCards(nextIndex);
    }
  };

  const handlePrevious = () => {
    if (currentCard > 0) {
      const prevIndex = currentCard - 1;
      setCurrentCard(prevIndex);
      updateViewedCards(prevIndex);
    }
  };
  
  const handleCardSelection = (index: number) => {
    setCurrentCard(index);
    updateViewedCards(index);
    mainCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm md:text-base">Back</span>
            </button>
            <div className="text-center">
              <div className="flex justify-center items-center space-x-2 md:space-x-3 mb-1">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg md:rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h1 className="text-xl md:text-3xl font-bold text-gray-900">Learn CRediT Roles</h1>
              </div>
              <p className="hidden md:block text-gray-600">
                Familiarize yourself with the 14 contributor roles
              </p>
            </div>
            <div style={{ width: '80px' }}></div> {/* Spacer */}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        {/* Progress Indicator */}
        <div className="mb-8 md:mb-12">
            <div className="flex items-center justify-center space-x-2 md:space-x-4">
                <div className="flex items-center"><div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">✓</div><span className="ml-2 text-xs md:text-sm font-medium text-green-600">User Info</span></div>
                <div className="w-8 md:w-12 h-0.5 bg-green-500"></div>
                <div className="flex items-center"><div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div><span className="ml-2 text-xs md:text-sm font-medium text-blue-600">Learn CRediT</span></div>
                <div className="w-8 md:w-12 h-0.5 bg-gray-300"></div>
                <div className="flex items-center"><div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">3</div><span className="ml-2 text-xs md:text-sm text-gray-500">Survey</span></div>
            </div>
        </div>
        
        {/* Main Flashcard */}
        <div className="max-w-2xl mx-auto mb-6 md:mb-8" ref={mainCardRef}>
            <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-xl md:shadow-2xl p-6 md:p-10 border border-slate-200 min-h-[18rem] md:min-h-[20rem] flex flex-col justify-center">
                <div key={currentRole.id} className="text-center animate-fade-in">
                    <h2 className="text-2xl md:text-4xl font-extrabold text-slate-800 mb-4 tracking-tight">
                        {currentRole.title}
                    </h2>
                    <p className="text-base md:text-lg text-slate-600 leading-relaxed">
                        {currentRole.description}
                    </p>
                </div>
            </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between max-w-2xl mx-auto mb-10 md:mb-12">
            <button
                onClick={handlePrevious}
                disabled={currentCard === 0}
                className="flex items-center space-x-2 px-4 py-2 md:px-6 md:py-3 rounded-full font-semibold text-slate-700 bg-white shadow-lg border border-slate-200 hover:bg-slate-100 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm md:text-base">Previous</span>
            </button>
            
            {isLastCard ? (
              <button
                onClick={onNext}
                className="flex items-center space-x-2 px-4 py-2 md:px-6 md:py-3 rounded-full font-semibold text-white bg-green-600 shadow-lg hover:bg-green-700 transition-all duration-200"
              >
                <span className="text-sm md:text-base">To Survey</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center space-x-2 px-4 py-2 md:px-6 md:py-3 rounded-full font-semibold text-white bg-blue-600 shadow-lg hover:bg-blue-700 transition-all duration-200"
              >
                <span className="text-sm md:text-base">Next</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
        </div>

        {/* All Cards Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-8 border border-gray-200">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 text-center">All CRediT Roles Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
            {creditDefinitions.map((role, index) => (
              <div
                key={role.id}
                className={`p-3 md:p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ease-in-out hover:shadow-md hover:scale-105 hover:border-blue-400 ${index === currentCard ? 'border-blue-500 bg-blue-100 shadow-sm' : viewedCards.has(role.id) ? 'border-green-300 bg-green-50' : 'border-slate-200 bg-slate-50'}`}
                onClick={() => handleCardSelection(index)}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-gray-900 text-xs md:text-sm">{role.title}</h4>
                  {viewedCards.has(role.id) && (<CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 flex-shrink-0" />)}
                </div>
                <p className="hidden md:block text-xs text-gray-600 line-clamp-2">{role.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-10 md:mt-12 pt-6 md:pt-8 border-t border-gray-200">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">Ready to start?</h3>
            <p className="text-gray-600 mb-6 text-sm md:text-base">You can proceed to the survey at any time.</p>
            <button
                onClick={onNext}
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-semibold text-base md:text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-xl"
            >
                <span>Go to Survey</span>
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
      </div>
      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .animate-fade-in {
            animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
