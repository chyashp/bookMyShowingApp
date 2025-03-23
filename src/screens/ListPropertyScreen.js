import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../lib/supabase';
import { decode } from 'base64-arraybuffer';

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
  const [selectedImages, setSelectedImages] = useState([]);

  const handleImagePick = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'You need to allow access to your photos to upload images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsMultipleSelection: true,
        quality: 1,
        base64: true,
      });

      if (!result.canceled) {
        setSelectedImages([...selectedImages, ...result.assets]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
      console.error(error);
    }
  };

  const uploadImages = async (propertyId) => {
    const imageUrls = [];

    for (const image of selectedImages) {
      try {
        const ext = image.uri.substring(image.uri.lastIndexOf('.') + 1);
        const fileName = `${Date.now()}.${ext}`;
        const filePath = `${propertyId}/${fileName}`;

        let base64Image = image.base64;
        if (!base64Image) {
          const response = await fetch(image.uri);
          const blob = await response.blob();
          const reader = new FileReader();
          base64Image = await new Promise((resolve) => {
            reader.onload = () => {
              const base64data = reader.result.split(',')[1];
              resolve(base64data);
            };
            reader.readAsDataURL(blob);
          });
        }

        const { data, error } = await supabase.storage
          .from('property-images')
          .upload(filePath, decode(base64Image), {
            contentType: `image/${ext}`,
            upsert: false
          });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(filePath);

        imageUrls.push(publicUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
        Alert.alert('Upload Error', `Failed to upload image: ${error.message}`);
      }
    }

    return imageUrls;
  };

  const handleSubmit = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

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

      if (selectedImages.length > 0) {
        const imageUrls = await uploadImages(data[0].id);
        
        if (imageUrls.length > 0) {
          const { error: updateError } = await supabase
            .from('properties')
            .update({ images: imageUrls })
            .eq('id', data[0].id);

          if (updateError) throw updateError;
        }
      }

      Alert.alert('Success', 'Property listed successfully!');
      setPropertyData({
        title: '',
        price: '',
        address: '',
        property_type: '',
        bedrooms: '',
        bathrooms: '',
        description: '',
      });
      setSelectedImages([]);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
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

      <Text style={styles.label}>Property Images</Text>
      <TouchableOpacity style={styles.imageUploadButton} onPress={handleImagePick}>
        <Text style={styles.buttonText}>Select Images</Text>
      </TouchableOpacity>

      {selectedImages.length > 0 && (
        <View style={styles.imagePreviewContainer}>
          {selectedImages.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image.uri }}
              style={styles.imagePreview}
            />
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>List Property</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 50,
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
  imageUploadButton: {
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  imagePreview: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 5,
  },
});

export default ListPropertyScreen;