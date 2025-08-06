export interface LoginProps {
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setUserEmail: (email: string | null) => void;
  saveToken: (token: string) => void; // Add saveToken property
}
