export interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: string;
}

export interface LoginResponse {
  user: UserData;
  token: string;
}

export interface RegisterCredentials {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  role: string;
}

export interface RegisterResponse {
  user: UserData;
  status: string;
}