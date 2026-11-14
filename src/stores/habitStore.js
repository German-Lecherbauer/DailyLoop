import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { toggleHabitStatus } from '../utils/habitUtils';

const HABITS_KEY = 'habits';

export const useHabitStore = create((set, get) => ({
  habits: [],

  loadHabits: async () => {
    try {
      const storedHabits = await AsyncStorage.getItem(HABITS_KEY);

      if (storedHabits !== null) {
        set({
          habits: JSON.parse(storedHabits),
        });
      } else {
        set({
          habits: [],
        });
      }
    } catch (error) {
      console.error('Error cargando hábitos:', error);
    }
  },

  addHabit: async (habit) => {
    const updatedHabits = [
      ...get().habits,
      habit,
    ];

    set({
      habits: updatedHabits,
    });

    await AsyncStorage.setItem(
      HABITS_KEY,
      JSON.stringify(updatedHabits)
    );
  },

  deleteHabit: async (id) => {
    const updatedHabits = get().habits.filter(
      (habit) => habit.id !== id
    );

    set({
      habits: updatedHabits,
    });

    await AsyncStorage.setItem(
      HABITS_KEY,
      JSON.stringify(updatedHabits)
    );
  },

  toggleHabit: async (id) => {
    const updatedHabits = get().habits.map(
      (habit) => {
        if (habit.id === id) {
          return toggleHabitStatus(habit);
        }

        return habit;
      }
    );

    set({
      habits: updatedHabits,
    });

    await AsyncStorage.setItem(
      HABITS_KEY,
      JSON.stringify(updatedHabits)
    );
  },

  updateHabit: async (id, changes) => {
    const updatedHabits = get().habits.map(
      (habit) =>
        habit.id === id
          ? {
              ...habit,
              ...changes,
            }
          : habit
    );

    set({
      habits: updatedHabits,
    });

    await AsyncStorage.setItem(
      HABITS_KEY,
      JSON.stringify(updatedHabits)
    );
  },
}));