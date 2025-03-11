import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { fieldService } from '../services/api';

export default function AddFieldScreen({ navigation }) {
  const [name, setName] = useState('');
  const [size, setSize] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = async () => {
    try {
      await fieldService.createField({
        name,
        size_acres: parseFloat(size),
        location,
      });
      navigation.goBack();
    } catch (error) {
      console.error('Error creating field:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Field Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        label="Size (acres)"
        value={size}
        onChangeText={setSize}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        label="Location"
        value={location}
        onChangeText={setLocation}
        style={styles.input}
      />

      <Button 
        mode="contained" 
        onPress={handleSubmit}
        disabled={!name || !size}
        style={styles.button}
      >
        Add Field
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});
