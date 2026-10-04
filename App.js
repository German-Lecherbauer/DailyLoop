import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import AddHabitScreen from './src/screens/AddHabitScreen';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#F7FAF8',
          },
          headerTintColor: '#16A34A',
          headerTitleStyle: {
            color: '#18181B',
            fontWeight: '800',
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: '#F7FAF8',
          },
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            title: 'DailyLoop',
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{
            title: 'Crear cuenta',
          }}
        />

        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Mis hábitos',
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="AddHabit"
          component={AddHabitScreen}
          options={{
            title: 'Nuevo hábito',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}