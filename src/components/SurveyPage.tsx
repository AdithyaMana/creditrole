import React, { useState, useEffect } from 'react';
import { RoleCard } from './RoleCard';
import { IconDisplay } from './IconDisplay';
import { creditRoles } from '../data/roles';
import { iconSet } from '../data/icons';
import { CreditRole, IconItem, UserInfo } from '../types';
import { ArrowLeft, CheckCircle, RotateCcw, RefreshCw, ClipboardList, Undo2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};

interface SurveyPageProps {
  onBack: () => void;
  onComplete: () => void;
  userInfo?: UserInfo;
}

export const SurveyPage: React.FC<SurveyPageProps> = ({ 
  onBack, 
  onComplete, 
  userInfo, 
}) => {
  const [roles, setRoles] = useState<CreditRole[]>(() => creditRoles.map(r => ({ ...r, assignedIcon: undefined })));
  const [history, setHistory] = useState<CreditRole[][]>([]);
  const [dragOverRole, setDragOverRole] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedIconName, setSelectedIconName] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const assignedRolesCount = roles.filter(role => role.assignedIcon).length;
  const progressPercentage = (assignedRolesCount / roles.length) * 100;
  
  const assignedIconNames = new Set(roles.map(r => r.assignedIcon).filter(Boolean));
  const unassignedIcons = iconSet.filter(icon => !assignedIconNames.has(icon.name));
  const currentIcon = unassignedIcons[0] || null;

  const handleSubmit = () => {
    if (assignedRolesCount < roles.length) {
      alert("Please assign an icon to all roles before submitting.");
      return;
    }
    submitSurvey();
  };

  const submitSurvey = async () => {
    if (!userInfo) return alert('User information is missing.');
    setIsSubmitting(true);
    try {
      const { data: pData, error: pError } = await supabase.from('survey_participants').insert([{
        age: userInfo.age,
        field_of_study: userInfo.fieldOfStudy,
        country_of_residence: userInfo.countryOfResidence,
      }]).select('id').single();
      if (pError) throw pError;

      const { data: sData, error: sError } = await supabase.from('survey_submissions').insert([{
        participant_id: pData.id,
        completion_status: 'completed',
        submitted_at: new Date().toISOString()
      }]).select('id').single();
      if (sError) throw sError;
      
      const responsesToInsert = roles.filter(r => r.assignedIcon).map((role, index) => ({
        submission_id: sData.id,
        role_title: role.title,
        assigned_icon: role.assignedIcon!,
        response_order: index,
      }));
      const { error: rError } = await supabase.from('survey_responses').insert(responsesToInsert);
      if (rError) throw rError;

      onComplete();
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('Failed to submit survey.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setRoles(creditRoles.map(r => ({ ...r, assignedIcon: undefined })));
    setHistory([]);
    setSelectedIconName(null);
  };

  const updateRolesAndHistory = (newRoles: CreditRole[]) => {
    setHistory(prev => [...prev, roles]);
    setRoles(newRoles);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const lastState = history[history.length - 1];
    setRoles(lastState);
    setHistory(prev => prev.slice(0, -1));
    setSelectedIconName(null);
  };

  const assignIconToRole = (iconName: string, roleId: number) => {
    const newRoles = roles.map(r => ({...r}));
    const targetRole = newRoles.find(r => r.id === roleId);
    if (!targetRole || (isMobile && targetRole.assignedIcon)) return;

    const sourceRole = newRoles.find(r => r.assignedIcon === iconName);
    if (sourceRole) sourceRole.assignedIcon = undefined;
    
    targetRole.assignedIcon = iconName;
    updateRolesAndHistory(newRoles);
    setSelectedIconName(null);
  };

  const handleDrop = (targetRoleId: number, e: React.DragEvent) => {
    e.preventDefault();
    setDragOverRole(null);
    const droppedIconName = e.dataTransfer.getData('text/plain');
    if (droppedIconName) {
      assignIconToRole(droppedIconName, targetRoleId);
    }
  };

  const handleIconSelect = (iconName: string) => {
    setSelectedIconName(current => (current === iconName ? null : iconName));
  };
  
  const handleRoleTap = (tappedRoleId: number) => {
    if (isMobile && selectedIconName) {
      assignIconToRole(selectedIconName, tappedRoleId);
    }
  };

  const PageHeader = () => (
    <>
      <div className="mb-6 md:mb-8">
        <div className="flex items-center justify-center space-x-2 md:space-x-4">
          <div className="flex items-center"><div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">✓</div><span className="ml-2 text-xs md:text-sm font-medium text-green-600">User Info</span></div>
          <div className="w-8 md:w-12 h-0.5 bg-green-500"></div>
          <div className="flex items-center"><div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">✓</div><span className="ml-2 text-xs md:text-sm font-medium text-green-600">Learn CRediT</span></div>
          <div className="w-8 md:w-12 h-0.5 bg-green-500"></div>
          <div className="flex items-center"><div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div><span className="ml-2 text-xs md:text-sm font-medium text-blue-600">Survey</span></div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
        <div className="flex justify-between items-center mb-2"><span className="text-sm font-medium text-gray-700">Roles Assigned: {assignedRolesCount} of {roles.length}</span><span className="text-sm text-gray-500">{Math.round(progressPercentage)}% Complete</span></div>
        <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out" style={{ width: `${progressPercentage}%` }}></div></div>
      </div>
    </>
  );
  
  const RolesGrid = () => (
     <div className="lg:col-span-2">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
                <strong>💡 How to use:</strong> {isMobile ? "Tap an icon to select it, then tap an empty role card to assign it." : "Drag an icon from the left and drop it onto a role. To reorder, drag an assigned icon to another role."}
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map((role) => (
            <RoleCard 
              key={role.id} 
              role={role} 
              onDrop={(e) => handleDrop(role.id, e)} 
              onTap={() => handleRoleTap(role.id)}
              isMobile={isMobile}
              isSelectedAndReady={isMobile && !!selectedIconName}
              isDragOver={dragOverRole === role.id} 
              onDragOver={(isOver) => setDragOverRole(isOver ? role.id : null)} 
            />
          ))}
        </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <button onClick={onBack} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"><ArrowLeft className="w-5 h-5" /><span className="text-sm md:text-base">Back</span></button>
            <div className="text-center">
              <div className="flex justify-center items-center space-x-2 md:space-x-3 mb-1">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg md:rounded-xl flex items-center justify-center"><ClipboardList className="w-5 h-5 md:w-6 md:h-6 text-white" /></div>
                <h1 className="text-xl md:text-3xl font-bold text-gray-900">CRediT Icon Survey</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={handleReset} className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors px-2 py-1 rounded"><RotateCcw className="w-4 h-4" /><span className="text-sm">Reset</span></button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {isMobile ? (
          <>
            <div className="sticky top-[88px] bg-gray-50/90 backdrop-blur-sm py-4 z-10 mb-6">
              <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
                <IconDisplay 
                  icon={currentIcon} 
                  isMobile={isMobile}
                  selectedIconName={selectedIconName}
                  onSelect={handleIconSelect}
                />
              </div>
            </div>
            <PageHeader />
            <RolesGrid />
            <div className="mt-8">
                <button onClick={handleSubmit} className={`w-full inline-flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-semibold text-lg transition-all transform ${assignedRolesCount === roles.length ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`} disabled={assignedRolesCount !== roles.length || isSubmitting}>
                  {isSubmitting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Survey'}</span>
                </button>
            </div>
          </>
        ) : (
          <>
            <PageHeader />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="sticky top-28 space-y-6">
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
                    <IconDisplay 
                      icon={currentIcon} 
                      isMobile={isMobile}
                      selectedIconName={selectedIconName}
                      onSelect={handleIconSelect}
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button onClick={handleUndo} className={`w-1/3 inline-flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-semibold text-sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all ${history.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={history.length === 0}>
                        <Undo2 className="w-4 h-4" />
                        <span>Undo</span>
                    </button>
                    <button onClick={handleSubmit} className={`w-2/3 inline-flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-semibold text-lg transition-all transform ${assignedRolesCount === roles.length ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl hover:scale-105' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`} disabled={assignedRolesCount !== roles.length || isSubmitting}>
                      {isSubmitting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                      <span>{isSubmitting ? 'Submitting...' : 'Submit Survey'}</span>
                    </button>
                  </div>
                </div>
              </div>
              <RolesGrid />
            </div>
          </>
        )}
      </div>
      
      {isMobile && history.length > 0 && (
        <div className="sticky bottom-4 flex justify-center z-20 px-4">
             <button onClick={handleUndo} className="w-full max-w-xs flex items-center justify-center space-x-2 px-6 py-3 rounded-full font-semibold text-sm bg-gray-800 text-white shadow-lg hover:bg-gray-900 transition-all">
                <Undo2 className="w-4 h-4" />
                <span>Undo Last Assignment</span>
            </button>
        </div>
      )}
    </div>
  );
};
