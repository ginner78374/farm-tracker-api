import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, FAB, List, Divider } from 'react-native-paper';
import { fieldService } from '../services/api';

export default function FieldDetailScreen({ route, navigation }) {
  const { fieldId } = route.params;
  const [field, setField] = useState(null);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    loadFieldData();
  }, [fieldId]);

  const loadFieldData = async () => {
    try {
      const [fieldResponse, activitiesResponse] = await Promise.all([
        fieldService.getField(fieldId),
        fieldService.getFieldActivities(fieldId)
      ]);
      setField(fieldResponse.data);
      setActivities(activitiesResponse.data);
    } catch (error) {
      console.error('Error loading field data:', error);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'sprayed': return 'spray';
      case 'tilled': return 'tractor';
      case 'planted': return 'seed';
      case 'harvested': return 'harvest';
      default: return 'information';
    }
  };

  if (!field) return null;

  return (
    <View style={styles.container}>
      <ScrollView>
        <Card style={styles.fieldCard}>
          <Card.Content>
            <Title>{field.name}</Title>
            <Paragraph>Size: {field.size_acres} acres</Paragraph>
            <Paragraph>Location: {field.location}</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.activitiesCard}>
          <Card.Content>
            <Title>Activities</Title>
            {activities.map((activity, index) => (
              <React.Fragment key={activity.id}>
                <List.Item
                  title={activity.activity_type.charAt(0).toUpperCase() + activity.activity_type.slice(1)}
                  description={`${new Date(activity.date).toLocaleDateString()}\n${activity.details || ''}`}
                  left={props => <List.Icon {...props} icon={getActivityIcon(activity.activity_type)} />}
                />
                {index < activities.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Card.Content>
        </Card>
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddActivity', { fieldId })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  fieldCard: {
    margin: 16,
    elevation: 4,
  },
  activitiesCard: {
    margin: 16,
    marginTop: 0,
    elevation: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
