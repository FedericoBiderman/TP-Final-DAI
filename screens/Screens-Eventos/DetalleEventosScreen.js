import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const DetalleEventosScreen = ({ route }) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const baseUrl = "https://welcome-chamois-aware.ngrok-free.app";
  const navigation = useNavigation();
  const { eventId } = route.params;

  useEffect(() => {
    fetchEventDetails();
  }, []);

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/event/${eventId}`);
      console.log("Datos recibidos:", JSON.stringify(response.data)); // Log detallado
      setEvent(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener los detalles del evento:", error);
      setLoading(false);
    }
  };

  const showAlert = (title, message) => {
    Alert.alert(
      title,
      message,
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
      { cancelable: false }
    );
  };

  const handleSubscribe = async () => {
    setLoadingAction(true);
    try {
      await axios.post(`${baseUrl}/api/event/${eventId}/enrollment/attended`);
      showAlert(event.name, 'Suscripción exitosa!');
    } catch (error) {
      console.error("Error al suscribirse:", error);
      showAlert("Error", "No se pudo realizar la suscripción");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleUnsubscribe = async () => {
    setLoadingAction(true);
    try {
      await axios.delete(`${baseUrl}/api/event/${eventId}/enrollment/attended`);
      showAlert(event.name, 'Te has desuscrito del evento.');
    } catch (error) {
      console.error("Error al desuscribirse:", error);
      showAlert("Error", "No se pudo realizar la desuscripción");
    } finally {
      setLoadingAction(false);
    }
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
          <Text style={styles.detailText}>Ubicación: {event.location_name}</Text>
          <Text style={styles.detailText}>Duración en minutos: {event.duration_in_minutes}</Text>
          <Text style={styles.detailText}>Precio: ${event.price}</Text>
          <Text style={styles.detailText}>Capacidad: {event.max_assistance}</Text>
        </View>

        {!isFutureEvent ? (
          <View style={styles.attendeesContainer}>
            <Text style={styles.attendeesTitle}>INSCRITOS</Text>
            {event.attended && event.attended.length > 0 ? (
              <FlatList
                data={event.attended}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.attendeeItem}>
                    <Text style={styles.attendeeName}>
                      {item.first_name} {item.last_name}
                    </Text>
                    <Ionicons
                      name={item.attended ? "checkmark-circle" : "close-circle"}
                      size={24}
                      color={item.attended ? "#4CAF50" : "#F44336"}
                    />
                  </View>
                )}
              />
            ) : (
              <Text style={styles.noAttendeesText}>No hay inscritos en este evento.</Text>
            )}
          </View>
        ) : (
          <View style={styles.subscriptionContainer}>
            <TouchableOpacity
              style={[styles.button, event.subscribed ? styles.unsubscribeButton : styles.subscribeButton]}
              onPress={event.subscribed ? handleUnsubscribe : handleSubscribe}
              disabled={loadingAction}
            >
              <Text style={styles.buttonText}>
                {event.subscribed ? 'DESUSCRIBIRSE' : 'SUSCRIBIRSE'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('EventosScreen')}>
          <Ionicons name="calendar-outline" size={24} color="#4c669f" />
          <Text style={styles.tabText}>Eventos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('CategoriasScreen')}>
          <Ionicons name="search-outline" size={24} color="#4c669f" />
          <Text style={styles.tabText}>Categorías</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('ProfileScreen')}>
          <Ionicons name="person-outline" size={24} color="#4c669f" />
          <Text style={styles.tabText}>Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('LoginScreen')}>
          <Ionicons name="menu-outline" size={24} color="#4c669f" />
          <Text style={styles.tabText}>Menú</Text>
        </TouchableOpacity>
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
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  tabItem: {
    alignItems: "center",
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
  },
  noAttendeesText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default DetalleEventosScreen;