import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import axios from "axios";

const EventosScreen = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();
  
  const baseUrl = "https://properly-definite-mastodon.ngrok-free.app";
  
  // Obtenemos categoriaId y categoriaNombre desde los parámetros
  const categoriaId = route.params?.categoriaId;
  const categoriaNombre = route.params?.categoriaNombre;

  const fetchEventos = async () => {
    try {
      // Limpia los eventos y muestra el indicador de carga antes de la solicitud
      setEventos([]);
      setLoading(true);

      // Define la URL basada en la presencia de categoriaNombre
      const miUrl = categoriaNombre
        ? `${baseUrl}/api/event?category=${categoriaNombre}`
        : `${baseUrl}/api/event`;
  
      console.log("URL solicitada:", miUrl);
  
      // Realiza la solicitud a la URL correcta
      const response = await axios.get(miUrl);
  
      console.log("Datos recibidos:", response.data);
  
      setEventos(response.data.events || []); // Asegura que siempre se establezca un array vacío si no hay eventos
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener los eventos:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, [categoriaNombre]); // Dependencia en categoriaNombre para recargar cuando cambie

  const renderEventItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.eventContainer}
      onPress={() =>
        navigation.navigate("DetalleEventosScreen", { eventId: item.id })
      }
    >
      <Text style={styles.eventName}>{item.name}</Text>
      <Text style={styles.eventDescription}>{item.description}</Text>
      <Text style={styles.eventDetails}>
        Fecha: {new Date(item.start_date).toLocaleDateString()}
        id: {item.id}
      </Text>
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
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>EVENTOS {categoriaNombre ? `- ${categoriaNombre}` : ""}</Text>
      <ScrollView contentContainerStyle={styles.listContainer}>
        {eventos.length > 0 ? (
          eventos.map(renderEventItem)
        ) : (
          <Text style={styles.noEventsText}>No hay eventos disponibles</Text>
        )}
      </ScrollView>
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
    backgroundColor: "#f0f0f0",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    padding: 16,
    backgroundColor: "#ffffff",
  },
  listContainer: {
    padding: 16,
  },
  eventContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  eventDetails: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  noEventsText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
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
});

export default EventosScreen;
