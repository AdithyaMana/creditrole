import React from 'react';
import { ChevronRight, Users, Target, BarChart3 } from 'lucide-react';

interface LandingPageProps {
  onNext: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNext }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">
                CRediT Icon Survey
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Help us choose the most intuitive icons for scientific contributions in academic publishing
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Target className="w-9 h-9 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Help Us Choose the Best Icons for Scientific Contributions
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
              We're developing new icons to represent the 14 CRediT (Contributor Roles Taxonomy) roles 
              used in academic publishing. Your task is to select the roles that you think best match 
              the presented icons.
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              How the Survey Works
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">View All Roles</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    You'll see all 14 CRediT roles displayed in an organized grid layout
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Select Matching Roles</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    <strong>Click</strong> on the roles that you think best match the presented icon
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Visual Feedback</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Selected roles will be highlighted with clear visual indicators
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Submit Results</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Review your selections and submit when you're satisfied
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Research Impact</h4>
              <p className="text-sm text-gray-600">
                Your feedback helps improve academic publishing standards
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">User-Centered Design</h4>
              <p className="text-sm text-gray-600">
                Icons designed based on real user perceptions and intuition
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Community Driven</h4>
              <p className="text-sm text-gray-600">
                Collaborative effort to enhance scientific communication
              </p>
            </div>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <button
              onClick={onNext}
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-xl"
            >
              <span>Start Survey</span>
              <ChevronRight className="w-5 h-5" />
            </button>
            <p className="text-sm text-gray-500 mt-3">
              Takes approximately 3-5 minutes to complete
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>
            This survey is part of ongoing research to improve the CRediT (Contributor Roles Taxonomy) 
            system used in academic publishing.
          </p>
        </div>
      </div>
    </div>
  );
};