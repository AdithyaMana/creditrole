// src/components/ContributorExamplePage.tsx
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Added ChevronRight
import { iconSet } from '../data/icons';
import { DynamicIcon } from './icons';
import scienceuxLogo from '../assets/scienceux-logo.png';

interface ContributorExamplePageProps {
  onBack: () => void;
  onNext: () => void; // Add onNext prop
}

const exampleProjectData = [
  // ... (data remains the same)
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
  // ... (function remains the same)
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
  onNext, // Destructure onNext
}) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center gap-4">
          <div className="w-full md:w-36">
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
            <p className="text-gray-600 text-sm mt-1">
              Example of icons and roles in a project.
            </p>
          </div>
          {/* Updated this div to include the "See Results" button */}
          <div className="w-full md:w-36 flex justify-end">
            <button
              onClick={onNext}
              className="w-full md:w-auto inline-flex justify-center items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-base transition-all transform hover:scale-105"
            >
              <span>See Results</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
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
              {exampleProjectData.map(item => (
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
      </main>
    </div>
  );
};