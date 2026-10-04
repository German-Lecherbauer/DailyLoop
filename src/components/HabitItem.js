import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function HabitItem({
  habit,
  onToggle,
  onDelete,
}) {
  return (
    <View
      style={[
        styles.card,
        habit.completed && styles.completedCard,
      ]}
    >
      <View style={styles.topRow}>
        <View
          style={[
            styles.iconContainer,
            habit.completed && styles.completedIcon,
          ]}
        >
          <Text
            style={[
              styles.icon,
              habit.completed && styles.completedIconText,
            ]}
          >
            {habit.completed ? '✓' : '◎'}
          </Text>
        </View>

        <View style={styles.info}>
          <Text
            style={[
              styles.name,
              habit.completed && styles.completedName,
            ]}
          >
            {habit.name}
          </Text>

          <View style={styles.detailsRow}>
            <View style={styles.frequencyBadge}>
              <Text style={styles.frequencyText}>
                {habit.frequency}
              </Text>
            </View>

            <Text style={styles.streak}>
              🔥 {habit.streak} días
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.completeButton,
            habit.completed && styles.undoButton,
          ]}
          onPress={() => onToggle(habit.id)}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.completeButtonText,
              habit.completed && styles.undoButtonText,
            ]}
          >
            {habit.completed
              ? 'Completado ✓'
              : 'Completar hábito'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(habit.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.deleteText}>
            Eliminar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,

    borderWidth: 1,
    borderColor: '#E7ECE8',

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,

    elevation: 3,
  },

  completedCard: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  completedIcon: {
    backgroundColor: '#16A34A',
  },

  icon: {
    fontSize: 22,
    color: '#16A34A',
    fontWeight: 'bold',
  },

  completedIconText: {
    color: '#FFFFFF',
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#18181B',
    marginBottom: 8,
  },

  completedName: {
    color: '#166534',
  },

  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  frequencyBadge: {
    backgroundColor: '#F4F4F5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 10,
  },

  frequencyText: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '600',
  },

  streak: {
    color: '#71717A',
    fontSize: 13,
    fontWeight: '600',
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },

  completeButton: {
    flex: 1,
    backgroundColor: '#16A34A',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },

  undoButton: {
    backgroundColor: '#DCFCE7',
  },

  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  undoButtonText: {
    color: '#166534',
  },

  deleteButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginLeft: 8,
  },

  deleteText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '600',
  },
});