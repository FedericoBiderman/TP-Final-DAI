import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const baseUrl = "https://welcome-chamois-aware.ngrok-free.app";

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');

      if (token) {
        // Decodificamos el token JWT para obtener el userId
        /*const decodedToken = await jwtDecode(token);
        const userId = decodedToken.id;  // Aquí obtenemos el userId del token
        */

        // Realizamos la solicitud al servidor para obtener el perfil del usuario
        const response = await axios.get(`${baseUrl}/api/user/profile/data`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUser(response.data);
      }
      
      //setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      //setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userId');
      navigation.replace('LoginScreen');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };
/*
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }
  */

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error al cargar el perfil del usuario</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mi Perfil</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{`${user.first_name} ${user.last_name}`}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.
            userId}>ID: {user.id}</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#4A90E2',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginTop: -50,
  },
  defaultImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  infoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: '#FF3B30',
    textAlign: 'center',
  },

  email: {
    fontSize: 18,
    color: '#666666',
    marginTop: 5,
  },
  userId: {
    fontSize: 16,
    color: '#888888',
    marginTop: 5,
  },
});

export default ProfileScreen;