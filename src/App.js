import 'react-native-url-polyfill/auto';
import React, { useEffect, useState } from 'react';
import { supabase } from './src/auth/supabaseClient';
import SignInPage from './src/screens/SignInPage';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { loadBooks } from './src/utils/storage';
import { theme } from './src/theme/theme';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Initialize storage
    const initStorage = async () => {
      await loadBooks();
    };
    initStorage();

    // Get current session and subscribe to auth changes
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        {user ? <AppNavigator /> : <SignInPage />}
      </NavigationContainer>
    </PaperProvider>
  );
} 