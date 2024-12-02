import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const RegisterScreen = () => {
  const [first_name, setNombre] = useState('');
  const [last_name, setApellido] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const baseUrl = 'https://properly-definite-mastodon.ngrok-free.app';

  const handleRegister = async () => {
    try {
      const response = await axios.post(`${baseUrl}/api/user/register`, {
        first_name,
        last_name,
        username,
        password,
      });

      // Verificar si el registro fue exitoso
      if (response.status === 201 || response.status === 200) {
        Alert.alert('Registro Exitoso', 'Te has registrado correctamente.', [
          { text: 'OK', onPress: () => navigation.replace('EventosScreen') },
        ]);
      } else {
        // Respuesta no esperada
        Alert.alert('Error', 'No se pudo completar el registro.');
      }
    } catch (error) {
      console.error(error);
      // Manejar errores correctamente
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Hubo un problema al intentar registrarse.'
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrarse</Text>

      <TextInput
        placeholder="Nombre"
        style={styles.input}
        value={first_name}
        onChangeText={setNombre}
      />

      <TextInput
        placeholder="Apellido"
        style={styles.input}
        value={last_name}
        onChangeText={setApellido}
      />

      <TextInput
        placeholder="Username"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Registrarse" onPress={handleRegister} />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
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
});

export default RegisterScreen;
