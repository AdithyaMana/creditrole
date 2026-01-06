import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { SurveyResult } from '../types';
import { iconSet } from '../data/icons';
import { DynamicIcon } from './icons';
import scienceuxLogo from '../assets/scienceux-logo.png';
import { Loader, RotateCcw, ChevronLeft, Trophy, Users } from 'lucide-react';

// --- Types ---

// Define FieldStats locally to ensure it works even if types.ts isn't updated
interface FieldStats {
  field_of_study: string;
  count: number;
}

interface DemographicItem {
  count: number;
  label: string;
}

interface DemographicsData {
  fields: { field_of_study: string; count: number }[];
  regions: { country_of_residence: string; count: number }[];
  ages: { age: string; count: number }[];
}

interface ResultsPageProps {
  onRestart: () => void;
  onBack: () => void;
}

interface GroupedResults {
  [key: string]: {
    assigned_icon: string;
    selection_count: number;
    shape: string;
  }[];
}

// NEW: Interface for Tie-Breaker Data
interface RankingResult {
  role_title: string;
  icon_name: string;
  first_choice_count: number;
  second_choice_count: number;
}

interface GroupedRankingResults {
  [key: string]: RankingResult[];
}

// --- Helper: Grouping Logic for Fields ---
const mapFieldToCategory = (field: string): string => {
  const categories: { [key: string]: string[] } = {
    'Physical sciences': [
      'Mathematics', 'Logic', 'Statistics', 'Computer Science', // Formal
      'Physics', 'Chemistry', 'Astronomy', 'Materials Science', // Physical
      'Geology', 'Oceanography', 'Meteorology', 'Planetary Science' // Earth
    ],
    'Life sciences': ['Biology', 'Ecology', 'Neuroscience'],
    'Social sciences': ['Psychology', 'Sociology', 'Economics', 'Political Science', 'Anthropology', 'Human Geography'],
    'Applied sciences': ['Engineering', 'Medicine', 'Nursing', 'Agriculture', 'Environmental Engineering'],
    'Interdisciplinary': ['Data Science', 'Biochemistry', 'Biophysics', 'Cognitive Science', 'Environmental Science', 'Biomedical Engineering', 'AI/ML', 'Climate Science']
  };

  for (const [category, fields] of Object.entries(categories)) {
    if (fields.includes(field)) return category;
  }
  return 'Interdisciplinary'; // Fallback for "Other" or unknowns
};

// --- Helper Component: Demographic Card (Standalone) ---
const DemographicCard: React.FC<{ title: string; data: DemographicItem[] }> = ({ title, data }) => {
  const maxCount = Math.max(...data.map(d => d.count), 1); // Avoid divide by zero

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
      </div>
      <div className="p-6">
        {data.length > 0 ? (
          <div className="space-y-3">
            {data.map((item) => {
              const percentage = Math.round((item.count / maxCount) * 100);
              return (
                <div key={item.label} className="w-full">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-gray-700 truncate pr-2" title={item.label}>
                      {item.label}
                    </span>
                    <span className="text-gray-500">
                      {item.count}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-sm h-4 overflow-hidden flex items-center">
                    <div 
                      className="bg-blue-500 h-full transition-all duration-500 rounded-sm" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4 text-sm">No data available.</p>
        )}
      </div>
    </div>
  );
};

export const ResultsPage: React.FC<ResultsPageProps> = ({
  onRestart,
  onBack,
}) => {
  const [results, setResults] = useState<GroupedResults>({});
  const [rankingResults, setRankingResults] = useState<GroupedRankingResults>({});
  
  // State for the three charts
  const [fieldStats, setFieldStats] = useState<DemographicItem[]>([]);
  const [regionStats, setRegionStats] = useState<DemographicItem[]>([]);
  const [ageStats, setAgeStats] = useState<DemographicItem[]>([]);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Top Icons (Original Survey)
        const { data: iconsData, error: iconsError } = await supabase.rpc('get_top_icons');
        if (iconsError) throw iconsError;

        // 2. Fetch Tie-Breaker Data (NEW)
        const { data: rankData, error: rankError } = await supabase.rpc('get_ranking_analytics');
        if (rankError) console.warn("Ranking fetch failed (check SQL function):", rankError);

        // 3. Fetch All Demographics
        const { data: demoData, error: demoError } = await supabase.rpc('get_demographics_summary');
        
        if (demoError) {
            console.warn("Demographics error (ensure function exists):", demoError);
        } else if (demoData) {
            // Process Fields (Grouping)
            const fieldCounts: { [key: string]: number } = {
                'Physical sciences': 0,
                'Life sciences': 0,
                'Applied sciences': 0,
                'Social sciences': 0,
                'Interdisciplinary': 0
            };
            
            // Aggregate raw DB fields into the 5 buckets
            (demoData as DemographicsData).fields.forEach(item => {
                const category = mapFieldToCategory(item.field_of_study);
                if (fieldCounts[category] !== undefined) {
                    fieldCounts[category] += item.count;
                }
            });

            setFieldStats(Object.entries(fieldCounts).map(([label, count]) => ({ label, count })));

            // Process Regions (Direct mapping)
            const regions = (demoData as DemographicsData).regions
                .map(r => ({ label: r.country_of_residence, count: r.count }))
                .sort((a, b) => b.count - a.count);
            setRegionStats(regions);

            // Process Ages (Sort by logical order)
            const ageOrder = ['18-25', '26-35', '36-45', '46-55', '56-65', '66+'];
            const ages = (demoData as DemographicsData).ages
                .map(a => ({ label: a.age, count: a.count }))
                .sort((a, b) => ageOrder.indexOf(a.label) - ageOrder.indexOf(b.label));
            setAgeStats(ages);
        }

        // Process Icons (Original Survey)
        if (iconsData) {
          const dataWithShapes = iconsData.map((row: SurveyResult) => {
            const iconDetails = iconSet.find(
              icon => icon.name === row.assigned_icon
            );
            return {
              ...row,
              shape: iconDetails ? iconDetails.shape : 'circle', // Fallback shape
            };
          });

          const grouped = dataWithShapes.reduce(
            (acc: GroupedResults, current: any) => {
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

        // Process Ranking/Tie-Breaker Data (NEW)
        if (rankData) {
            const groupedRank = (rankData as RankingResult[]).reduce((acc, curr) => {
              if (!acc[curr.role_title]) acc[curr.role_title] = [];
              acc[curr.role_title].push(curr);
              return acc;
            }, {} as GroupedRankingResults);
            setRankingResults(groupedRank);
        }

      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load results.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="w-full md:w-36 flex items-center justify-between md:justify-start gap-2">
            <button
              onClick={onBack}
              className="inline-flex justify-center items-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-xl font-semibold text-base transition-all transform hover:scale-105"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back</span>
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
              Community preferences for CRediT role icons.
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

      <main className="max-w-7xl mx-auto px-4 py-8">
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Column: Data Tables (2/3 width) */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* 1. ORIGINAL SURVEY RESULTS */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-lg font-bold text-gray-800">Top Icon Selections (Original Survey)</h2>
                </div>
                <div className="overflow-x-auto">
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
                                    <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-slate-100 border border-slate-200 text-slate-700 relative">
                                      <DynamicIcon
                                        name={result.shape}
                                        className="w-6 h-6"
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
              </div>

              {/* 2. TIE-BREAKER ANALYSIS (NEW SECTION) */}
              <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-purple-100 bg-purple-50 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <h2 className="text-lg font-bold text-purple-900">Tie-Breaker Analysis (Top 2)</h2>
                </div>
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.keys(rankingResults).sort().map(roleTitle => {
                      // Get only top 2 icons based on first choice votes
                      const topTwo = [...rankingResults[roleTitle]]
                          .sort((a, b) => b.first_choice_count - a.first_choice_count)
                          .slice(0, 2);
                      
                      const maxVotes = Math.max(...topTwo.map(r => r.first_choice_count + r.second_choice_count), 1);

                      return (
                        <div key={roleTitle} className="border border-purple-100 rounded-xl p-4 bg-white shadow-sm">
                           <h3 className="font-bold text-slate-800 mb-4 border-b border-gray-100 pb-2">{roleTitle}</h3>
                           <div className="space-y-4">
                              {topTwo.map((result, idx) => (
                                  <div key={result.icon_name} className="flex items-start gap-3">
                                      <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg border ${idx === 0 ? 'bg-yellow-50 border-yellow-200 text-yellow-600' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                                          <DynamicIcon name={result.icon_name} className="w-5 h-5" />
                                      </div>
                                      <div className="flex-1">
                                          <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-semibold capitalize text-gray-700">{result.icon_name.replace(/-/g, ' ')}</span>
                                            {idx === 0 && <Trophy className="w-3 h-3 text-yellow-500" />}
                                          </div>
                                          
                                          {/* 1st vs 2nd Choice Mini Bars */}
                                          <div className="space-y-1">
                                              <div className="flex items-center text-[10px] gap-2">
                                                  <span className="w-6 font-medium text-green-700">1st</span>
                                                  <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                                                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${(result.first_choice_count / maxVotes) * 100}%` }}></div>
                                                  </div>
                                                  <span className="w-4 text-right text-gray-500">{result.first_choice_count}</span>
                                              </div>
                                              <div className="flex items-center text-[10px] gap-2">
                                                  <span className="w-6 font-medium text-blue-700">2nd</span>
                                                  <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                                                      <div className="bg-blue-400 h-1.5 rounded-full" style={{ width: `${(result.second_choice_count / maxVotes) * 100}%` }}></div>
                                                  </div>
                                                  <span className="w-4 text-right text-gray-500">{result.second_choice_count}</span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              ))}
                           </div>
                        </div>
                      );
                  })}
                </div>
              </div>

            </div>

            {/* Right Column: Demographics Cards (1/3 width) */}
            <div className="lg:col-span-1 flex flex-col gap-8">
              <DemographicCard title="Respondents by Field of Study" data={fieldStats} />
              <DemographicCard title="Respondents by Region" data={regionStats} />
              <DemographicCard title="Respondent Age Distribution" data={ageStats} />
            </div>
          </div>
        )}

        {!loading && !error && (
          <div className="text-center mt-12 pt-8 border-t border-gray-200">
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                This research is part of ongoing efforts to standardize visual
                communication in academic publishing.
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
      </main>
    </div>
  );
};