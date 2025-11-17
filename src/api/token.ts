// src/api/token.ts
const TOKEN_KEY = 'token';

const canUseBrowserStorage = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const readPersistedToken = (): string | null => {
  if (!canUseBrowserStorage()) return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Unable to access localStorage for token read', error);
    }
    return null;
  }
};

let authToken: string | null = readPersistedToken();

export const saveToken = (token: string): void => {
  authToken = token;
  if (!canUseBrowserStorage()) return;
  try {
    window.localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Unable to persist auth token', error);
    }
  }
};

export const getToken = (): string | null => {
  if (authToken) return authToken;
  authToken = readPersistedToken();
  return authToken;
};

export const removeToken = (): void => {
  authToken = null;
  if (!canUseBrowserStorage()) return;
  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Unable to clear persisted auth token', error);
    }
  }
};
