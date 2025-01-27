import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { loadBooks } from './src/utils/storage';
import { theme } from './src/theme/theme';

export default function App() {
  useEffect(() => {
    // Initialize storage
    const initStorage = async () => {
      await loadBooks();
    };
    
    initStorage();
  }, []);

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
} 