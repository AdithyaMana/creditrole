import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { UserInfo } from '../types';
import scienceuxLogo from '../assets/scienceux-logo.png'; // Import the logo

interface UserInfoPageProps {
  onNext: (userInfo: UserInfo) => void;
}

const scientificFields = [
    { label: 'Formal sciences', options: ['Mathematics', 'Logic', 'Statistics', 'Computer Science'] },
    { label: 'Natural sciences (Physical)', options: ['Physics', 'Chemistry', 'Astronomy', 'Materials Science'] },
    { label: 'Natural sciences (Life)', options: ['Biology', 'Ecology', 'Neuroscience'] },
    { label: 'Natural sciences (Earth & Space)', options: ['Geology', 'Oceanography', 'Meteorology', 'Planetary Science'] },
    { label: 'Social sciences', options: ['Psychology', 'Sociology', 'Economics', 'Political Science', 'Anthropology', 'Human Geography'] },
    { label: 'Applied/professional', options: ['Engineering', 'Medicine', 'Nursing', 'Agriculture', 'Environmental Engineering'] },
    { label: 'Interdisciplinary', options: ['Data Science', 'Biochemistry', 'Biophysics', 'Cognitive Science', 'Environmental Science', 'Biomedical Engineering', 'AI/ML', 'Climate Science'] },
    { label: 'Other' }
];

const ageRanges = ['18-25', '26-35', '36-45', '46-55', '56-65', '66+'];
const regions = [
  'Western Europe (France, Germany, Italy, Spain, etc.)',
  'Eastern Europe & Russia (Poland, Hungary, Russia, etc.)',
  'North America (USA, Canada, Mexico)',
  'Latin America & Caribbean (Brazil, Argentina, Chile, etc.)',
  'Middle East & North Africa (MENA) (Egypt, Saudi Arabia, Turkey, etc.)',
  'Sub-Saharan Africa (Nigeria, Kenya, South Africa, etc.)',
  'South Asia (India, Pakistan, Bangladesh, etc.)',
  'East Asia (China, Japan, Korea, Mongolia)',
  'Southeast Asia (Thailand, Vietnam, Philippines, etc.)',
  'Oceania / Pacific (Australia, New Zealand, Fiji, etc.)',
  'Other'
];

export const UserInfoPage: React.FC<UserInfoPageProps> = ({ onNext }) => {
  const [age, setAge] = useState<string>('');
  const [fieldOfStudy, setFieldOfStudy] = useState<string>('');
  const [customField, setCustomField] = useState<string>('');
  const [region, setRegion] = useState<string>('');
  const [customRegion, setCustomRegion] = useState<string>('');
  const [errors, setErrors] = useState<{ age?: string; fieldOfStudy?: string; region?: string }>({});

  const validateForm = () => {
    const newErrors: { age?: string; fieldOfStudy?: string; region?: string } = {};
    if (!age) newErrors.age = 'Please select your age range';

    const finalField = fieldOfStudy === 'Other' ? customField : fieldOfStudy;
    if (!finalField.trim()) newErrors.fieldOfStudy = 'Please select or specify your field of study';

    const finalRegion = region === 'Other' ? customRegion : region;
    if (!finalRegion.trim()) newErrors.region = 'Please select or specify your region';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const finalField = fieldOfStudy === 'Other' ? customField : fieldOfStudy;
      const finalRegion = region === 'Other' ? customRegion : region;
      onNext({ age, fieldOfStudy: finalField, region: finalRegion });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col items-center text-center">
            <img 
              src={scienceuxLogo} 
              alt="Science UX Logo" 
              className="h-12 w-auto mb-3"
            />
            <h1 className="text-2xl font-bold text-slate-800">
              Help choose an icon for each role in science...
            </h1>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center space-x-8 mb-10">
            <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                <span className="font-semibold text-blue-600">Your info</span>
            </div>
            <div className="flex items-center space-x-2 opacity-50">
                <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-bold">2</div>
                <span className="font-semibold text-gray-500">Learn the roles</span>
            </div>
            <div className="flex items-center space-x-2 opacity-50">
                <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-bold">3</div>
                <span className="font-semibold text-gray-500">Pick icons</span>
            </div>
        </div>
        
        <main className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-slate-200">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800">Tell us about yourself</h2>
                <p className="text-slate-500 mt-2">
                    So we can make sure the icons are recognizable across people & cultures. It's anonymous.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-2">What's your age range?</label>
                    <select id="age" value={age} onChange={(e) => setAge(e.target.value)} className={`w-full px-4 py-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-yellow-500 transition-colors ${errors.age ? 'border-red-500' : 'border-gray-300'}`}>
                        <option value="" disabled>Select age range...</option>
                        {ageRanges.map(range => <option key={range} value={range}>{range}</option>)}
                    </select>
                    {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
                </div>

                <div>
                    <label htmlFor="region" className="block text-sm font-semibold text-gray-700 mb-2">What region do you live in?</label>
                    <select id="region" value={region} onChange={(e) => setRegion(e.target.value)} className={`w-full px-4 py-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-yellow-500 transition-colors ${errors.region ? 'border-red-500' : 'border-gray-300'}`}>
                        <option value="" disabled>Select your region...</option>
                        {regions.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    {errors.region && !region.trim() && <p className="mt-1 text-sm text-red-600">{errors.region}</p>}
                </div>
                {region === 'Other' && (
                  <input type="text" value={customRegion} onChange={(e) => setCustomRegion(e.target.value)} className="mt-2 w-full px-4 py-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-yellow-500" placeholder="Please specify your region" />
                )}

                <div>
                    <label htmlFor="fieldOfStudy" className="block text-sm font-semibold text-gray-700 mb-2">What's your primary field of study/work?</label>
                    <select id="fieldOfStudy" value={fieldOfStudy} onChange={(e) => setFieldOfStudy(e.target.value)} className={`w-full px-4 py-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-yellow-500 transition-colors ${errors.fieldOfStudy ? 'border-red-500' : 'border-gray-300'}`}>
                        <option value="" disabled>Select your field...</option>
                        {scientificFields.map(group =>
                            group.options ? (
                                <optgroup label={group.label} key={group.label}>
                                    {group.options.map(field => <option key={field} value={field}>{field}</option>)}
                                </optgroup>
                            ) : (
                                <option key={group.label} value={group.label}>{group.label}</option>
                            )
                        )}
                    </select>
                    {errors.fieldOfStudy && !fieldOfStudy.trim() && <p className="mt-1 text-sm text-red-600">{errors.fieldOfStudy}</p>}
                </div>
                {fieldOfStudy === 'Other' && (
                    <input type="text" value={customField} onChange={(e) => setCustomField(e.target.value)} className="mt-2 w-full px-4 py-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-yellow-500" placeholder="Please specify your field" />
                )}

                <div className="pt-4">
                    <button type="submit" className="w-full inline-flex items-center justify-center space-x-2 bg-yellow-400 hover:bg-yellow-500 text-slate-800 px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105">
                        <span>Learn the roles</span>
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </main>
      </div>
    </div>
  );
};

