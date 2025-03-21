import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { supabase } from '../lib/supabase';

const AuthScreen = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('landlord'); // Default user type
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMessage, setAuthMessage] = useState('');

  const handleAuth = async () => {
    try {
      if (isSignIn) {
        // Sign In
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setIsAuthenticated(true);
        setAuthMessage(`Welcome back, ${email}!`);
      } else {
        // Sign Up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              user_type: userType,
            },
          },
        });
        if (error) throw error;
        setAuthMessage('Sign up successful! Please check your email for verification.');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleViewProperties = () => {
    // Add navigation to properties screen here
    Alert.alert('Success', 'Navigating to properties...');
  };

  const UserTypeSelector = () => (
    <View style={styles.userTypeContainer}>
      {['landlord', 'landlord_realtor', 'tenant_realtor'].map((type) => (
        <TouchableOpacity
          key={type}
          style={[
            styles.userTypeButton,
            userType === type && styles.selectedUserType,
          ]}
          onPress={() => setUserType(type)}
        >
          <Text style={styles.userTypeText}>
            {type.split('_').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (isAuthenticated || authMessage) {
    return (
      <View style={styles.container}>
        <Text style={styles.successMessage}>{authMessage}</Text>
        {isAuthenticated && (
          <TouchableOpacity 
            style={styles.viewPropertiesButton}
            onPress={handleViewProperties}
          >
            <Text style={styles.buttonText}>View Properties</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={styles.signOutButton}
          onPress={async () => {
            await supabase.auth.signOut();
            setIsAuthenticated(false);
            setAuthMessage('');
            setEmail('');
            setPassword('');
          }}
        >
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isSignIn ? 'Sign In' : 'Create Account'}
      </Text>

      {!isSignIn && <UserTypeSelector />}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleAuth}>
        <Text style={styles.buttonText}>
          {isSignIn ? 'Sign In' : 'Sign Up'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsSignIn(!isSignIn)}>
        <Text style={styles.toggleText}>
          {isSignIn
            ? "Don't have an account? Sign Up"
            : 'Already have an account? Sign In'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 15,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  toggleText: {
    color: '#007AFF',
    textAlign: 'center',
  },
  userTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  userTypeButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  selectedUserType: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  userTypeText: {
    textAlign: 'center',
    fontSize: 12,
  },
  successMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#28a745',
  },
  viewPropertiesButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
  signOutButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
});

export default AuthScreen; 