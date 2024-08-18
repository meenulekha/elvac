const Stack = createNativeStackNavigator();
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";

import Pneumococcal from "./screens/Pneumococcal";
import Reports from "./screens/Reports";
import Profile from "./screens/Profile";
import SetUp from "./screens/SetUp";
import Influenza from "./screens/Influenza";
import TopDoctors from "./screens/TopDoctors";
import Home from "./screens/Home";
import SignIn from "./screens/SignIn";
import Onboarding from "./screens/Onboarding";
import SpalshScreen from "./screens/SpalshScreen";
import Registration from "./screens/Registration";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, Pressable, TouchableOpacity } from "react-native";

const App = () => {
  const [hideSplashScreen, setHideSplashScreen] = React.useState(true);

  return (
    <>
      <NavigationContainer>
        {hideSplashScreen ? (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="Pneumococcal"
              component={Pneumococcal}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Reports"
              component={Reports}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Profile"
              component={Profile}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SetUp"
              component={SetUp}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Influenza"
              component={Influenza}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TopDoctors"
              component={TopDoctors}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignIn"
              component={SignIn}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Onboarding"
              component={Onboarding}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SpalshScreen"
              component={SpalshScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Registration"
              component={Registration}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        ) : null}
      </NavigationContainer>
    </>
  );
};
export default App;
