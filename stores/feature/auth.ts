// Importing required libraries and interfaces
import { create } from 'zustand';
import { supabase } from '../../utilities/supabase';
import { AuthError } from '@supabase/supabase-js';
import { MMKVStorage } from '../../stores/mmkv-storage';
import { createJSONStorage, persist } from 'zustand/middleware';

// Defining the AuthState interface
interface AuthState {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthError | void>;
  signup: (email: string, password: string) => Promise<AuthError | void>;
  logout: () => Promise<AuthError | void>;
  saveUserDetails: (user: any) => Promise<boolean | undefined>;
  setIsAuthenticated: (state: AuthState['isAuthenticated']) => void;
  data: any;
  error: any;
  verifyOTP: (email: string, token: string) => Promise<any | AuthError | null | undefined>;
  resendOTP: (email: string) => Promise<AuthError | void>;
  setTransactionPin: (pin: string) => Promise<boolean | undefined>;
  checkTransactionPin: () => Promise<string | undefined>;
  confirmTransactionPin: (pin: string) => Promise<boolean>;
  updateTransactionPin: (pin: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  updatePhone: (phone: string) => Promise<void>;
  refreshUserSession: (refreshToken: string) => Promise<void>;
};

// Creating the AuthStore using Zustand
export const useAuthStore = create<AuthState>()(persist((set) => ({
      isAuthenticated: false,
      data: {}, 
      error: {},
      
      setIsAuthenticated: (state: AuthState['isAuthenticated']) => set({ isAuthenticated: state }),
      // Function to handle user login
      login: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (data?.session) {
          set({ isAuthenticated: true, data: data, error: {} });
        } else {
          set({ isAuthenticated: false, error: error, data: {} });
        }
      },
      // Function to handle user logout
      logout: async () => {
        await supabase.auth.signOut();
        set({ isAuthenticated: false, data: {} });
      },
      // Function to handle user signup
  signup: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({ email, password });
      if (data?.user) {
            set({ data: data, error: {} });
      } else {
          set({ error: error, data: {} });
        }
      },
      // Function to save user details
      saveUserDetails: async (user) => {
        const { data: userdata, error } = await supabase
          .from('users')
          .update({
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username,
            address: user.address,
            phone: user.phone
          })
          .eq('id', user.id)
          .select();
        if (userdata) {
          return true;
        } else {
          console.error(error);
          return false;
        }
      },
      // Function to update phone number
      updatePhone: async (phone: string) => {
        await supabase.auth.updateUser({ phone: phone });
      },
      // Function to set transaction pin
      setTransactionPin: async (pin: string) => {
        const { data } = await supabase.auth.updateUser({
          data: {
            transactionPin: pin
          }
        });
        return data?.user?.user_metadata.transactionPin ? true : false;
      },
      // Function to update transaction pin
      updateTransactionPin: async (pin: string) => {
        const { data } = await supabase.auth.updateUser({
          data: {
            transactionPin: pin
          }
        });
        return data?.user?.user_metadata.transactionPin === pin;
      },
      // Function to check transaction pin
      checkTransactionPin: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        return user?.user_metadata.transactionPin || "";
      },
      // Function to confirm transaction pin
      confirmTransactionPin: async (pin: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        return user?.user_metadata.transactionPin === pin;
      },
      // Function to verify OTP
      verifyOTP: async (email, token) => {
        const { data: verificationData, error: verifyError } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
        set({ data: verificationData });
        return {
          verifyError
        };
      },
      // Function to resend OTP
      resendOTP: async (email: string) => {
        await supabase.auth.resend({ email, type: "signup" });
      },
      // Function to reset password
      resetPassword: async (email: string) => {
        await supabase.auth.resetPasswordForEmail(email);
      },
      // Function to update password
      updatePassword: async (password: string) => {
        await supabase.auth.updateUser({ password });
      },
      // Function to refresh user session
      refreshUserSession: async (refreshToken: string) => {
        const { data } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
        if (data?.session) {
          set({ isAuthenticated: true, data: data, error: {} });
        }
      },
    }),
    {
      name: "@auth-session",
      storage: createJSONStorage(() => MMKVStorage)
    }
  )
);

