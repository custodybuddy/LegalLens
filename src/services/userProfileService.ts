
import { UserProfile } from '../types/types';

const STORAGE_KEY = 'cb_user_profile';

export const getUserProfile = (): UserProfile | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error("Failed to load user profile", e);
    return null;
  }
};

export const saveUserProfile = (profile: UserProfile): void => {
  try {
    const updatedProfile = {
      ...profile,
      lastActive: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));
  } catch (e) {
    console.error("Failed to save user profile", e);
  }
};

export const createDefaultProfile = (): UserProfile => ({
  id: crypto.randomUUID(),
  name: '',
  email: '',
  role: 'self-represented',
  defaultJurisdictionId: 'ontario', // Default to Ontario as per original context
  preferences: {
    notifications: true,
    highContrast: false,
    autoRedaction: true
  },
  lastActive: new Date().toISOString()
});
