import axios from 'axios';
import { create } from 'zustand';

type UserInfo = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role?: 'admin' | 'customer' | 'guest';
};

type UserState = {
  isAuthenticated: boolean;
  userInfo: UserInfo | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<UserInfo>;
  logout: () => void;
  setUserInfo: (user: UserInfo) => void;
  validateAuth?: () => Promise<boolean>;
  createUser: (
    name: string,
    email: string,
    password: string
  ) => Promise<UserInfo>;
};

export const useUserStore = create<UserState>((set) => ({
  isAuthenticated: false,
  userInfo: null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const user: UserInfo = response.data.user;
      const accessToken: string | undefined = response.data.access_token;

      set({ isAuthenticated: true, userInfo: user, loading: false });
      if (accessToken) {
        localStorage.setItem('token', accessToken);
      }
      return user;
    } catch (err: unknown) {
      let errorMessage = 'An unknown error occurred';
      if (axios.isAxiosError(err)) {
        errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Login failed. Please try again.';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      set({
        error: errorMessage,
        loading: false,
        isAuthenticated: false,
        userInfo: null,
      });
      throw new Error(errorMessage);
    }
  },

  logout: () => {
    set({
      isAuthenticated: false,
      userInfo: null,
      error: null,
    });
    localStorage.removeItem('token');
  },
  validateAuth: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      set({
        isAuthenticated: true,
        userInfo: response.data,
      });
      return true;
    } else if (response.status === 401) {
      set({
        isAuthenticated: false,
        userInfo: null,
      });
      return false;
    } else {
      return false;
    }
  },
  createUser: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          name,
          email,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const user: UserInfo = response.data.user;
      const accessToken: string | undefined = response.data.access_token;
      set({ isAuthenticated: true, userInfo: user, loading: false });
      if (accessToken) {
        localStorage.setItem('token', accessToken);
      }
      return user;
    } catch (err: unknown) {
      let errorMessage = 'An unknown error occurred';
      if (axios.isAxiosError(err)) {
        errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Registration failed. Please try again.';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      set({
        error: errorMessage,
        loading: false,
        isAuthenticated: false,
        userInfo: null,
      });
      throw new Error(errorMessage);
    }
  },
  setUserInfo: (user: UserInfo) => set({ userInfo: user }),
}));
