import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl, StatusBar } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const EventosPorCategoriaScreen = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const baseUrl = 'https://welcome-chamois-aware.ngrok-free.app';

  const fetchEventos = async () => {
    try {
      const miUrl = `${baseUrl}/api/event/?category=Obras Teatrales`;
      console.log('miUrl', miUrl);
      const eventosResponse = await axios.get(miUrl);
      console.log('eventosResponse', eventosResponse);
      console.log('Eventos recibidos:', eventosResponse.data.length);
      setEventos(eventosResponse.data);
    } catch (error) {
      console.error('Error al obtener los eventos:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchEventos();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchEventos();
  }, []);

  const renderEventoItem = ({ item }) => (
    <TouchableOpacity
      style={styles.eventContainer}
      onPress={() => navigation.navigate('DetalleEventosScreen', { eventId: item.id })}
    >
      <Text style={styles.eventName}>{item.name}</Text>
      <Text style={styles.eventDescription}>{item.description}</Text>
      <Text style={styles.eventDetails}>
        Fecha: {new Date(item.start_date).toLocaleDateString()}
        {item.id && ` - ID: ${item.id}`}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4c669f" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Obras Teatrales</Text>
      </LinearGradient>
      <FlatList
        data={eventos}
        renderItem={renderEventoItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.noEventosText}>No hay eventos disponibles para esta categoría</Text>
        }
      />
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('DetalleEventosScreen')}>
          <Ionicons name="calendar-outline" size={24} color="#4c669f" />
          <Text style={styles.footerText}>Eventos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('CategoriasScreen')}>
          <Ionicons name="search-outline" size={24} color="#4c669f" />
          <Text style={styles.footerText}>Categorías</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('ProfileScreen')}>
          <Ionicons name="person-outline" size={24} color="#4c669f" />
          <Text style={styles.footerText}>Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('LoginScreen')}>
          <Ionicons name="menu-outline" size={24} color="#4c669f" />
          <Text style={styles.footerText}>Menú</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  eventContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  eventDetails: {
    fontSize: 12,
    color: '#999',
  },
  noEventosText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  footerItem: {
    alignItems: 'center',
  },
  footerText: {
    marginTop: 4,
    fontSize: 12,
    color: '#4c669f',
  },
});

export default EventosPorCategoriaScreen;