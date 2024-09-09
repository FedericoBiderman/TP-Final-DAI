import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const baseUrl = 'https://properly-definite-mastodon.ngrok-free.app'; 

  const handleLogin = async () => {
    try {
      // Aquí hacemos la solicitud GET, ajusta esto para usar POST si tu API lo requiere
      const response = await axios.post(`${baseUrl}/api/user/login`, {
        username,
        password,
      });

      // Simulamos la verificación de los datos recibidos
      if (response.data.success) {
        // Datos correctos, navegar a la Home
        Alert.alert('Login Exitoso', 'Has ingresado correctamente.', [
          { text: 'OK', onPress: () => navigation.replace('EventosScreen') },
        ]);
      } else {
        // Datos incorrectos, mostrar alerta de error
        Alert.alert('Error', 'Usuario o contraseña incorrectos.');
      }
    } catch (error) {
      // Manejo de errores, en caso de que la solicitud falle
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


