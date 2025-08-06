let authToken: string | null = null;

// This function saves the token to memory and local storage
// It takes a token as input and returns nothing
export const saveToken = (token: string) => {
  authToken = token;
  sessionStorage.setItem('authToken', token);
};

// This function gets the token from memory or local storage
// It returns the token if available, otherwise null
export const getToken = (): string | null => {
  if (!authToken) {
    authToken = sessionStorage.getItem('authToken');
  }
  return authToken;
};

// This function removes the token from memory and local storage
// It returns nothing
export const removeToken = () => {
  authToken = null;
  sessionStorage.removeItem('authToken');
  localStorage.removeItem('authToken');
};