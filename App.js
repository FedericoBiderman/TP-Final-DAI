import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./screens/Screens-Login/LoginScreen.js";
import RegisterScreen from "./screens/Screens-Login/RegisterScreen.js";
import EventosScreen from "./screens/Screens-Eventos/EventosScreen.js";
import DetalleEventosScreen from "./screens/Screens-Eventos/DetalleEventosScreen.js";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CategoriasScreen from "./screens/Screens-Categorias/CategoriasScreen.js";
import EventosPorCategoriaScreen from "./screens/Screens-Categorias/EventosPorCategoriaScreen.js";
import ProfileScreen from "./screens/Screens-Perfil/ProfileScreen.js";
import { Ionicons } from "@expo/vector-icons";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="DetalleEventosScreen"
        component={DetalleEventosScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar-outline" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="CategoriasScreen"
        component={CategoriasScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="search-outline" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="menu-outline" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
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
        <Stack.Screen
          name="EventosScreen"
          component={EventosScreen}
          options={{ headerShown: false }}
        />
          <Stack.Screen
          name="DetalleEventosScreen"
          component={DetalleEventosScreen}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="CategoriasScreen"
          component={CategoriasScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EventosPorCategoriaScreen"
          component={EventosPorCategoriaScreen}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
        {/* Anida MyTabs dentro del Stack */}
        <Stack.Screen
          name="MainTabs"
          component={MyTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

