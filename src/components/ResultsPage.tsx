// src/components/ResultsPage.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { SurveyResult } from '../types';
import { iconSet } from '../data/icons';
import { DynamicIcon } from './icons';
import scienceuxLogo from '../assets/scienceux-logo.png';
import { Loader, RotateCcw, ChevronLeft } from 'lucide-react'; // Removed BarChart

interface ResultsPageProps {
  onRestart: () => void;
  onBack: () => void; // Added onBack
  // Removed onSeeExample
}

// A type to structure the grouped results
interface GroupedResults {
  [key: string]: {
    assigned_icon: string;
    selection_count: number;
    shape: string;
  }[];
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  onRestart,
  onBack, // Destructure onBack
  // Removed onSeeExample
}) => {
  const [results, setResults] = useState<GroupedResults>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ... fetchResults logic remains the same
    const fetchResults = async () => {
      const { data, error } = await supabase.rpc('get_top_icons');

      if (error) {
        console.error('Error fetching results:', error);
        setError(
          'Failed to load results. Please make sure the `get_top_icons` function exists in your Supabase project.'
        );
        setLoading(false);
        return;
      }

      if (data) {
        const dataWithShapes = data.map((row: SurveyResult) => {
          const iconDetails = iconSet.find(
            icon => icon.name === row.assigned_icon
          );
          return {
            ...row,
            shape: iconDetails ? iconDetails.shape : 'circle',
          };
        });

        const grouped = dataWithShapes.reduce(
          (acc: GroupedResults, current) => {
            const { role_title } = current;
            if (!acc[role_title]) {
              acc[role_title] = [];
            }
            acc[role_title].push(current);
            return acc;
          },
          {}
        );
        setResults(grouped);
      }
      setLoading(false);
    };

    fetchResults();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="w-full md:w-36 flex items-center justify-between md:justify-start gap-2">
            <button
              onClick={onBack}
              className="inline-flex justify-center items-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-xl font-semibold text-base transition-all transform hover:scale-105"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <button
              onClick={onRestart}
              className="inline-flex justify-center items-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-xl font-semibold text-base transition-all transform hover:scale-105 md:hidden"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Start Over</span>
            </button>
          </div>
          <div className="text-center order-first md:order-none">
            <div className="flex flex-col justify-center items-center space-y-2">
              <img src={scienceuxLogo} alt="ScienceUX Logo" className="h-12" />
              <h1 className="text-3xl font-bold text-gray-900">
                Survey Results
              </h1>
            </div>
            <p className="text-gray-600 text-sm mt-1">
              Top 3 most selected icons for each CRediT role.
            </p>
          </div>
          <div className="hidden md:w-auto md:flex items-center justify-end md:w-36">
            <button
              onClick={onRestart}
              className="inline-flex justify-center items-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-xl font-semibold text-base transition-all transform hover:scale-105"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Start Over</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {loading && (
          <div className="flex justify-center items-center h-64">
            <Loader className="w-12 h-12 text-blue-600 animate-spin" />
            <p className="ml-4 text-lg text-gray-600">Loading results...</p>
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
            <p className="font-bold">An Error Occurred</p>
            <p>{error}</p>
          </div>
        )}
        {!loading && !error && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="w-1/3 px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    CRediT Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Top Icons by Votes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {Object.keys(results)
                  .sort()
                  .map(roleTitle => (
                    <tr
                      key={roleTitle}
                      className="hover:bg-slate-50/50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 align-top">
                        <div className="text-sm font-semibold text-slate-800">
                          {roleTitle}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          {results[roleTitle].map((result, index) => (
                            <div
                              key={index}
                              className="flex flex-col items-center text-center w-16"
                            >
                              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-slate-100 border border-slate-200 text-slate-700">
                                <DynamicIcon
                                  name={result.shape}
                                  className="w-7 h-7"
                                />
                              </div>
                              <div className="text-xs text-slate-500 mt-2 font-medium">
                                {result.selection_count} votes
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- Contact Info Footer --- */}
        {!loading && !error && (
          <div className="text-center mt-12 pt-8 border-t border-gray-200">
            <div className="text-sm text-gray-600 space-y-2">
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
          </div>
        )}
        {/* --- Removed Example CTA --- */}
      </main>
    </div>
  );
};