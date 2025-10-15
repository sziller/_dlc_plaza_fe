// src/api/token.ts
let authToken: string | null = null;

// Save the token in memory only.  Nothing is persisted in web storage.
export const saveToken = (token: string): void => {
  authToken = token;
};

// Return the current token from memory.  Returns null after a page reload.
export const getToken = (): string | null => {
  return authToken;
};

// Clear the in‑memory token.
export const removeToken = (): void => {
  authToken = null;
};
