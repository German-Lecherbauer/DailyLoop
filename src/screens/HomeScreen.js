import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import HabitItem from '../components/HabitItem';
import { toggleHabitStatus } from '../utils/habitUtils';

export default function HomeScreen({ navigation }) {
  const [habits, setHabits] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadHabits();
    }, [])
  );

  const loadHabits = async () => {
    try {
      const storedHabits = await AsyncStorage.getItem('habits');

      if (storedHabits !== null) {
        setHabits(JSON.parse(storedHabits));
      } else {
        setHabits([]);
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'No se pudieron cargar los hábitos'
      );
    }
  };

  const saveHabits = async (updatedHabits) => {
    try {
      await AsyncStorage.setItem(
        'habits',
        JSON.stringify(updatedHabits)
      );

      setHabits(updatedHabits);
    } catch (error) {
      Alert.alert(
        'Error',
        'No se pudieron guardar los hábitos'
      );
    }
  };

  const toggleHabit = (id) => {
    const updatedHabits = habits.map((habit) => {
      if (habit.id === id) {
        return toggleHabitStatus(habit);
      }

      return habit;
    });

    saveHabits(updatedHabits);
  };

  const deleteHabit = (id) => {
    Alert.alert(
      'Eliminar hábito',
      '¿Seguro que querés eliminar este hábito?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            const updatedHabits = habits.filter(
              (habit) => habit.id !== id
            );

            saveHabits(updatedHabits);
          },
        },
      ]
    );
  };

  const logout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Querés cerrar tu sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar sesión',
          onPress: () => navigation.replace('Login'),
        },
      ]
    );
  };

  const completedHabits = habits.filter(
    (habit) => habit.completed
  ).length;

  const progress =
    habits.length === 0
      ? 0
      : Math.round(
          (completedHabits / habits.length) * 100
        );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HabitItem
            habit={item}
            onToggle={toggleHabit}
            onDelete={deleteHabit}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <View style={styles.headerTextContainer}>
                <Text style={styles.brand}>
                  DailyLoop
                </Text>

                <Text style={styles.title}>
                  Mis hábitos
                </Text>

                <Text style={styles.subtitle}>
                  Un día a la vez. Una racha a la vez.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.logoutButton}
                onPress={logout}
              >
                <Text style={styles.logoutText}>
                  Salir
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <View>
                  <Text style={styles.progressLabel}>
                    Progreso de hoy
                  </Text>

                  <Text style={styles.progressValue}>
                    {completedHabits} de {habits.length}
                  </Text>
                </View>

                <View style={styles.percentageCircle}>
                  <Text style={styles.percentage}>
                    {progress}%
                  </Text>
                </View>
              </View>

              <View style={styles.progressBackground}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${progress}%`,
                    },
                  ]}
                />
              </View>

              <Text style={styles.progressMessage}>
                {habits.length === 0
                  ? 'Creá tu primer hábito y empezá tu racha.'
                  : progress === 100
                  ? '🔥 ¡Completaste todos tus hábitos!'
                  : 'Seguí así, cada hábito suma.'}
              </Text>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Tus hábitos
              </Text>

              <Text style={styles.habitCount}>
                {habits.length}
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyLogoCircle}>
              <Text style={styles.emptyLogoIcon}>
                ↻
              </Text>
            </View>

            <Text style={styles.emptyTitle}>
              Tu loop empieza acá
            </Text>

            <Text style={styles.emptyText}>
              Creá tu primer hábito y empezá tu racha.
            </Text>

            <TouchableOpacity
              style={styles.emptyNewHabitButton}
              onPress={() => navigation.navigate('AddHabit')}
              activeOpacity={0.85}
            >
              <Text style={styles.plus}>+</Text>

              <Text style={styles.newHabitButtonText}>
                Nuevo hábito
              </Text>
            </TouchableOpacity>
          </View>
        }
      />

      {habits.length > 0 && (
        <TouchableOpacity
          style={styles.newHabitButton}
          onPress={() => navigation.navigate('AddHabit')}
          activeOpacity={0.85}
        >
          <Text style={styles.plus}>+</Text>

          <Text style={styles.newHabitButtonText}>
            Nuevo hábito
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAF8',
  },

  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 110,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },

  headerTextContainer: {
    flex: 1,
    paddingRight: 12,
  },

  brand: {
    color: '#16A34A',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 5,
  },

  title: {
    color: '#18181B',
    fontSize: 31,
    fontWeight: '800',
  },

  subtitle: {
    color: '#71717A',
    fontSize: 14,
    marginTop: 5,
  },

  logoutButton: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },

  logoutText: {
    color: '#166534',
    fontSize: 13,
    fontWeight: '700',
  },

  progressCard: {
    backgroundColor: '#166534',
    borderRadius: 22,
    padding: 20,
    marginBottom: 28,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  progressLabel: {
    color: '#BBF7D0',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },

  progressValue: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
  },

  percentageCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
  },

  percentage: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  progressBackground: {
    height: 8,
    backgroundColor: '#14532D',
    borderRadius: 20,
    marginTop: 20,
    overflow: 'hidden',
  },

  progressBar: {
    height: '100%',
    backgroundColor: '#86EFAC',
    borderRadius: 20,
  },

  progressMessage: {
    color: '#DCFCE7',
    fontSize: 13,
    marginTop: 12,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 20,
    color: '#18181B',
    fontWeight: '800',
  },

  habitCount: {
    color: '#166534',
    backgroundColor: '#DCFCE7',
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 8,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
  },

  emptyContainer: {
    alignItems: 'center',
    paddingTop: 28,
    paddingHorizontal: 30,
  },

  emptyLogoCircle: {
    width: 84,
    height: 84,
    borderRadius: 26,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },

  emptyLogoIcon: {
    fontSize: 42,
    color: '#16A34A',
    fontWeight: '700',
  },

  emptyTitle: {
    fontSize: 21,
    color: '#18181B',
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },

  emptyText: {
    fontSize: 14,
    color: '#71717A',
    lineHeight: 21,
    textAlign: 'center',
  },

  emptyNewHabitButton: {
    marginTop: 24,
    width: '100%',
    backgroundColor: '#16A34A',
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#16A34A',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,

    elevation: 4,
  },

  newHabitButton: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 55,

    backgroundColor: '#16A34A',

    paddingVertical: 16,
    borderRadius: 16,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#16A34A',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,

    elevation: 6,
  },

  plus: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '400',
    marginRight: 8,
    marginTop: -2,
  },

  newHabitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});