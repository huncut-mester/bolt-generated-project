export interface User {
  id: number;
  email: string;
  role: 'super_admin' | 'admin' | 'staff' | 'client' | 'partner';
  firstName: string;
  lastName: string;
  language: 'hu' | 'en';
  lastLogin?: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
  mfaCode?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
