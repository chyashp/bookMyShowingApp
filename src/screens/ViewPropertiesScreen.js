import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import { supabase } from '../lib/supabase';

const ViewPropertiesScreen = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log('Fetched properties:', data);
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchProperties();
  }, []);

  // Pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchProperties();
  };

  const renderProperty = ({ item }) => {
    console.log('Rendering property:', item.id, 'Images:', item.images);
    
    return (
      <View style={styles.propertyCard}>
        {item.images && item.images.length > 0 && (
          <Image
            source={{ uri: item.images[0] }}
            style={styles.propertyImage}
            onError={(e) => console.log('Image error:', e.nativeEvent.error)}
          />
        )}
        <View style={styles.propertyInfo}>
          <Text style={styles.propertyTitle}>{item.title}</Text>
          <Text style={styles.propertyPrice}>${item.price.toLocaleString()}</Text>
          <Text style={styles.propertyAddress}>{item.address}</Text>
          <Text style={styles.propertyDetails}>
            {item.bedrooms} beds • {item.bathrooms} baths
          </Text>
          <Text style={styles.propertyType}>{item.property_type}</Text>
          <Text style={styles.propertyDescription}>{item.description}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={properties}
        renderItem={renderProperty}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  propertyCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  propertyImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  propertyInfo: {
    padding: 16,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  propertyPrice: {
    fontSize: 16,
    color: '#28a745',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  propertyAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  propertyDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  propertyType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  propertyDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default ViewPropertiesScreen; 