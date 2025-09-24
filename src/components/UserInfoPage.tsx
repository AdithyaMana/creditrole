import React, { useState } from 'react';
import { ChevronRight, User, GraduationCap } from 'lucide-react';
import { UserInfo } from '../types';

interface UserInfoPageProps {
  onNext: (userInfo: UserInfo) => void;
}

const scientificFields = [
  'Biochemistry',
  'Biology',
  'Chemistry',
  'Computer Science',
  'Engineering',
  'Environmental Science',
  'Genetics',
  'Mathematics',
  'Medical/Medicine',
  'Neuroscience',
  'Pharmacology',
  'Physics',
  'Psychology',
  'Other'
];

const ageRanges = ['18-25', '26-35', '36-45', '46-55', '56-65', '66+'];
const countries = [
  'Western Europe (France, Germany, Italy, Spain, etc.)',
  'Eastern Europe & Russia (Poland, Hungary, Russia, etc.)',
  'North America (USA, Canada, Mexico)',
  'Latin America & Caribbean (Brazil, Argentina, Chile, etc.)',
  'Middle East & North Africa (MENA) (Egypt, Saudi Arabia, Turkey, etc.)',
  'Sub-Saharan Africa (Nigeria, Kenya, South Africa, etc.)',
  'South Asia (India, Pakistan, Bangladesh, etc.)',
  'East Asia (China, Japan, Korea, Mongolia)',
  'Southeast Asia (Thailand, Vietnam, Philippines, etc.)',
  'Oceania / Pacific (Australia, New Zealand, Fiji, etc.)'
];

export const UserInfoPage: React.FC<UserInfoPageProps> = ({ onNext }) => {
  const [age, setAge] = useState<string>('');
  const [fieldOfStudy, setFieldOfStudy] = useState<string>('');
  const [customField, setCustomField] = useState<string>('');
  const [countryOfResidence, setCountryOfResidence] = useState<string>('');
  const [errors, setErrors] = useState<{ age?: string; fieldOfStudy?: string; country?: string }>({});

  const validateForm = () => {
    const newErrors: { age?: string; fieldOfStudy?: string; country?: string } = {};
    if (!age) newErrors.age = 'Please select an age range';
    if (!countryOfResidence) newErrors.country = 'Please select your country of residence';
    
    const finalField = fieldOfStudy === 'Other' ? customField : fieldOfStudy;
    if (!finalField.trim()) newErrors.fieldOfStudy = 'Please select or enter your field of study';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const finalField = fieldOfStudy === 'Other' ? customField : fieldOfStudy;
      onNext({ age, fieldOfStudy: finalField, countryOfResidence });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-center text-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg md:rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-3xl font-bold text-gray-900">CRediT Icon Survey</h1>
                <p className="text-xs md:text-sm text-gray-600">Help us choose the most intuitive icons</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 md:py-12">
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-center space-x-2 md:space-x-4">
            <div className="flex items-center"><div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div><span className="ml-2 text-xs md:text-sm font-medium text-blue-600">User Info</span></div>
            <div className="w-8 md:w-12 h-0.5 bg-gray-300"></div>
            <div className="flex items-center"><div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">2</div><span className="ml-2 text-xs md:text-sm text-gray-500">Learn CRediT</span></div>
            <div className="w-8 md:w-12 h-0.5 bg-gray-300"></div>
            <div className="flex items-center"><div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">3</div><span className="ml-2 text-xs md:text-sm text-gray-500">Survey</span></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-xl md:shadow-2xl p-6 md:p-10 border border-slate-200">
          <div className="text-center mb-6 md:mb-8">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 md:w-9 md:h-9 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-2 tracking-tight">Tell Us About Yourself</h2>
            <p className="text-base md:text-lg text-slate-600">This anonymous data helps us analyze the survey results.</p>
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
              <label htmlFor="countryOfResidence" className="block text-sm font-medium text-gray-700 mb-2">What is your country of residence? *</label>
              <select id="countryOfResidence" value={countryOfResidence} onChange={(e) => setCountryOfResidence(e.target.value)} className={`w-full px-4 py-3 border rounded-lg bg-white/50 focus:ring-2 focus:ring-blue-500 transition-colors ${errors.country ? 'border-red-500' : 'border-gray-300'}`}>
                <option value="">Select your country...</option>
                {countries.map(country => <option key={country} value={country}>{country}</option>)}
              </select>
              {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
            </div>

            <div>
              <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-gray-700 mb-2">What is your primary field of study? *</label>
              <select id="fieldOfStudy" value={fieldOfStudy} onChange={(e) => setFieldOfStudy(e.target.value)} className={`w-full px-4 py-3 border rounded-lg bg-white/50 focus:ring-2 focus:ring-blue-500 transition-colors ${errors.fieldOfStudy ? 'border-red-500' : 'border-gray-300'}`}>
                <option value="">Select your field...</option>
                {scientificFields.sort((a, b) => a.localeCompare(b)).map(field => <option key={field} value={field}>{field}</option>)}
              </select>
              {errors.fieldOfStudy && !fieldOfStudy && <p className="mt-1 text-sm text-red-600">{errors.fieldOfStudy}</p>}
            </div>

            {fieldOfStudy === 'Other' && (
              <div>
                <label htmlFor="customField" className="block text-sm font-medium text-gray-700 mb-2">Please specify your field *</label>
                <input type="text" id="customField" value={customField} onChange={(e) => setCustomField(e.target.value)} className="w-full px-4 py-3 border rounded-lg bg-white/50 focus:ring-2 focus:ring-blue-500" placeholder="e.g., Astrophysics" />
                {errors.fieldOfStudy && !customField.trim() && <p className="mt-1 text-sm text-red-600">{errors.fieldOfStudy}</p>}
              </div>
            )}

            <div className="pt-4">
              <button type="submit" className="w-full inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-semibold text-base md:text-lg transition-all transform hover:scale-105 hover:shadow-xl">
                <span>Continue to CRediT Overview</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
        <div className="text-center text-xs md:text-sm text-gray-500 mt-6 md:mt-8">
          <p>Your information is collected for research purposes only and will be kept confidential.</p>
        </div>
      </div>
    </div>
  );
};
