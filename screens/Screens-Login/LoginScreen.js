import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const [username, setUsername] = useState('pablo.ulman@ort.edu.ar');
  const [password, setPassword] = useState('pabulm101');
  const navigation = useNavigation();
  const baseUrl = 'https://properly-definite-mastodon.ngrok-free.app'; 

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${baseUrl}/api/user/login`, {
        username,
        password,
      });

      if (response.data.success) {
        // Guardamos el token y el userId en AsyncStorage
        await AsyncStorage.setItem('userToken', response.data.token);
        
        Alert.alert('Login Exitoso', 'Has ingresado correctamente.', [
          { text: 'OK', onPress: () => navigation.replace('EventosScreen') },
        ]);
      } else {
        Alert.alert('Error', 'Usuario o contraseña incorrectos.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema al intentar iniciar sesión.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('./../../assets/icon.png')} style={styles.logo} />
      </View>

      <TextInput
        placeholder="Username"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Ingresar" onPress={handleLogin} />

      <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
        <Text style={styles.registerText}>¿No tienes cuenta? Regístrate aquí</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
  },
  icon: {
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  registerText: {
    marginTop: 20,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;


