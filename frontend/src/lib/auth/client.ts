import { User } from '@/types/user';
import axios from 'axios';

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  password2: string;
  role: string; // Add role parameter
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

// Add a request interceptor to include the access token in headers
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('custom-auth-token'); // Use the custom-auth-token
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`; // Set the token in Authorization header
  }
  return config;
});

class AuthClient {
  private apiUrl: string;

  constructor() {
    this.apiUrl = 'http://127.0.0.1:8000/api/auth'; // Base API URL
  }

  // Sign Up method
  async signUp(params: SignUpParams): Promise<{ error?: string }> {
    const { firstName, lastName, email, password, password2, role } = params;

    try {
      const response = await axios.post(`${this.apiUrl}/signup/`, {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        password2,
        role, // Include role parameter
      });

      return {}; // Success, return nothing on success
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return { error: error.response.data.detail || 'Sign-up failed' };
      }
      console.error('Error during sign-up:', error);
      return { error: 'Something went wrong' };
    }
  }

  // Sign In method
  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string; access_token?: string; refresh_token?: string }> {
    const { email, password } = params;
  
    try {
      const response = await axios.post(`${this.apiUrl}/login/`, { email, password });
  
      // Check if response contains tokens
      if (!response.data.access || !response.data.refresh) {
        throw new Error('Token missing from response'); // Throw an error if tokens are missing
      }
  
      // Store both access and refresh tokens
      const accessToken = response.data.access;
      const refreshToken = response.data.refresh;
  
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
  
      return { access_token: accessToken, refresh_token: refreshToken }; // Return both tokens
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return { error: error.response.data.detail || 'Invalid credentials' }; // Using 'detail' from Django response
      }
      console.error('Error during sign-in:', error);
      return { error: 'Something went wrong' };
    }
  }
  
  
  // Get user data
  async getUser(): Promise<{ data?: User | null; error?: string }> {
    const token = localStorage.getItem('access_token');

    if (!token) {
      return { data: null };
    }

    try {
      const response = await axios.get(`${this.apiUrl}/user/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return { data: response.data };
    } catch (error) {
      console.error('Error fetching user data:', error);
      return { data: null };
    }
  }

  // Sign out method
  async signOut(): Promise<{ error?: string }> {
    const refreshToken = localStorage.getItem('refresh_token');
    const accessToken = localStorage.getItem('access_token');
    
    if (!refreshToken) {
      return { error: "No refresh token found" };
    }

    if (!accessToken) {
      return { error: "No access token found" };
    }
  
    try {
      await axios.post(`${this.apiUrl}/logout/`, {
        refresh: refreshToken, // Send the refresh token
        access: accessToken, // Send the refresh token
      });
  
      // Clear tokens from localStorage on successful logout
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
  
      return {}; // Success, return no error
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return { error: error.response.data.detail || 'Logout failed' };
      }
      console.error('Error during logout:', error);
      return { error: 'Something went wrong' };
    }
  }
  
}

export const authClient = new AuthClient();
