import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { supabase } from '../lib/supabase';

const ListPropertyScreen = () => {
  const [propertyData, setPropertyData] = useState({
    title: '',
    price: '',
    address: '',
    property_type: '',
    bedrooms: '',
    bathrooms: '',
    description: '',
  });

  const handleSubmit = async () => {
    try {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      // Insert the property data
      const { data, error } = await supabase
        .from('properties')
        .insert([
          {
            ...propertyData,
            owner_id: user.id,
            price: parseFloat(propertyData.price),
            bedrooms: parseInt(propertyData.bedrooms),
            bathrooms: parseInt(propertyData.bathrooms),
            status: 'active',
          }
        ])
        .select();

      if (error) throw error;

      Alert.alert('Success', 'Property listed successfully!');
      // Reset form or navigate back
      setPropertyData({
        title: '',
        price: '',
        address: '',
        property_type: '',
        bedrooms: '',
        bathrooms: '',
        description: '',
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>List Your Property</Text>

      <Text style={styles.label}>Property Title</Text>
      <TextInput
        style={styles.input}
        value={propertyData.title}
        onChangeText={(text) => setPropertyData({ ...propertyData, title: text })}
        placeholder="Enter property title"
      />

      <Text style={styles.label}>Price</Text>
      <TextInput
        style={styles.input}
        value={propertyData.price}
        onChangeText={(text) => setPropertyData({ ...propertyData, price: text })}
        placeholder="Enter price"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        value={propertyData.address}
        onChangeText={(text) => setPropertyData({ ...propertyData, address: text })}
        placeholder="Enter property address"
        multiline
      />

      <Text style={styles.label}>Property Type</Text>
      <TextInput
        style={styles.input}
        value={propertyData.property_type}
        onChangeText={(text) => setPropertyData({ ...propertyData, property_type: text })}
        placeholder="e.g., House, Apartment, Condo"
      />

      <Text style={styles.label}>Bedrooms</Text>
      <TextInput
        style={styles.input}
        value={propertyData.bedrooms}
        onChangeText={(text) => setPropertyData({ ...propertyData, bedrooms: text })}
        placeholder="Number of bedrooms"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Bathrooms</Text>
      <TextInput
        style={styles.input}
        value={propertyData.bathrooms}
        onChangeText={(text) => setPropertyData({ ...propertyData, bathrooms: text })}
        placeholder="Number of bathrooms"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={propertyData.description}
        onChangeText={(text) => setPropertyData({ ...propertyData, description: text })}
        placeholder="Enter property description"
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>List Property</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 15,
    borderRadius: 5,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    marginVertical: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ListPropertyScreen;