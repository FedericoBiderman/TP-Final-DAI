import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const CategoriasScreen = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const baseUrl = 'https://welcome-chamois-aware.ngrok-free.app'; // Reemplaza con tu base URL

  const fetchCategorias = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/event-category`);
      console.log('Datos recibidos:', response.data.categorias.length); // Para depuración
      setCategorias(response.data.categories); // Asumimos que las categorías están en response.data.categories
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener las categorías:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const renderCategoriaItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.categoriaContainer}
      onPress={() => navigation.navigate('EventosPorCategoriaScreen', { categoriaId: item.id })}
    >
      <Text style={styles.categoriaName}>{item.name}</Text>
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
      <Text style={styles.header}>CATEGORÍAS</Text>
      <ScrollView contentContainerStyle={styles.listContainer}>
        {categorias.length > 0 ? (
          categorias.map(renderCategoriaItem)
        ) : (
          <Text style={styles.noCategoriasText}>No hay categorías disponibles</Text>
        )}
      </ScrollView>
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
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
  },
  listContainer: {
    padding: 16,
  },
  categoriaContainer: {
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
  categoriaName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  noCategoriasText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  }
});

export default CategoriasScreen;