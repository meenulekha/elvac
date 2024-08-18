import { DarkTheme, DefaultTheme, NavigationContainer, ThemeProvider, } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as Font from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import React from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import initial from './initial';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import signup from './signup';
import signin from './signin';
import tabs from './(tabs)';
import index from './(tabs)/index';
import TabLayout from './(tabs)/_layout';
import TopDoctors from './(tabs)/bookAppointment';
import BookAppointment from './(tabs)/bookAppointment';
import { Auth, User, onAuthStateChanged } from "@firebase/auth";
import { FIREBASE_AUTH } from '@/Firebase/FirebaseConfig';
import { JsStack } from '@/components/layouts';


import Onboarding from './initial';
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const OuterStack = createNativeStackNavigator();
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false); // New state for tracking authentication check

  const [fontsLoaded, error] = useFonts({
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.ttf"),
    "SpaceMono": require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('User state changed:', user?.email); // Log the user email or null
      setUser(user);
      setAuthChecked(true); // Set authChecked to true after checking authentication
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  if (!authChecked) {
    return null;
  }

  console.log('Auth checked:', authChecked, 'User:', user); // Log the auth check and user state

  return (
    <JsStack initialRouteName="initial">
      <JsStack.Screen name="initial" options={{ headerShown: false }} />
      <JsStack.Screen name="signin" options={{ headerShown: false }} />
      <JsStack.Screen name="signup" options={{ headerShown: false }} />
      <JsStack.Screen name="(tabs)" options={{ headerShown: false }} />
      <JsStack.Screen name="_sitemap" options={{ headerShown: false }} />
      <JsStack.Screen name="bookingPage" options={{ headerShown: false }} />
    </JsStack>

    
  );
}
