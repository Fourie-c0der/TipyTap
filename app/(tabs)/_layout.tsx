// Bottom tabs navigation layout
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/constants/colors';
import { useState, useEffect } from 'react';
import authService from '../../src/services/authService';
import { User } from '../../src/types';

export default function TabsLayout() {

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const userData = await authService.getCurrentUser();
    setUser(userData);
  };

  const isCarguard = () => {
    if (!user) return false;
    return user.userType.includes('carguard');
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: '#FFA500',
          borderBottomWidth: 1,

          borderBottomColor: '#FFA500',
          paddingBottom: 8,
          paddingTop: 50,
          height: 110,
          elevation: 10,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          color: colors.text,
        },
        tabBarLabelPosition: 'below-icon',
        tabBarPosition: 'top',
      }}
    >

      <Tabs.Screen
        name={isCarguard() ? "profile" : "index"}
        options={{
          title: isCarguard() ? 'Profile' : 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={isCarguard() ? (focused ? "person" : "person-outline") : (focused ? "home" : "home-outline")} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name={isCarguard() ? "index" : "profile"}
        options={{
          title: isCarguard() ? 'Tip' : 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={isCarguard() ? (focused ? "cash" : "cash-outline") : (focused ? "person" : "person-outline")} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="help"
        options={{
          title: 'Info',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "help-circle" : "help-circle-outline"} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}