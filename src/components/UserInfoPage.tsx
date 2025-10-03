import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { UserInfo } from '../types';

interface UserInfoPageProps {
  onNext: (userInfo: UserInfo) => void;
}

const scientificFields = [
  'Biology', 'Chemistry', 'Physics', 'Biochemistry', 'Medical/Medicine',
  'Psychology', 'Environmental Science', 'Computer Science', 'Mathematics',
  'Engineering', 'Neuroscience', 'Genetics', 'Pharmacology', 'Other'
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
    if (!age) newErrors.age = 'Please select an age range';

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="flex justify-center items-center space-x-3 mb-2">
                <img src="src/assets/crediticon.png" alt="CRediT Icon" className="w-20 h-20" />
                <h1 className="text-3xl font-bold text-gray-900">CRediT Icon Survey</h1>
              </div>
              <p className="text-gray-600">
              Creating the IMDb of scientific publishing!
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center"><div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div><span className="ml-2 text-sm font-medium text-blue-600">User Info</span></div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className="flex items-center"><div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">2</div><span className="ml-2 text-sm text-gray-500">Learn CRediT</span></div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className="flex items-center"><div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">3</div><span className="ml-2 text-sm text-gray-500">Survey</span></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-2xl p-10 border border-slate-200">
          <div className="flex flex-col items-center text-center mb-8">
            <img src="src/assets/scienceux-logo.png" alt="ScienceUX Logo" className="h-24" />
            <h2 className="text-3xl font-extrabold text-slate-800 mt-4 mb-2 tracking-tight">Tell Us About Yourself</h2>
            <p className="text-lg text-slate-600">This anonymous data helps us analyze the survey results.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">What is your age range? *</label>
              <select id="age" value={age} onChange={(e) => setAge(e.target.value)} className={`w-full px-4 py-3 border rounded-lg bg-white/50 focus:ring-2 focus:ring-blue-500 transition-colors ${errors.age ? 'border-red-500' : 'border-gray-300'}`}>
                <option value="">Select your age range...</option>
                {ageRanges.map(range => <option key={range} value={range}>{range}</option>)}
              </select>
              {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
            </div>

            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">What is your region? *</label>
              <select id="region" value={region} onChange={(e) => setRegion(e.target.value)} className={`w-full px-4 py-3 border rounded-lg bg-white/50 focus:ring-2 focus:ring-blue-500 transition-colors ${errors.region ? 'border-red-500' : 'border-gray-300'}`}>
                <option value="">Select your region...</option>
                {regions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              {errors.region && !region.trim() && <p className="mt-1 text-sm text-red-600">{errors.region}</p>}
            </div>

            {region === 'Other' && (
              <div>
                <label htmlFor="customRegion" className="block text-sm font-medium text-gray-700 mb-2">Please specify your region *</label>
                <input type="text" id="customRegion" value={customRegion} onChange={(e) => setCustomRegion(e.target.value)} className="w-full px-4 py-3 border rounded-lg bg-white/50 focus:ring-2 focus:ring-blue-500" placeholder="Enter your region" />
                {errors.region && !customRegion.trim() && <p className="mt-1 text-sm text-red-600">{errors.region}</p>}
              </div>
            )}

            <div>
              <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-gray-700 mb-2">What is your primary field of study? *</label>
              <select id="fieldOfStudy" value={fieldOfStudy} onChange={(e) => setFieldOfStudy(e.target.value)} className={`w-full px-4 py-3 border rounded-lg bg-white/50 focus:ring-2 focus:ring-blue-500 transition-colors ${errors.fieldOfStudy ? 'border-red-500' : 'border-gray-300'}`}>
                <option value="">Select your field...</option>
                {scientificFields.map(field => <option key={field} value={field}>{field}</option>)}
              </select>
              {errors.fieldOfStudy && !fieldOfStudy.trim() && <p className="mt-1 text-sm text-red-600">{errors.fieldOfStudy}</p>}
            </div>

            {fieldOfStudy === 'Other' && (
              <div>
                <label htmlFor="customField" className="block text-sm font-medium text-gray-700 mb-2">Please specify your field *</label>
                <input type="text" id="customField" value={customField} onChange={(e) => setCustomField(e.target.value)} className="w-full px-4 py-3 border rounded-lg bg-white/50 focus:ring-2 focus:ring-blue-500" placeholder="e.g., Astrophysics" />
                {errors.fieldOfStudy && !customField.trim() && <p className="mt-1 text-sm text-red-600">{errors.fieldOfStudy}</p>}
              </div>
            )}

            <div className="pt-4">
              <button type="submit" className="w-full inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 hover:shadow-xl">
                <span>Continue to CRediT Overview</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
        <div className="text-center text-sm text-gray-500 mt-8">
          <p>Your information is collected for research purposes only and will be kept confidential.</p>
        </div>
      </div>
    </div>
  );
};