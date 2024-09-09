import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./screens/Screens-Login/LoginScreen.js";
import RegisterScreen from "./screens/Screens-Login/RegisterScreen.js";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

function StackLoginComponent() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
    <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="DetalleEventos" 
        component={DetalleEventos} 
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="calendar" size={24} color={color} />,
        }} 
      />
        <Tab.Screen 
        name="EventosScreen" 
        component={EventosScreen} 
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="search-outline" size={24} color={color} />,
        }} 
      />
     
        <Tab.Screen 
        name="PerfilScreen" 
        component={PerfilScreen} 
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={24} color={color} />,
        }} 
      />
    
    
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StackLoginComponent />
    </NavigationContainer>
  );
}
