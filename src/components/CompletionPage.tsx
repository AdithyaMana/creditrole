// creditrole-main/src/components/CompletionPage.tsx
import React from 'react';
import scienceuxLogo from '../assets/scienceux-logo.png';
import { BarChart, RotateCcw, Eye } from 'lucide-react'; // Added Eye icon

interface CompletionPageProps {
  onSeeResults: () => void;
  onRestart: () => void;
  onSeeExample: () => void; // Added new prop
}

export const CompletionPage: React.FC<CompletionPageProps> = ({
  onSeeResults,
  onRestart,
  onSeeExample, // Destructure new prop
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl mx-auto">
        <img
          src={scienceuxLogo}
          alt="ScienceUX Logo"
          className="h-12 mx-auto mb-8"
        />

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Survey Complete!
          </h2>
          <div className="text-6xl mb-6">🎉</div>

          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Thank you for your valuable contribution! Your feedback will help us
            create more intuitive visual representations for scientific
            contributions.
          </p>

          {/* Main buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={onRestart}
              className="inline-flex w-full sm:w-auto items-center justify-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-xl font-semibold text-base transition-all transform hover:scale-105"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Start Over</span>
            </button>
            <button
              onClick={onSeeResults}
              className="inline-flex w-full sm:w-auto items-center justify-center space-x-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 hover:shadow-xl"
            >
              <BarChart className="w-5 h-5" />
              <span>See Results</span>
            </button>
          </div>
        </div>

        {/* Contact Info */}
        <div className="text-sm text-gray-600 space-y-2 mb-8">
          <p>
            This research is part of ongoing efforts to standardize visual
            communication in academic publishing and improve researcher
            recognition systems.
          </p>
          <p className="font-medium">
            For questions about this research, please contact us at{' '}
            <a
              href="mailto:info@scienceux.org"
              className="text-blue-600 hover:underline"
            >
              info@scienceux.org
            </a>
            .
          </p>
        </div>

        {/* See Example Section */}
        <div className="max-w-xl mx-auto pt-8 border-t border-gray-200 text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            See CRediT in Action
          </h3>
          <p className="text-gray-600 mb-4 text-sm">
            Want to see how these roles and icons might look in a real project?
          </p>
          <button
            onClick={onSeeExample}
            className="inline-flex items-center space-x-2 bg-blue-100 hover:bg-blue-200 text-blue-800 px-6 py-3 rounded-xl font-semibold text-base transition-all transform hover:scale-105"
          >
            <Eye className="w-5 h-5" />
            <span>CRediT Roles For This Project</span>
          </button>
        </div>
      </div>
    </div>
  );
};