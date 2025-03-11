import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput, SegmentedButtons } from 'react-native-paper';
import { fieldService } from '../services/api';

export default function AddActivityScreen({ route, navigation }) {
  const { fieldId } = route.params;
  const [activityType, setActivityType] = useState('');
  const [details, setDetails] = useState('');

  const handleSubmit = async () => {
    try {
      await fieldService.createActivity({
        field_id: fieldId,
        activity_type: activityType,
        details,
        created_by: 'mobile-user', // In a real app, this would come from authentication
        date: new Date().toISOString()
      });
      navigation.goBack();
    } catch (error) {
      console.error('Error creating activity:', error);
    }
  };

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={activityType}
        onValueChange={setActivityType}
        buttons={[
          { value: 'sprayed', label: 'Spray' },
          { value: 'tilled', label: 'Till' },
          { value: 'planted', label: 'Plant' },
          { value: 'harvested', label: 'Harvest' },
        ]}
        style={styles.buttons}
      />

      <TextInput
        label="Details"
        value={details}
        onChangeText={setDetails}
        multiline
        numberOfLines={4}
        style={styles.input}
      />

      <Button 
        mode="contained" 
        onPress={handleSubmit}
        disabled={!activityType}
        style={styles.button}
      >
        Record Activity
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
  buttons: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});
