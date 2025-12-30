import React, { useState, useMemo } from 'react';
import { ArrowLeft, CheckCircle, RefreshCw, Home, ChevronRight } from 'lucide-react';
import { DynamicIcon } from './icons';
import { UserInfo } from '../types';
import { supabase } from '../supabaseClient';
import scienceuxLogo from '../assets/scienceux-logo.png';
import { shuffleArray } from '../data/icons';

interface RankingSurveyPageProps {
  onBack: () => void;
  onComplete: () => void;
  userInfo?: UserInfo;
}

// Full definitions with the new, relevant icon candidates
const TIE_BREAKER_ROLES = [
  { 
    title: "Investigation", 
    description: "Conducting the research and investigation process, performing experiments, or collecting data.",
    candidates: ["microscope", "flask", "search", "test-tube"] 
  },
  { 
    title: "Formal Analysis", 
    description: "Application of statistical, mathematical, or other formal techniques to analyze or synthesize study data.",
    candidates: ["chart", "calculator", "sigma", "microscope"] 
  },
  { 
    title: "Writing – Original Draft", 
    description: "Writing the initial draft of the published work.",
    candidates: ["pen-tool", "pen", "pencil", "keyboard"] 
  },
  { 
    title: "Writing – Review & Editing", 
    description: "Critical review, commentary, or revision of the work.",
    candidates: ["pen", "text-cursor-input", "message-square-text", "messages-square"] 
  },
  { 
    title: "Supervision", 
    description: "Oversight and leadership for the research activity, including mentorship.",
    candidates: ["eye", "user-round", "user-round-check", "network"] 
  },
  { 
    title: "Project Administration", 
    description: "Management and coordination of the research activity planning and execution.",
    candidates: ["folder-tree", "folder-cog", "inbox", "network"] 
  },
  { 
    title: "Methodology", 
    description: "Development or design of methodology; creation of models.",
    candidates: ["workflow", "git-compare-arrows", "waypoints", "microscope"] 
  }
];

export const RankingSurveyPage: React.FC<RankingSurveyPageProps> = ({ onBack, onComplete, userInfo }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [rankings, setRankings] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const role = TIE_BREAKER_ROLES[currentStep];
  const currentRanked = rankings[role.title] || [];
  
  // Requirement: User must rank ALL candidates (4) to proceed
  const isStepComplete = currentRanked.length === role.candidates.length;

  // Randomize the icons ONLY when the role changes
  const shuffledCandidates = useMemo(() => {
    return shuffleArray([...role.candidates]);
  }, [role.title]);

  const handleToggleIcon = (icon: string) => {
    setRankings(prev => {
      const current = prev[role.title] || [];
      if (current.includes(icon)) {
        return { ...prev, [role.title]: current.filter(i => i !== icon) };
      }
      if (current.length >= 4) return prev;
      return { ...prev, [role.title]: [...current, icon] };
    });
  };

  // Logic for the Back Button (Internal vs External)
  const handleInternalBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    } else {
      onBack(); // Exit to main menu if on the first step
    }
  };

  const handleNext = async () => {
    if (currentStep < TIE_BREAKER_ROLES.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0); 
    } else {
      await submitRankings();
    }
  };

  const submitRankings = async () => {
    if (!userInfo) {
       alert('User information is missing.');
       return;
    }
    
    setIsSubmitting(true);

    try {
      const { data: pData, error: pError } = await supabase.from('survey_participants').insert([{
        age: userInfo.age,
        field_of_study: userInfo.fieldOfStudy,
        country_of_residence: userInfo.countryOfResidence,
      }]).select('id').single();
      
      if (pError) throw pError;

      const { data: sData, error: sError } = await supabase.from('survey_submissions').insert([{
        participant_id: pData.id,
        completion_status: 'completed',
        survey_version: 'tie-breaker-1.0'
      }]).select('id').single();
      
      if (sError) throw sError;

      const rows = Object.entries(rankings).flatMap(([title, icons]) => 
        icons.map((icon, index) => ({
          submission_id: sData.id,
          role_title: title,
          icon_name: icon,
          rank_position: index + 1
        }))
      );

      if (rows.length > 0) {
        const { error: rError } = await supabase.from('ranking_responses').insert(rows);
        if (rError) throw rError;
      }

      setHasFinished(true);

    } catch (err: any) {
      console.error("Submission Error:", err);
      alert(`Error submitting survey: ${err.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to get the dynamic instruction text
  const getHelperText = () => {
    switch (currentRanked.length) {
      case 0:
        return "Tap the icon that fits best";
      case 1:
        return "What's your second favorite?";
      case 2:
        return "What's your third favorite?";
      case 3:
        return "What's your fourth favorite?";
      case 4:
        return "All ranked! Ready for next role.";
      default:
        return "Rankings complete for this role";
    }
  };

  // --- SUCCESS VIEW ---
  if (hasFinished) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Thanks for helping out yet again!
          </h2>
          
          <p className="text-gray-500 mb-8 leading-relaxed">
            Your input on these tie-breakers is incredibly valuable for finalizing the CRediT role icons.
          </p>

          <button
            onClick={onComplete}
            className="w-full py-4 rounded-xl font-bold text-lg bg-yellow-400 text-slate-900 hover:bg-yellow-500 transition-all flex items-center justify-center gap-2 transform hover:scale-105"
          >
            <Home className="w-5 h-5" />
            <span>Return to Start</span>
          </button>
        </div>
      </div>
    );
  }

  // --- SURVEY VIEW ---
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            // UPDATED: Calls handleInternalBack instead of onBack directly
            onClick={handleInternalBack} 
            className="p-2 -ml-2 text-gray-500 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center">
            <img src={scienceuxLogo} alt="Logo" className="h-8 w-auto" />
          </div>
          
          <div className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
            {currentStep + 1} / {TIE_BREAKER_ROLES.length}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full p-4 md:p-6 pb-28">
        
        {/* HEADER ABOVE THE CARD */}
        <h1 className="text-center text-xl md:text-2xl font-bold text-slate-800 mb-6 px-2">
          Which icon fits this scientific role the best?
        </h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8 text-center">
            
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              {role.title}
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-lg mx-auto">
              {role.description}
            </p>

            <div className="h-px bg-gray-100 w-full mb-8" />

            {/* DYNAMIC INSTRUCTION TEXT */}
            <p className={`text-sm font-bold uppercase tracking-wider mb-6 transition-all duration-300 ${isStepComplete ? 'text-green-600 scale-105' : 'text-blue-600'}`}>
              {getHelperText()}
            </p>

            <div className="grid grid-cols-2 gap-4">
              {shuffledCandidates.map(icon => {
                const rank = currentRanked.indexOf(icon) + 1;
                const isSelected = rank > 0;
                
                return (
                  <button
                    key={icon}
                    onClick={() => handleToggleIcon(icon)}
                    className={`
                      relative group p-8 rounded-xl border-2 transition-all duration-200
                      flex flex-col items-center justify-center select-none
                      ${isSelected 
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200 ring-offset-2' 
                        : 'border-gray-100 bg-white hover:border-blue-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm animate-in zoom-in duration-200">
                        {rank}
                      </div>
                    )}
                    
                    <div className={`transform transition-transform duration-200 ${isSelected ? 'scale-110' : 'group-hover:scale-105'}`}>
                      <DynamicIcon 
                        name={icon} 
                        className={`w-16 h-16 ${isSelected ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} 
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleNext}
            // UPDATED: Disabled unless ALL icons (4) are ranked
            disabled={!isStepComplete || isSubmitting}
            className={`
              w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform
              ${isStepComplete
                ? 'bg-yellow-400 text-slate-900 hover:bg-yellow-500 hover:scale-[1.02] shadow-lg' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                {currentStep === TIE_BREAKER_ROLES.length - 1 ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Complete Survey</span>
                  </>
                ) : (
                  <>
                    <span>Next Role</span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};