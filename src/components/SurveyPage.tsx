
import React, { useState, useEffect } from 'react';
import { RoleCard } from './RoleCard';
import { IconDisplay } from './IconDisplay';
import { creditRoles } from '../data/roles';
import { iconSet, shuffleArray } from '../data/icons';
import { CreditRole, IconItem } from '../types';
import { ArrowLeft, CheckCircle, RotateCcw, RefreshCw, ClipboardList, Undo2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

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
  const [isMobile, setIsMobile] = useState(false);
  const [selectedIconName, setSelectedIconName] = useState<string | null>(null);
  const [assignmentCounter, setAssignmentCounter] = useState(0);
  const [history, setHistory] = useState<CreditRole[][]>([]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setAvailableIcons(shuffleArray(iconSet));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const assignedIconNames = new Set(roles.map(r => r.assignedIcon).filter(Boolean));
    const nextAvailableIcon = availableIcons.find(icon => !assignedIconNames.has(icon.name));
    setCurrentIcon(nextAvailableIcon || null);
  }, [assignmentCounter, availableIcons, roles]);

  const updateRoles = (newRoles: CreditRole[]) => {
    setHistory(prev => [...prev, roles]);
    setRoles(newRoles);
    setAssignmentCounter(c => c + 1);
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const previousRoles = history[history.length - 1];
      setRoles(previousRoles);
      setHistory(prev => prev.slice(0, prev.length - 1));
      setAssignmentCounter(c => c - 1); // Decrement counter on undo
    }
  };

  const assignedRolesCount = roles.filter(role => role.assignedIcon).length;
  const progressPercentage = (assignedRolesCount / roles.length) * 100;

  const submitSurvey = async () => {
    if (!userInfo) {
      alert('User information is missing. Please restart the survey.');
      return;
    }
    setIsSubmitting(true);

    try {
      const { data: pData, error: pError } = await supabase
        .from('survey_participants')
        .insert([{
          age: userInfo.age,
          field_of_study: userInfo.fieldOfStudy,
          country_of_residence: userInfo.countryOfResidence,
        }])
        .select('id')
        .single();
      if (pError) throw pError;

      const { data: sData, error: sError } = await supabase
        .from('survey_submissions')
        .insert([{
          participant_id: pData.id,
          completion_status: 'completed',
          submitted_at: new Date().toISOString()
        }])
        .select('id')
        .single();
      if (sError) throw sError;

      const responsesToInsert = roles
        .filter(role => role.assignedIcon)
        .map((role, index) => ({
          submission_id: sData.id,
          role_title: role.title,
          assigned_icon: role.assignedIcon!,
          response_order: index,
        }));

      const { error: rError } = await supabase.from('survey_responses').insert(responsesToInsert);
      if (rError) throw rError;

      onComplete();
    } catch (error) {
      console.error('Error submitting survey to Supabase:', error);
      alert('Failed to submit survey. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = () => {
    if (assignedRolesCount < roles.length) {
        alert("Please assign an icon to all roles before submitting.");
        return;
    }
    submitSurvey();
  };

  const handleReset = () => {
    updateRoles(creditRoles.map(r => ({ ...r, assignedIcon: undefined })));
    setAvailableIcons(shuffleArray(iconSet));
    setSelectedIconName(null);
    setHistory([]);
  };
  
  const handleDrop = (targetRoleId: number, e: React.DragEvent) => {
    e.preventDefault();
    setDragOverRole(null);

    const droppedIconName = e.dataTransfer.getData('text/plain');
    if (!droppedIconName) return;

    const newRoles = [...roles];
    const targetRoleIndex = newRoles.findIndex(r => r.id === targetRoleId);
    if (targetRoleIndex === -1) return;

    const sourceRoleIndex = newRoles.findIndex(r => r.assignedIcon === droppedIconName);
    if (sourceRoleIndex > -1) {
      newRoles[sourceRoleIndex].assignedIcon = undefined;
    }
    
    newRoles[targetRoleIndex].assignedIcon = droppedIconName;
    updateRoles(newRoles);
  };

  const handleIconSelect = (iconName: string) => {
    setSelectedIconName(prev => (prev === iconName ? null : iconName));
  };

  const handleRoleTap = (tappedRoleId: number) => {
    if (!isMobile || !selectedIconName) return;

    const newRoles = [...roles];
    const targetRoleIndex = newRoles.findIndex(r => r.id === tappedRoleId);
    if (targetRoleIndex === -1) return;
    
    if (newRoles[targetRoleIndex].assignedIcon === selectedIconName) {
      return;
    }

    const sourceRoleIndex = newRoles.findIndex(r => r.assignedIcon === selectedIconName);
    if (sourceRoleIndex > -1) {
      newRoles[sourceRoleIndex].assignedIcon = undefined;
    }
    
    newRoles[targetRoleIndex].assignedIcon = selectedIconName;
    updateRoles(newRoles);
    setSelectedIconName(null);
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
              <p className="text-gray-600">{isMobile ? 'Tap an icon, then tap a role to assign it.' : 'Drag icons to the roles they best represent.'}</p>
            </div>
            <div className="flex items-center space-x-2">
              {history.length > 0 && <button onClick={handleUndo} className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors px-2 py-1 rounded"><Undo2 className="w-4 h-4" /><span className="text-sm">Undo</span></button>}
              <button onClick={handleReset} className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors px-2 py-1 rounded"><RotateCcw className="w-4 h-4" /><span className="text-sm">Reset</span></button>
            </div>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className={'md:col-span-1 sticky top-6 z-10'}>
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <IconDisplay 
                  icon={currentIcon}
                  isMobile={isMobile}
                  selectedIconName={selectedIconName}
                  onSelect={handleIconSelect}
                />
              </div>
              {isMobile && history.length > 0 && (
                <button onClick={handleUndo} className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">
                  <Undo2 className="w-5 h-5" />
                  <span>Undo Last Assignment</span>
                </button>
              )}
            </div>
          </div>
          <div className="md:col-span-2">
            <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6`}><p className="text-sm text-blue-800"><strong>💡 How to use:</strong> {isMobile ? 'Select an icon and then tap on a role to assign it.' : 'Drag an icon from the left panel and drop it onto a role. To reorder, drag an assigned icon to another role.'}</p></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((role) => (
                <RoleCard 
                  key={role.id} 
                  role={role} 
                  onDrop={(e) => handleDrop(role.id, e)} 
                  onTap={() => handleRoleTap(role.id)} 
                  isMobile={isMobile} 
                  isSelected={isMobile && !!selectedIconName}
                  isDragOver={dragOverRole === role.id} 
                  onDragOver={(isOver) => setDragOverRole(isOver ? role.id : null)} 
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
