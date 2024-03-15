import { ThemeProvider } from 'styled-components/native';
import { SplashScreen, Stack, router } from 'expo-router';
import { theme } from '../constants/Colors';
import { useGlobalStore } from '../stores/store';
import Spinner from '../components/Spinner';
import useFonts from '../hooks/useFont';
import { MMKVStorage } from '../stores/mmkv-storage';
import { SheetProvider } from 'react-native-actions-sheet';
import '../helpers/actionSheets/sheets';
import { useAuthStore } from '../stores/feature/auth';
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import { useUserStore } from '../stores/feature/users';
import { ApolloProvider } from '@apollo/client';
import client from '../utilities/apolloClient';
import { useEffect } from 'react';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Main component for the root layout
export default function RootLayout() {
  const setAppState = useGlobalStore(state => state.setAppState);
  const [isAuthenticated, setIsAuthenticated] = useAuthStore(state => [state.isAuthenticated, state.setIsAuthenticated]);
  const refreshUserSession = useAuthStore(state => state.refreshUserSession);
  const clearUserData = useUserStore(state => state.clearUserData);

  const { loaded, error } = useFonts();
  
  // Function to check for active user session
  const checkForUserActiveSession = async () => {
    const localSession = JSON.parse(MMKVStorage.getItem('@auth-session') as string)?.state?.data?.session;
    const checkTokenExpiration = async () => {
      clearUserData();
      if (moment().unix() > localSession?.expires_at) {
        setIsAuthenticated(false);
        Toast.showWithGravity(
          'Session expired. Login to continue',
          Toast.SHORT,
          Toast.BOTTOM,
        );
        MMKVStorage.clearAll();
        router.replace('/auth/login');
      } else {
        await refreshUserSession(localSession?.refresh_token);
        router.replace('/auth/enter-transaction-pin');
        setAppState("IDLE");
      }
    };
    if (localSession?.access_token) {
      checkTokenExpiration();
    };
  };

  // Check for active user session if fonts are loaded and no error
  useEffect(() => {
    if (loaded && !error) {
      checkForUserActiveSession();
    }
  }, [loaded, error]);

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 5000);
  }, []);

  return <RootLayoutNav />;
};




// Component for the root layout navigation
function RootLayoutNav() {
  const appState = useGlobalStore((state) => state.appState);

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <SheetProvider>
          {appState === 'LOADING' && <Spinner />}
          <Stack screenOptions={{
            headerShown: false, contentStyle: {
              backgroundColor: theme.colors.zippaLight
            }
          }} />
        </SheetProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}
