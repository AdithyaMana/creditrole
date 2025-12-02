// src/components/ContributorExamplePage.tsx
import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Users, ListFilter } from 'lucide-react';
import { iconSet } from '../data/icons';
import { DynamicIcon } from './icons';
import scienceuxLogo from '../assets/scienceux-logo.png';

interface ContributorExamplePageProps {
  onBack: () => void;
  onNext: () => void;
}

const exampleProjectData = [
  {
    role: 'Conceptualization',
    contributors:
      'Mike Morrison, Michael Lai, Acorn Steed, Adithya Mana, Barry Prendergast, Brian Blais, Celso Júnior, David Green, Divya Koppikar, Jay Patel, Lloyd Gwishiri, Nafisa Mohamed, Philipp Koellinger, Rieke Schäfer, Rowan Cockett, Ryan Molen, Samir Mamdouh, Steve Purves, Swetha Ramaswamy, Thurstan Hethorn',
  },
  { role: 'Data curation', contributors: 'Michael Lai, Rieke Schäfer' },
  { role: 'Formal analysis', contributors: 'Michael Lai, Rieke Schäfer' },
  { role: 'Funding acquisition', contributors: 'N/A' },
  { role: 'Investigation', contributors: 'Mike Morrison, Michael Lai, Rieke Schäfer' },
  {
    role: 'Methodology',
    contributors: 'Mike Morrison, Michael Lai, Swetha Ramaswamy, Rieke Schäfer, Thurstan',
  },
  { role: 'Project administration', contributors: 'Michael Lai' },
  { role: 'Resources', contributors: '' },
  { role: 'Software', contributors: 'Adithya Mana' },
  { role: 'Supervision', contributors: '' },
  { role: 'Validation', contributors: '' },
  { role: 'Visualization', contributors: '' },
  { role: 'Writing – original draft', contributors: '' },
  { role: 'Writing – review & editing', contributors: '' },
];

// Map icon shapes to the roles
const getIconShape = (roleTitle: string) => {
  const titleMap: { [key: string]: string | undefined } = {
    'Data curation': 'Data Curation',
    'Formal analysis': 'Formal Analysis',
    'Funding acquisition': 'Funding Acquisition',
    'Writing – original draft': 'Writing – Original Draft',
    'Writing – review & editing': 'Writing – Review & Editing',
    'Project administration': 'Project Administration',
  };
  const mappedTitle = titleMap[roleTitle] || roleTitle;
  const icon = iconSet.find(i => i.name === mappedTitle);
  return icon ? icon.shape : 'circle';
};

export const ContributorExamplePage: React.FC<ContributorExamplePageProps> = ({
  onBack,
  onNext,
}) => {
  // State to toggle between views. Default is false (Traditional View)
  const [showCreditRoles, setShowCreditRoles] = useState(false);

  // Extract unique contributors for the "Traditional" view
  const uniqueContributors = useMemo(() => {
    const names = new Set<string>();
    exampleProjectData.forEach((item) => {
      if (item.contributors && item.contributors !== 'N/A') {
        item.contributors.split(',').forEach((name) => {
          const trimmed = name.trim();
          if (trimmed) names.add(trimmed);
        });
      }
    });
    return Array.from(names).sort(); // Sort alphabetically
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center gap-4">
          {/* Increased width from w-36 to w-48 to prevent wrapping */}
          <div className="w-full md:w-48">
            <button
              onClick={onBack}
              className="w-full md:w-auto inline-flex justify-center items-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-xl font-semibold text-base transition-all transform hover:scale-105"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
          </div>
          <div className="text-center order-first md:order-none">
            <div className="flex flex-col justify-center items-center space-y-2">
              <img src={scienceuxLogo} alt="ScienceUX Logo" className="h-12" />
              <h1 className="text-3xl font-bold text-gray-900">
                CRediT in Action
              </h1>
            </div>
          </div>
          {/* Increased width from w-36 to w-48 and added whitespace-nowrap */}
          <div className="w-full md:w-48 flex justify-end">
            <button
              onClick={onNext}
              className="w-full md:w-auto inline-flex justify-center items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-base transition-all transform hover:scale-105 whitespace-nowrap"
            >
              <span>See Results</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Toggle Control */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-200 p-1 rounded-xl flex items-center shadow-inner">
            <button
              onClick={() => setShowCreditRoles(false)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                !showCreditRoles
                  ? 'bg-white text-blue-600 shadow-sm scale-100'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Traditional List</span>
            </button>
            <button
              onClick={() => setShowCreditRoles(true)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                showCreditRoles
                  ? 'bg-white text-blue-600 shadow-sm scale-100'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <ListFilter className="w-4 h-4" />
              <span>CRediT Roles</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden transition-all duration-500">
          {!showCreditRoles ? (
            // Traditional View (Pile of names)
            <div className="p-8 md:p-12 text-center animate-fade-in">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">
                  Project Contributors
                </h3>
                <p className="text-gray-800 text-lg md:text-xl leading-loose font-serif">
                  {uniqueContributors.map((name, index) => (
                    <span key={name}>
                      {name}
                      {index < uniqueContributors.length - 1 && ', '}
                    </span>
                  ))}
                </p>
                <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-100 text-sm text-yellow-800 inline-block">
                  <p>
                    In a traditional list, it's hard to tell <strong>who did what</strong>.
                    <br />
                    <span className="font-medium cursor-pointer underline" onClick={() => setShowCreditRoles(true)}>
                      Switch to CRediT view
                    </span>{' '}
                    to see the difference.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // CRediT View (Table)
            <div className="animate-fade-in">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="w-20 px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Icon
                    </th>
                    <th className="w-1/4 px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      CRediT Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Contributors
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {exampleProjectData.map((item) => (
                    <tr
                      key={item.role}
                      className="hover:bg-slate-50/50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 align-top">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-100 border border-slate-200 text-slate-700">
                          <DynamicIcon
                            name={getIconShape(item.role)}
                            className="w-5 h-5"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <div className="text-sm font-semibold text-slate-800">
                          {item.role}
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <div className="text-sm text-slate-700 leading-relaxed">
                          {item.contributors || (
                            <span className="text-slate-400">N/A</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <style>{`
        .animate-fade-in {
            animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};