import React, { useState, useEffect } from 'react';
import { RoleCard } from './RoleCard';
import { IconDisplay } from './IconDisplay';
import { creditRoles } from '../data/roles';
import { iconSet, shuffleArray } from '../data/icons';
import { CreditRole, IconItem } from '../types';
import { ArrowLeft, CheckCircle, RotateCcw, RefreshCw, ClipboardList } from 'lucide-react';
import { surveyApi, type SurveyResponse as ApiSurveyResponse } from '../services/surveyApi';

interface SurveyPageProps {
  onBack: () => void;
  onComplete: () => void;
  userInfo?: {
    age: string;
    fieldOfStudy: string;
    countryOfResidence: string;
  };
}

export const SurveyPage: React.FC<SurveyPageProps> = ({ 
  onBack, 
  onComplete, 
  userInfo, 
}) => {
  const [roles, setRoles] = useState<CreditRole[]>(() => creditRoles.map(r => ({ ...r, assignedIcon: undefined })));
  const [availableIcons, setAvailableIcons] = useState<IconItem[]>([]);
  const [currentIcon, setCurrentIcon] = useState<IconItem | null>(null);
  const [dragOverRole, setDragOverRole] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setAvailableIcons(shuffleArray(iconSet));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const assignedIconNames = new Set(roles.map(r => r.assignedIcon).filter(Boolean));
    const nextAvailableIcon = availableIcons.find(icon => !assignedIconNames.has(icon.name));
    setCurrentIcon(nextAvailableIcon || null);
  }, [roles, availableIcons]);

  const assignedRolesCount = roles.filter(role => role.assignedIcon).length;
  const progressPercentage = (assignedRolesCount / roles.length) * 100;

  const handleSubmit = () => {
    if (assignedRolesCount < roles.length) {
      alert("Please assign an icon to all roles before submitting.");
      return;
    }
    submitSurveyToBackend();
  };

  const submitSurveyToBackend = async () => {
    if (!userInfo) return alert('User information is missing.');
    setIsSubmitting(true);
    try {
      const responses: ApiSurveyResponse[] = roles
        .filter(role => role.assignedIcon)
        .map((role, index) => ({
          role_title: role.title,
          assigned_icon: role.assignedIcon!,
          response_order: index
        }));
      const submissionData = {
        participant: { 
          age: userInfo.age, 
          field_of_study: userInfo.fieldOfStudy,
          country_of_residence: userInfo.countryOfResidence
        },
        responses
      };
      await surveyApi.submitSurvey(submissionData);
      onComplete();
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('Failed to submit survey. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setRoles(creditRoles.map(r => ({ ...r, assignedIcon: undefined })));
    setAvailableIcons(shuffleArray(iconSet));
  };
  
  const handleDrop = (targetRoleId: number, e: React.DragEvent) => {
    e.preventDefault();
    setDragOverRole(null);

    const droppedIconName = e.dataTransfer.getData('text/plain');
    if (!droppedIconName) return;

    setRoles(currentRoles => {
      const newRoles = [...currentRoles];
      const targetRoleIndex = newRoles.findIndex(r => r.id === targetRoleId);
      if (targetRoleIndex === -1) return currentRoles;

      const sourceRoleIndex = newRoles.findIndex(r => r.assignedIcon === droppedIconName);

      // If the dropped icon was already on another card, that card is now empty.
      if (sourceRoleIndex > -1) {
        newRoles[sourceRoleIndex].assignedIcon = undefined;
      }
      
      // Assign the dropped icon to the target card.
      newRoles[targetRoleIndex].assignedIcon = droppedIconName;

      return newRoles;
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <button onClick={onBack} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"><ArrowLeft className="w-5 h-5" /><span>Back</span></button>
            <div className="text-center">
              <div className="flex justify-center items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center"><ClipboardList className="w-6 h-6 text-white" /></div>
                <h1 className="text-3xl font-bold text-gray-900">CRediT Icon Survey</h1>
              </div>
              <p className="text-gray-600">Drag icons to the roles you think they best represent.</p>
            </div>
            <button onClick={handleReset} className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors px-2 py-1 rounded"><RotateCcw className="w-4 h-4" /><span className="text-sm">Reset</span></button>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center"><div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">✓</div><span className="ml-2 text-sm font-medium text-green-600">User Info</span></div>
                <div className="w-12 h-0.5 bg-green-500"></div>
                <div className="flex items-center"><div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">✓</div><span className="ml-2 text-sm font-medium text-green-600">Learn CRediT</span></div>
                <div className="w-12 h-0.5 bg-green-500"></div>
                <div className="flex items-center"><div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div><span className="ml-2 text-sm font-medium text-blue-600">Survey</span></div>
            </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
          <div className="flex justify-between items-center mb-2"><span className="text-sm font-medium text-gray-700">Roles Assigned: {assignedRolesCount} of {roles.length}</span><span className="text-sm text-gray-500">{Math.round(progressPercentage)}% Complete</span></div>
          <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out" style={{ width: `${progressPercentage}%` }}></div></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1"><div className="sticky top-6 space-y-6">
            {userInfo && (
              <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
                <h3 className="text-sm font-bold text-gray-800 mb-2">Participant Info</h3>
                <div className="text-xs text-gray-600 space-y-1">
                  <p><span className="font-semibold">Age:</span> {userInfo.age}</p>
                   <p><span className="font-semibold">Country:</span> {userInfo.countryOfResidence}</p>
                  <p><span className="font-semibold">Field:</span> {userInfo.fieldOfStudy}</p>
                </div>
              </div>
            )}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <IconDisplay icon={currentIcon} />
            </div>
            <button onClick={handleSubmit} className={`w-full inline-flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-semibold text-lg transition-all transform ${assignedRolesCount === roles.length ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl hover:scale-105' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`} disabled={assignedRolesCount !== roles.length || isSubmitting}>
              {isSubmitting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
              <span>{isSubmitting ? 'Submitting...' : 'Submit Survey'}</span>
            </button>
          </div></div>
          <div className="lg:col-span-2">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"><p className="text-sm text-blue-800"><strong>💡 How to use:</strong> Drag an icon from the left panel and drop it onto a role. To reorder, drag an assigned icon to another role.</p></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((role) => (<RoleCard key={role.id} role={role} onDrop={(e) => handleDrop(role.id, e)} isDragOver={dragOverRole === role.id} onDragOver={(isOver) => setDragOverRole(isOver ? role.id : null)} />))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};