import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';

const EventDetailScreen = () => {
  const route = useRoute();
  const { eventId } = route.params; // Obtenemos el ID del evento desde la navegación
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false); // Estado de suscripción
  const [loadingAction, setLoadingAction] = useState(false); // Para manejar la acción de suscripción/desuscripción
  const baseUrl = 'https://properly-definite-mastodon.ngrok-free.app'; // Reemplaza con tu base URL

  // Función para obtener los detalles del evento desde la API
  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/events/${eventId}`);
      setEvent(response.data); // Asignamos los datos del evento al estado
      setSubscribed(response.data.subscribed); // Si el usuario ya está suscrito
      setLoading(false); // Detenemos el estado de carga
    } catch (error) {
      console.error('Error al obtener los detalles del evento:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetails(); // Llamamos a la función cuando se monta el componente
  }, []);

  // Función para manejar la suscripción
  const handleSubscribe = async () => {
    setLoadingAction(true);
    try {
      const response = await axios.post(`${baseUrl}/api/events/${eventId}/subscribe`);
      if (response.data.success) {
        setSubscribed(true);
        alert('Te has suscrito al evento.');
      }
    } catch (error) {
      console.error('Error al suscribirse:', error);
      alert('Hubo un problema al intentar suscribirse.');
    } finally {
      setLoadingAction(false);
    }
  };

  // Función para manejar la desuscripción
  const handleUnsubscribe = async () => {
    setLoadingAction(true);
    try {
      const response = await axios.post(`${baseUrl}/api/events/${eventId}/unsubscribe`);
      if (response.data.success) {
        setSubscribed(false);
        alert('Te has desuscrito del evento.');
      }
    } catch (error) {
      console.error('Error al desuscribirse:', error);
      alert('Hubo un problema al intentar desuscribirse.');
    } finally {
      setLoadingAction(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.container}>
        <Text>Error al cargar los detalles del evento</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.eventName}>{event.name}</Text>
      <Text style={styles.eventCategory}>Categoría: {event.category}</Text>
      <Text style={styles.eventDescription}>{event.description}</Text>
      
      {/* Si el evento es a futuro */}
      {event.isFuture && (
        <View style={styles.subscriptionContainer}>
          {subscribed ? (
            <Button title="Desuscribirse" onPress={handleUnsubscribe} disabled={loadingAction} />
          ) : (
            <Button title="Suscribirse" onPress={handleSubscribe} disabled={loadingAction} />
          )}
        </View>
      )}

      {/* Si el evento es pasado */}
      {!event.isFuture && (
        <View style={styles.attendeesContainer}>
          <Text style={styles.attendeesTitle}>Lista de Asistentes:</Text>
          <FlatList
            data={event.attendees}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.attendeeItem}>
                <Text style={styles.attendeeName}>{item.name}</Text>
                <View
                  style={[
                    styles.attendanceIndicator,
                    { backgroundColor: item.attended ? 'green' : 'red' },
                  ]}
                />
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  eventCategory: {
    fontSize: 18,
    color: '#555',
    marginBottom: 10,
  },
  eventDescription: {
    fontSize: 16,
    color: '#777',
    marginBottom: 20,
  },
  subscriptionContainer: {
    marginTop: 20,
  },
  attendeesContainer: {
    marginTop: 20,
  },
  attendeesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  attendeeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  attendeeName: {
    fontSize: 16,
  },
  attendanceIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});

export default EventDetailScreen;
