import React from 'react';
import { SafeAreaView } from 'react-native';
import AuthScreen from './src/screens/AuthScreen';

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AuthScreen />
    </SafeAreaView>
  );
};

export default App;
