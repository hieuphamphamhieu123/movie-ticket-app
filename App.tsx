import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  console.log('🚀 App starting...');
  
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}