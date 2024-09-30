import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl, StatusBar } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';

const EventosPorCategoriaScreen = () => {
  const [eventos, setEventos] = useState([]);
  const [categoria, setCategoria] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { categoriaId } = route.params;
  const baseUrl = 'https://welcome-chamois-aware.ngrok-free.app';

  const fetchEventos = async () => {
    try {
      const eventosResponse = await axios.get(`${baseUrl}/api/event/${categoriaId}`);
      const categoriaResponse = await axios.get(`${baseUrl}/api/event/category_name`);
      console.log('Eventos recibidos:', eventosResponse.data.length);
      setEventos(eventosResponse.data);
      setCategoria(categoriaResponse.data);
    } catch (error) {
      console.error('Error al obtener los eventos:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, [categoriaId]);

  useFocusEffect(
    useCallback(() => {
      fetchEventos();
    }, [categoriaId])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchEventos();
  }, []);

  const renderEventoItem = ({ item }) => (
    <TouchableOpacity
      style={styles.eventoContainer}
      onPress={() => navigation.navigate('DetalleEventoScreen', { eventoId: item.id })}
    >
      <View style={styles.eventoInfo}>
        <Text style={styles.eventoName}>{item.name}</Text>
        <Text style={styles.eventoDate}>{moment(item.date).format('DD/MM/YYYY HH:mm')}</Text>
        <Text style={styles.eventoLocation}>{item.location}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#4c669f" style={styles.eventoArrow} />
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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{categoria ? categoria.name : 'Eventos'}</Text>
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
    </View>
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
    paddingTop: StatusBar.currentHeight + 16,
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
  eventoContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventoImage: {
    width: 80,
    height: 80,
  },
  eventoInfo: {
    flex: 1,
    padding: 12,
  },
  eventoName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  eventoDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  eventoLocation: {
    fontSize: 14,
    color: '#666',
  },
  eventoArrow: {
    alignSelf: 'center',
    paddingRight: 12,
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