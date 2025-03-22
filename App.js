import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthScreen from './src/screens/AuthScreen';
import ListPropertyScreen from './src/screens/ListPropertyScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="ListProperty" component={ListPropertyScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
