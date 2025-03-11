import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import FieldListScreen from './src/screens/FieldListScreen';
import FieldDetailScreen from './src/screens/FieldDetailScreen';
import AddActivityScreen from './src/screens/AddActivityScreen';
import AddFieldScreen from './src/screens/AddFieldScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Fields">
          <Stack.Screen 
            name="Fields" 
            component={FieldListScreen} 
            options={{ title: 'Farm Fields' }}
          />
          <Stack.Screen 
            name="FieldDetail" 
            component={FieldDetailScreen} 
            options={{ title: 'Field Details' }}
          />
          <Stack.Screen 
            name="AddActivity" 
            component={AddActivityScreen} 
            options={{ title: 'Record Activity' }}
          />
          <Stack.Screen 
            name="AddField" 
            component={AddFieldScreen} 
            options={{ title: 'Add New Field' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
