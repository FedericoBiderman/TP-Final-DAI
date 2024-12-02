import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const DetalleEventosScreen = ({ route, userData }) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [usuarioInscripto, setUsuarioInscripto] = useState(false);
  const baseUrl = "https://properly-definite-mastodon.ngrok-free.app";
  const navigation = useNavigation();
  const { eventId } = route.params;

  useFocusEffect(
    React.useCallback(() => {
      fetchEventDetails();
      verificarInscripcion();
    }, [eventId, userData?.usuario?.id])
  );

  const verificarInscripcion = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/event/${eventId}/enrollment`);
      // Verificamos si hay datos y es un array
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        const inscripciones = response.data;
        // Buscamos si el usuario actual está inscrito
        const estaInscrito = inscripciones.some(inscripcion => 
          inscripcion.user_id === userData?.usuario?.id
        );
        setUsuarioInscripto(estaInscrito);
      } else {
        // Si no hay inscripciones, el usuario no está inscrito
        setUsuarioInscripto(false);
      }
    } catch (error) {
      console.error("Error al verificar inscripción:", error);
      // En caso de error, asumimos que no está inscrito
      setUsuarioInscripto(false);
    }
  };

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/event/${eventId}`);
      setEvent(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener los detalles del evento:", error);
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    setLoadingAction(true);
  
    try {
      // Recupera el token desde AsyncStorage
      const miToken = await AsyncStorage.getItem('userToken');
      if (!miToken) {
        console.error("Error: No se encontró el token en AsyncStorage");
        showAlert("Error", "No se pudo recuperar el token para la suscripción.");
        return;
      }
      console.log("Token recuperado:", miToken);
  
      // Realiza la solicitud POST
      await axios.post(`${baseUrl}/api/event/${eventId}/enrollment`, null, {
        headers: { Authorization: `Bearer ${miToken}` },
      });
  
      // Actualiza el estado y muestra la alerta de éxito
      setUsuarioInscripto(true);
      showAlert(event.name, 'Suscripción exitosa!');
      fetchEventDetails();
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
      await axios.delete(`${baseUrl}/api/event/${eventId}/enrollment`, {
        data: { id_user: userData?.usuario?.id },
        headers: { Authorization: `Bearer ${userData?.token}` },
      });
      setUsuarioInscripto(false);
      showAlert(event.name, 'Te has desuscrito del evento.');
      fetchEventDetails();
    } catch (error) {
      console.error("Error al desuscribirse:", error);
      showAlert("Error", "No se pudo realizar la desuscripción");
    } finally {
      setLoadingAction(false);
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
        <Text style={styles.attendeeObservation}>
          Opinión: {item.observations || "Sin comentarios."}
        </Text>
        <Text style={styles.attendeeRating}>
          Calificación: {item.rating || "Sin calificación."}
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
  <Text style={styles.noAttendeesText}>No hay opiniones registradas para este evento.</Text>
)}

          </View>
        ) : (
          <View style={styles.subscriptionContainer}>
            <TouchableOpacity
              style={[styles.button, usuarioInscripto ? styles.unsubscribeButton : styles.subscribeButton]}
              onPress={usuarioInscripto ? handleUnsubscribe : handleSubscribe}
              disabled={loadingAction}
            >
              <Text style={styles.buttonText}>
                {usuarioInscripto ? 'DESUSCRIBIRSE' : 'SUSCRIBIRSE'}
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