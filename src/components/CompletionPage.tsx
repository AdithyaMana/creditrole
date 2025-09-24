import React from 'react';
import { CheckCircle } from 'lucide-react';

export const CompletionPage: React.FC<{}> = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl mx-auto">
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <div className="absolute inset-0 w-24 h-24 bg-green-200 rounded-full mx-auto animate-ping opacity-20"></div>
        </div>

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

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
            <div className="text-sm text-gray-700 space-y-2 text-left">
              <p>• Your responses have been recorded and will be analyzed alongside other participants.</p>
              <p>• The data will help identify which icons are most intuitively understood.</p>
              <p>• Results will contribute to the development of standardized CRediT role icons.</p>
              <p>• Final icon designs will be made available to the academic community.</p>
            </div>
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