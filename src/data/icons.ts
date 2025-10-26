import { IconItem } from '../types';

export const iconSet: IconItem[] = [
  { id: 'supervision', name: 'Supervision', color: '#EC4899', shape: 'eye' },
  { id: 'conceptualization', name: 'Conceptualization', color: '#3B82F6', shape: 'lightbulb' },
  { id: 'data-curation', name: 'Data Curation', color: '#10B981', shape: 'database' },
  { id: 'formal-analysis', name: 'Formal Analysis', color: '#8B5CF6', shape: 'magnifying-glass' },
  { id: 'writing-review', name: 'Writing – Review & Editing', color: '#7C2D12', shape: 'pen-caret' },
  { id: 'investigation', name: 'Investigation', color: '#EF4444', shape: 'microscope' },
  { id: 'methodology', name: 'Methodology', color: '#06B6D4', shape: 'network' },
  { id: 'project-administration', name: 'Project Administration', color: '#84CC16', shape: 'person' },
  { id: 'visualization', name: 'Visualization', color: '#A855F7', shape: 'chart' },
  { id: 'funding-acquisition', name: 'Funding Acquisition', color: '#F59E0B', shape: 'dollar-sign' },
  { id: 'resources', name: 'Resources', color: '#F97316', shape: 'box' },
  { id: 'software', name: 'Software', color: '#6366F1', shape: 'code' },
  { id: 'validation', name: 'Validation', color: '#14B8A6', shape: 'clipboard' },
  { id: 'writing-original', name: 'Writing – Original Draft', color: '#DC2626', shape: 'pen' }
];

// Fisher-Yates shuffle algorithm
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
