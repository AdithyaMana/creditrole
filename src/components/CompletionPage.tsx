// creditrole-main/src/components/CompletionPage.tsx
import React from 'react';
import scienceuxLogo from '../assets/scienceux-logo.png';
import { BarChart, RotateCcw } from 'lucide-react';

interface CompletionPageProps {
  onSeeResults: () => void;
  onRestart: () => void;
}

export const CompletionPage: React.FC<CompletionPageProps> = ({ onSeeResults, onRestart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl mx-auto">
        <img src={scienceuxLogo} alt="ScienceUX Logo" className="h-12 mx-auto mb-8" />

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Survey Complete!
          </h2>
          <div className="text-6xl mb-6">🎉</div>

          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Thank you for your valuable contribution to improving the CRediT taxonomy icons!
            Your feedback will help us create more intuitive visual representations for
            scientific contributions in academic publishing.
          </p>

          <div className="flex justify-center space-x-4">
            <button
              onClick={onRestart}
              className="inline-flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-xl font-semibold text-base transition-all transform hover:scale-105"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Start Over</span>
            </button>
            <button
              onClick={onSeeResults}
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 hover:shadow-xl"
            >
              <BarChart className="w-5 h-5" />
              <span>See Results</span>
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-600 space-y-2">
          <p>
            This research is part of ongoing efforts to standardize visual communication
            in academic publishing and improve researcher recognition systems.
          </p>
          <p className="font-medium">
            For questions about this research, please contact us at <a href="mailto:hello@better.science" className="text-blue-600 hover:underline">hello@better.science</a>.
          </p>
        </div>
      </div>
    </div>
  );
};
