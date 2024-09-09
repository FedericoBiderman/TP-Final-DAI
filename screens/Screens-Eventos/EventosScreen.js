import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const EventsScreen = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const baseUrl = 'https://properly-definite-mastodon.ngrok-free.app'; // Reemplaza con tu base URL

  // Función para obtener eventos desde la API
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/event`);
      setEvents(response.data); // Asignamos los datos de los eventos al estado
      setLoading(false); // Detenemos el estado de carga
    } catch (error) {
      console.error('Error al obtener los eventos:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(); // Llamamos a la función cuando se monta el componente
  }, []);

  // Función para renderizar cada item (evento) en la lista
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.eventContainer}
      onPress={() => navigation.navigate('DetalleEventosScreen', { eventId: item.id })}
    >
      <Text style={styles.eventName}>{item.name}</Text>
      <Text style={styles.eventCategory}>Categoría: {item.category}</Text>
      <Text style={styles.eventDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventCategory: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  eventDescription: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
});

export default EventsScreen;
