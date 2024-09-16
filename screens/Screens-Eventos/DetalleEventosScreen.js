import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DetalleEventosScreen = () => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  // Simulación de los detalles del evento para demostrar cómo se puede ver sin fetch
  useEffect(() => {
    // Simula un tiempo de carga
    setTimeout(() => {
      // Datos simulados de un evento
      const mockEvent = {
        name: "Concierto de Jazz",
        start_date: "2024-09-20",
        description: "Un evento único de jazz en vivo.",
        id_event_category: "Música",
        id_event_location: "Teatro Principal",
        duration_in_minutes: 120,
        price: 50,
        max_assistance: 200,
        attended: [
          { id: 1, name: "Juan Pérez", attended: true },
          { id: 2, name: "María Gómez", attended: false },
        ],
      };
      setEvent(mockEvent);
      setLoading(false);  // Termina el loading
    }, 2000);  // Simula 2 segundos de carga
  }, []);

  const showAlert = (title, message) => {
    Alert.alert(
      title,
      message,
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
      { cancelable: false }
    );
  };

  const handleSubscribe = () => {
    setLoadingAction(true);
    setTimeout(() => {
      setSubscribed(true);
      setLoadingAction(false);
      showAlert(event.name, 'Suscripción exitosa!');
    }, 1000); // Simula una suscripción exitosa después de 1 segundo
  };

  const handleUnsubscribe = () => {
    setLoadingAction(true);
    setTimeout(() => {
      setSubscribed(false);
      setLoadingAction(false);
      showAlert(event.name, 'Te has desuscrito del evento.');
    }, 1000); // Simula una desuscripción exitosa después de 1 segundo
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error al cargar los detalles del evento</Text>
      </View>
    );
  }

  const isFutureEvent = new Date(event.start_date) > new Date();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>EVENTO</Text>
      </View>
      <View style={styles.eventContent}>
        <Text style={styles.eventName}>{event.name}</Text>
        <Text style={styles.eventDate}>{new Date(event.start_date).toLocaleDateString()}</Text>
        <Text style={styles.eventDescription}>{event.description}</Text>
        <View style={styles.eventDetails}>
          <Text style={styles.detailText}>Categoría: {event.id_event_category}</Text>
          <Text style={styles.detailText}>Ubicación: {event.id_event_location}</Text>
          <Text style={styles.detailText}>Duración en minutos: {event.duration_in_minutes}</Text>
          <Text style={styles.detailText}>Precio: ${event.price}</Text>
          <Text style={styles.detailText}>Capacidad: {event.max_assistance}</Text>
        </View>

        {isFutureEvent ? (
          <View style={styles.subscriptionContainer}>
            <TouchableOpacity
              style={[styles.button, subscribed ? styles.unsubscribeButton : styles.subscribeButton]}
              onPress={subscribed ? handleUnsubscribe : handleSubscribe}
              disabled={loadingAction}
            >
              <Text style={styles.buttonText}>
                {subscribed ? 'DESUSCRIBIRSE' : 'SUSCRIBIRSE'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.attendeesContainer}>
            <Text style={styles.attendeesTitle}>INSCRITOS</Text>
            <FlatList
              data={event.attended}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.attendeeItem}>
                  <Text style={styles.attendeeName}>{item.name}</Text>
                  <Ionicons
                    name={item.attended ? "checkmark-circle" : "close-circle"}
                    size={24}
                    color={item.attended ? "#4CAF50" : "#F44336"}
                  />
                </View>
              )}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#4A90E2',
    padding: 16,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  eventContent: {
    flex: 1,
    padding: 16,
  },
  eventName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventDate: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  eventDescription: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  eventDetails: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  detailText: {
    fontSize: 14,
    marginBottom: 8,
  },
  subscriptionContainer: {
    alignItems: 'center',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscribeButton: {
    backgroundColor: '#4CAF50',
  },
  unsubscribeButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  attendeesContainer: {
    flex: 1,
  },
  attendeesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  attendeeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  attendeeName: {
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default DetalleEventosScreen;