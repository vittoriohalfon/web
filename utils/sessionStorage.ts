export const COMPANY_SETUP_KEY = 'company_setup_data';

export const saveToSessionStorage = (data: any) => {
  try {
    sessionStorage.setItem(COMPANY_SETUP_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to session storage:', error);
  }
};

export const getFromSessionStorage = () => {
  try {
    const data = sessionStorage.getItem(COMPANY_SETUP_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading from session storage:', error);
    return null;
  }
};

export const clearSessionStorage = () => {
  try {
    sessionStorage.removeItem(COMPANY_SETUP_KEY);
  } catch (error) {
    console.error('Error clearing session storage:', error);
  }
}; 