import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthScreen from './src/screens/AuthScreen';
import ListPropertyScreen from './src/screens/ListPropertyScreen';
import ViewPropertiesScreen from './src/screens/ViewPropertiesScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Auth" 
          component={AuthScreen} 
          options={{ title: 'Login / Register' }}
        />
        <Stack.Screen 
          name="ListProperty" 
          component={ListPropertyScreen} 
          options={{ title: 'List a Property' }}
        />
        <Stack.Screen 
          name="ViewProperties" 
          component={ViewPropertiesScreen}
          options={{ title: 'Available Properties' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
