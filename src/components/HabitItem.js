import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
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
        habit.completed &&
          styles.completedCard,
      ]}
    >
      {habit.imageUri && (
        <Image
          source={{ uri: habit.imageUri }}
          style={styles.habitImage}
        />
      )}

      <View style={styles.topRow}>
        <View
          style={[
            styles.iconContainer,
            habit.completed &&
              styles.completedIcon,
          ]}
        >
          <Text
            style={[
              styles.icon,
              habit.completed &&
                styles.completedIconText,
            ]}
          >
            {habit.completed ? '✓' : '◎'}
          </Text>
        </View>

        <View style={styles.info}>
          <Text
            style={[
              styles.name,
              habit.completed &&
                styles.completedName,
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

      {habit.location && (
        <View style={styles.resourceInfo}>
          <View style={styles.resourceInfoIcon}>
            <Text>📍</Text>
          </View>

          <View style={styles.resourceInfoContent}>
            <Text style={styles.resourceInfoTitle}>
              Ubicación asociada
            </Text>

            <Text style={styles.resourceInfoText}>
              {habit.location.latitude.toFixed(5)},{' '}
              {habit.location.longitude.toFixed(5)}
            </Text>
          </View>
        </View>
      )}
      {habit.contact && (
        <View style={styles.resourceInfo}>
          <View style={styles.resourceInfoIcon}>
            <Text>👤</Text>
          </View>

          <View style={styles.resourceInfoContent}>
            <Text style={styles.resourceInfoTitle}>
              Compañero / entrenador
            </Text>

            <Text style={styles.contactName}>
              {habit.contact.name}
            </Text>

            <Text style={styles.resourceInfoText}>
              {habit.contact.phone
                ? habit.contact.phone
                : 'Sin teléfono'}
            </Text>
          </View>
        </View>
      )}

      {habit.calendarEventDate && (
        <View style={styles.resourceInfo}>
          <View style={styles.resourceInfoIcon}>
            <Text>📅</Text>
          </View>

          <View style={styles.resourceInfoContent}>
            <Text style={styles.resourceInfoTitle}>
              Recordatorio
            </Text>

            <Text style={styles.resourceInfoText}>
  {(() => {
    const date = new Date(habit.calendarEventDate);

    return `${String(date.getDate()).padStart(2, '0')}/${String(
      date.getMonth() + 1
    ).padStart(2, '0')} · ${String(
      date.getHours()
    ).padStart(2, '0')}.${String(
      date.getMinutes()
    ).padStart(2, '0')}`;
  })()}
</Text>
          </View>
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.completeButton,
            habit.completed &&
              styles.undoButton,
          ]}
          onPress={() =>
            onToggle(habit.id)
          }
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.completeButtonText,
              habit.completed &&
                styles.undoButtonText,
            ]}
          >
            {habit.completed
              ? 'Completado ✓'
              : 'Completar hábito'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() =>
            onDelete(habit.id)
          }
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

  habitImage: {
    width: '100%',
    height: 180,
    borderRadius: 15,
    marginBottom: 16,
    backgroundColor: '#F4F4F5',
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

  resourceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 14,
    padding: 12,
    marginTop: 14,
  },

  resourceInfoIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  resourceInfoContent: {
    flex: 1,
  },

  resourceInfoTitle: {
    color: '#166534',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 2,
  },

  resourceInfoText: {
    color: '#64748B',
    fontSize: 11,
  },

  contactName: {
    color: '#18181B',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
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