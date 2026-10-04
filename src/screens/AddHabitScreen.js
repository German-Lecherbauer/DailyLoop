import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

export default function AddHabitScreen({ navigation }) {
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState('Diario');

  const requestNotificationPermission = async () => {
    const { status } =
      await Notifications.requestPermissionsAsync();

    return status === 'granted';
  };

  const scheduleHabitNotification = async (habitName) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'DailyLoop 🔥',
        body: `Recordá cumplir tu hábito: ${habitName}`,
      },

      trigger: {
        type:
          Notifications.SchedulableTriggerInputTypes
            .TIME_INTERVAL,
        seconds: 10,
      },
    });
  };

  const saveHabit = async () => {
    if (name.trim() === '') {
      Alert.alert(
        'Error',
        'Ingresá un nombre para el hábito'
      );

      return;
    }

    const newHabit = {
      id: Date.now().toString(),
      name: name.trim(),
      frequency: frequency,
      completed: false,
      streak: 0,
    };

    try {
      const storedHabits =
        await AsyncStorage.getItem('habits');

      let habits = [];

      if (storedHabits !== null) {
        habits = JSON.parse(storedHabits);
      }

      habits.push(newHabit);

      await AsyncStorage.setItem(
        'habits',
        JSON.stringify(habits)
      );

      const hasPermission =
        await requestNotificationPermission();

      if (hasPermission) {
        await scheduleHabitNotification(
          newHabit.name
        );
      }

      Alert.alert(
        'Hábito creado',
        'Tu hábito fue guardado correctamente'
      );

      navigation.goBack();
    } catch (error) {
      Alert.alert(
        'Error',
        'No se pudo guardar el hábito'
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>＋</Text>
        </View>

        <Text style={styles.title}>
          Nuevo hábito
        </Text>

        <Text style={styles.subtitle}>
          Sumá una rutina y empezá una nueva racha.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>
          Nombre del hábito
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Ej: Leer 20 minutos"
          placeholderTextColor="#A1A1AA"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>
          Frecuencia
        </Text>

        <View style={styles.frequencyContainer}>
          <TouchableOpacity
            style={[
              styles.frequencyButton,
              frequency === 'Diario' &&
                styles.frequencyButtonSelected,
            ]}
            onPress={() => setFrequency('Diario')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.frequencyText,
                frequency === 'Diario' &&
                  styles.frequencyTextSelected,
              ]}
            >
              Diario
            </Text>

            <Text
              style={[
                styles.frequencyDescription,
                frequency === 'Diario' &&
                  styles.frequencyDescriptionSelected,
              ]}
            >
              Cada día
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.frequencyButton,
              frequency === 'Semanal' &&
                styles.frequencyButtonSelected,
            ]}
            onPress={() => setFrequency('Semanal')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.frequencyText,
                frequency === 'Semanal' &&
                  styles.frequencyTextSelected,
              ]}
            >
              Semanal
            </Text>

            <Text
              style={[
                styles.frequencyDescription,
                frequency === 'Semanal' &&
                  styles.frequencyDescriptionSelected,
              ]}
            >
              Cada semana
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.notificationBox}>
          <View style={styles.notificationIcon}>
            <Text>🔔</Text>
          </View>

          <View style={styles.notificationInfo}>
            <Text style={styles.notificationTitle}>
              Recordatorio activado
            </Text>

            <Text style={styles.notificationText}>
              Recibirás una notificación de prueba 10 segundos después.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveHabit}
          activeOpacity={0.85}
        >
          <Text style={styles.saveButtonText}>
            Crear hábito
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.tip}>
        💡 La constancia vale más que la perfección.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAF8',
    padding: 22,
  },

  header: {
    marginTop: 15,
    marginBottom: 28,
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  icon: {
    color: '#16A34A',
    fontSize: 30,
    fontWeight: '500',
  },

  title: {
    color: '#18181B',
    fontSize: 31,
    fontWeight: '800',
  },

  subtitle: {
    color: '#71717A',
    fontSize: 14,
    marginTop: 6,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,

    borderWidth: 1,
    borderColor: '#ECECF0',

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,

    elevation: 2,
  },

  label: {
    color: '#27272A',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 9,
  },

  input: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderRadius: 13,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 16,
    color: '#18181B',
    marginBottom: 25,
  },

  frequencyContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },

  frequencyButton: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },

  frequencyButtonSelected: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },

  frequencyText: {
    color: '#27272A',
    fontSize: 15,
    fontWeight: '800',
  },

  frequencyTextSelected: {
    color: '#FFFFFF',
  },

  frequencyDescription: {
    color: '#A1A1AA',
    fontSize: 11,
    marginTop: 3,
  },

  frequencyDescriptionSelected: {
    color: '#DCFCE7',
  },

  notificationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    padding: 14,
    borderRadius: 14,
    marginBottom: 24,
  },

  notificationIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  notificationInfo: {
    flex: 1,
  },

  notificationTitle: {
    color: '#166534',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 2,
  },

  notificationText: {
    color: '#64748B',
    fontSize: 11,
    lineHeight: 16,
  },

  saveButton: {
    backgroundColor: '#16A34A',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',

    shadowColor: '#16A34A',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,

    elevation: 4,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  tip: {
    color: '#71717A',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 24,
  },
});