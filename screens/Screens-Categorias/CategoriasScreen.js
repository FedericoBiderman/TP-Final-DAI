import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator,RefreshControl, StatusBar } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const CategoriasScreen = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const baseUrl = 'https://welcome-chamois-aware.ngrok-free.app';

  const fetchCategorias = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/event-category`);
      console.log(response);
      console.log('Datos recibidos:', response.data.categorias?.length || 0);
      setCategorias(response.data);
    } catch (error) {
      console.error('Error al obtener las categorías:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      //a
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCategorias();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCategorias();
  }, []);

  const renderCategoriaItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoriaContainer}
      onPress={() => navigation.navigate('EventosScreen', { categoriaId: item.id, categoriaNombre: item.name })}
    >
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.categoriaGradient}
      >
        <Text style={styles.categoriaName}>{item.name}</Text>
        <Text style={styles.categoriaDescription}>{item.description}</Text>
      </LinearGradient>
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
        <Text style={styles.headerText}>CATEGORÍAS</Text>
      </LinearGradient>
      <FlatList
        data={categorias}
        renderItem={renderCategoriaItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.noCategoriasText}>No hay categorías disponibles</Text>
        }
      />
      <View style={styles.footer}>
      <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('DetalleEventosScreen')}>
          <Ionicons name="calendar-outline" size={24} color="#4c669f" />
          <Text style={styles.tabText}>Eventos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('CategoriasScreen')}>
          <Ionicons name="search-outline" size={24} color="#4c669f" />
          <Text style={styles.tabText}>Categorías</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('ProfileScreen')}>
          <Ionicons name="person-outline" size={24} color="#4c669f" />
          <Text style={styles.tabText}>Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('LoginScreen')}>
          <Ionicons name="menu-outline" size={24} color="#4c669f" />
          <Text style={styles.tabText}>Menú</Text>
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
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
  },
  categoriaContainer: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  categoriaGradient: {
    padding: 16,
  },
  categoriaImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  categoriaName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  categoriaDescription: {
    fontSize: 14,
    color: '#e0e0e0',
  },
  noCategoriasText: {
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

export default CategoriasScreen;