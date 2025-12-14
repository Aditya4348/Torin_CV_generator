import { CVData, INITIAL_CV_DATA } from '../types';

const STORAGE_KEY = 'genz_cv_forge_data';

export const generateId = (): string => {
  return crypto.randomUUID();
};

export const getAllCVs = (): CVData[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading from local storage', error);
    return [];
  }
};

export const getCVById = (id: string): CVData | undefined => {
  const cvs = getAllCVs();
  return cvs.find(cv => cv.id === id);
};

export const saveCV = (cv: CVData): void => {
  const cvs = getAllCVs();
  const index = cvs.findIndex(item => item.id === cv.id);
  
  const updatedCV = { ...cv, lastModified: Date.now() };

  if (index >= 0) {
    cvs[index] = updatedCV;
  } else {
    cvs.push(updatedCV);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(cvs));
};

export const deleteCV = (id: string): void => {
  const cvs = getAllCVs();
  const filtered = cvs.filter(cv => cv.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const duplicateCV = (id: string): CVData | null => {
  const cv = getCVById(id);
  if (!cv) return null;

  const newCV: CVData = {
    ...cv,
    id: generateId(),
    title: `${cv.title} (Copy)`,
    lastModified: Date.now()
  };

  saveCV(newCV);
  return newCV;
};

export const createNewCV = (): CVData => {
  const newCV: CVData = {
    ...INITIAL_CV_DATA,
    id: generateId(),
    title: 'My New CV',
  };
  saveCV(newCV);
  return newCV;
};