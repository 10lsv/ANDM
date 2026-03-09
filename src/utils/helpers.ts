import { NutriScoreGrade } from '../types';

export const getNutriScoreColor = (grade: string, colors: any): string => {
  const map: Record<string, string> = {
    a: colors.nutriScoreA,
    b: colors.nutriScoreB,
    c: colors.nutriScoreC,
    d: colors.nutriScoreD,
    e: colors.nutriScoreE,
  };
  return map[grade?.toLowerCase()] || colors.textSecondary;
};

export const getNovaGroupLabel = (group?: number): string => {
  const labels: Record<number, string> = {
    1: 'Non transformé',
    2: 'Ingrédients culinaires',
    3: 'Aliments transformés',
    4: 'Ultra-transformé',
  };
  return group ? labels[group] || 'Inconnu' : 'Inconnu';
};

export const getNovaGroupColor = (group?: number): string => {
  const map: Record<number, string> = {
    1: '#038141',
    2: '#85BB2F',
    3: '#EE8100',
    4: '#E63E11',
  };
  return group ? map[group] || '#9CA3AF' : '#9CA3AF';
};

export const getEcoScoreColor = (grade?: string): string => {
  const map: Record<string, string> = {
    a: '#038141',
    b: '#85BB2F',
    c: '#FECB02',
    d: '#EE8100',
    e: '#E63E11',
  };
  return grade ? map[grade.toLowerCase()] || '#9CA3AF' : '#9CA3AF';
};

export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays < 7) return `Il y a ${diffDays}j`;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};
