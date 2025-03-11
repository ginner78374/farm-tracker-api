import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, Title, FAB, Text } from 'react-native-paper';
import { fieldService } from '../services/api';

export default function FieldListScreen({ navigation }) {
  const [fields, setFields] = useState([]);

  useEffect(() => {
    loadFields();
  }, []);

  const loadFields = async () => {
    try {
      const response = await fieldService.getFields();
      setFields(response.data);
    } catch (error) {
      console.error('Error loading fields:', error);
    }
  };

  const renderField = ({ item }) => (
    <Card 
      style={styles.card}
      onPress={() => navigation.navigate('FieldDetail', { fieldId: item.id })}
    >
      <Card.Content>
        <Title>{item.name}</Title>
        <Text>Size: {item.size_acres} acres</Text>
        <Text>Location: {item.location}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={fields}
        renderItem={renderField}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddField')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
