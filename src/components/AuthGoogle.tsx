import 'react-native-url-polyfill/auto'
import React, { useEffect } from 'react';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { supabase } from '../auth/supabaseClient';
import { GOOGLE_CLIENT_ID } from "@env";
console.log('Supabase:', supabase);

const AuthGoogle = () => {
  useEffect(() => {
    // Configure Google Sign-In when the component mounts
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      iosClientId: GOOGLE_CLIENT_ID
    });
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      // Sign in and get user info
      const userInfo = await GoogleSignin.signIn();
      // Check for the ID token – note: some versions of the library return the token directly, others wrap it inside data.
      const idToken = userInfo?.data?.idToken || userInfo?.idToken;
      if (idToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: idToken,
        });
        if (error) {
          console.error('Supabase sign-in error:', error.message);
        } else {
          console.log('Supabase sign in success:', data);
        }
      } else {
        throw new Error('No ID token present!');
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.warn('User cancelled Google sign-in');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        console.warn('Google sign-in is in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        console.warn('Google Play services not available or outdated');
      } else {
        console.error('Google Sign-in Error:', error);
      }
    }
  };

  return (
    <GoogleSigninButton
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={handleGoogleSignIn}
    />
  );
};

export default AuthGoogle;