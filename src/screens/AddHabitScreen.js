import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import * as Notifications from 'expo-notifications';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Contacts from 'expo-contacts';
import * as Calendar from 'expo-calendar';

import { useHabitStore } from '../stores/habitStore';
import DateTimePicker from '@expo/ui/community/datetime-picker';

export default function AddHabitScreen({ navigation }) {
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState('Diario');

  const [imageUri, setImageUri] = useState(null);

  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] =
    useState(false);

  const [selectedContact, setSelectedContact] =
    useState(null);

  const [contacts, setContacts] = useState([]);
  const [contactModalVisible, setContactModalVisible] =
    useState(false);

  const [loadingContacts, setLoadingContacts] =
    useState(false);

  const [calendarEventId, setCalendarEventId] =
  useState(null);

const [calendarEventDate, setCalendarEventDate] =
  useState(null);

const [loadingCalendar, setLoadingCalendar] =
  useState(false);


const [reminderDate, setReminderDate] = useState(() => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date;
});

const [showDatePicker, setShowDatePicker] =
  useState(false);

const [showTimePicker, setShowTimePicker] =
  useState(false);

  const addHabit = useHabitStore(
    (state) => state.addHabit
  );

  const requestNotificationPermission = async () => {
    const { status } =
      await Notifications.requestPermissionsAsync();

    return status === 'granted';
  };

  const scheduleHabitNotification = async (
    habitName
  ) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'DailyLoop 🔥',
        body: `Recordá cumplir tu hábito: ${habitName}`,
      },

      trigger: {
        type:
          Notifications
            .SchedulableTriggerInputTypes
            .TIME_INTERVAL,
        seconds: 10,
      },
    });
  };

  // =========================
  // CÁMARA
  // =========================

  const ensureCameraPermission = async () => {
    const currentPermission =
      await ImagePicker.getCameraPermissionsAsync();

    if (currentPermission.granted) {
      return true;
    }

    if (
      currentPermission.status === 'undetermined' ||
      currentPermission.canAskAgain
    ) {
      const requestedPermission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (requestedPermission.granted) {
        return true;
      }
    }

    Alert.alert(
      'Permiso de cámara',
      'Necesitamos acceso a la cámara para sacar una foto del hábito.'
    );

    return false;
  };

  // =========================
  // GALERÍA
  // =========================

  const ensureGalleryPermission = async () => {
    const currentPermission =
      await ImagePicker.getMediaLibraryPermissionsAsync();

    if (currentPermission.granted) {
      return true;
    }

    if (
      currentPermission.status === 'undetermined' ||
      currentPermission.canAskAgain
    ) {
      const requestedPermission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (requestedPermission.granted) {
        return true;
      }
    }

    Alert.alert(
      'Permiso de galería',
      'Necesitamos acceso a tus fotos para seleccionar una imagen.'
    );

    return false;
  };

  const takePhoto = async () => {
    try {
      const hasPermission =
        await ensureCameraPermission();

      if (!hasPermission) {
        return;
      }

      const result =
        await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'No se pudo abrir la cámara'
      );
    }
  };

  const pickImage = async () => {
    try {
      const hasPermission =
        await ensureGalleryPermission();

      if (!hasPermission) {
        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'No se pudo abrir la galería'
      );
    }
  };

  const removeImage = () => {
    setImageUri(null);
  };

  // =========================
  // UBICACIÓN
  // =========================

  const getCurrentLocation = async () => {
    try {
      setLoadingLocation(true);

      const currentPermission =
        await Location.getForegroundPermissionsAsync();

      let permission = currentPermission;

      if (!currentPermission.granted) {
        permission =
          await Location.requestForegroundPermissionsAsync();
      }

      if (!permission.granted) {
        Alert.alert(
          'Permiso de ubicación',
          'Necesitamos acceso a tu ubicación para asociarla al hábito.'
        );

        return;
      }

      let currentLocation =
  await Location.getLastKnownPositionAsync();

if (!currentLocation) {
  currentLocation =
    await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
}
      setLocation({
        latitude:
          currentLocation.coords.latitude,
        longitude:
          currentLocation.coords.longitude,
      });

      Alert.alert(
        'Ubicación guardada',
        'La ubicación actual se asociará al hábito.'
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'No se pudo obtener la ubicación actual'
      );
    } finally {
      setLoadingLocation(false);
    }
  };

  const removeLocation = () => {
    setLocation(null);
  };

  // =========================
  // CONTACTOS
  // =========================

  const openContacts = async () => {
    try {
      setLoadingContacts(true);

      const currentPermission =
        await Contacts.getPermissionsAsync();

      let permission = currentPermission;

      if (!currentPermission.granted) {
        permission =
          await Contacts.requestPermissionsAsync();
      }

      if (!permission.granted) {
        Alert.alert(
          'Permiso de contactos',
          'Necesitamos acceso a tus contactos para asociar un compañero o entrenador al hábito.'
        );

        return;
      }

      const contactList =
        await Contacts.Contact.getAllDetails(
          [
            Contacts.ContactField.FULL_NAME,
            Contacts.ContactField.PHONES,
          ],
          {
            sortOrder:
              Contacts.ContactsSortOrder.GivenName,
          }
        );

      if (contactList.length === 0) {
        Alert.alert(
          'Sin contactos',
          'No encontramos contactos disponibles en el dispositivo.'
        );

        return;
      }

      setContacts(contactList);
      setContactModalVisible(true);
    } catch (error) {
      console.log('Error contactos:', error);

      Alert.alert(
        'Error',
        'No se pudieron cargar los contactos'
      );
    } finally {
      setLoadingContacts(false);
    }
  };

  const selectContact = (contact) => {
    const selected = {
      id: contact.id,
      name:
        contact.fullName &&
        contact.fullName.trim() !== ''
          ? contact.fullName
          : 'Contacto sin nombre',

      phone:
        contact.phones &&
        contact.phones.length > 0
          ? contact.phones[0].number
          : null,
    };

    setSelectedContact(selected);
    setContactModalVisible(false);
  };

  const removeContact = () => {
    setSelectedContact(null);
  };

  const createCalendarReminder = async () => {
  if (name.trim() === '') {
    Alert.alert(
      'Nombre requerido',
      'Primero ingresá el nombre del hábito.'
    );

    return;
  }

  try {
    setLoadingCalendar(true);

    const currentPermission =
      await Calendar.getCalendarPermissions();

    let permission = currentPermission;

    if (!currentPermission.granted) {
      permission =
        await Calendar.requestCalendarPermissions();
    }

    if (!permission.granted) {
      Alert.alert(
        'Permiso de calendario',
        'Necesitamos acceso al calendario para crear el recordatorio.'
      );

      return;
    }

    const calendars =
      await Calendar.getCalendars(
        Calendar.EntityTypes.EVENT
      );
let writableCalendar = calendars.find(
  (calendar) =>
    calendar.allowsModifications &&
    calendar.isPrimary
) ?? calendars.find(
  (calendar) => calendar.allowsModifications
);

if (!writableCalendar) {
  writableCalendar =
    await Calendar.createCalendar({
      title: 'DailyLoop',
      color: '#16A34A',
      entityType: Calendar.EntityTypes.EVENT,
      source: {
        isLocalAccount: true,
        name: 'DailyLoop',
      },
      name: 'DailyLoop',
      ownerAccount: 'personal',
      accessLevel:
        Calendar.CalendarAccessLevel.OWNER,
    });
}

    const startDate = new Date(reminderDate);

    const endDate = new Date(
  startDate.getTime() + 30 * 60 * 1000
); 
    const event =
  await writableCalendar.createEvent({
    title: `DailyLoop - ${name.trim()}`,
    notes: `Recordatorio del hábito ${name.trim()}`,
    startDate,
    endDate,
    allDay: false,
  });

const verifiedEvent =
  await Calendar.ExpoCalendarEvent.get(event.id);

console.log(
  'Evento verificado:',
  verifiedEvent.title,
  verifiedEvent.startDate
);

setCalendarEventId(verifiedEvent.id);
setCalendarEventDate(
  new Date(verifiedEvent.startDate)
);

    Alert.alert(
      'Recordatorio creado',
      'El evento fue agregado al calendario en la fecha y hora seleccionadas.'
    );
  } catch (error) {
    console.log('Error calendario:', error);

    Alert.alert(
      'Error',
      'No se pudo crear el recordatorio en el calendario.'
    );
  } finally {
    setLoadingCalendar(false);
  }
};

  // =========================
  // GUARDAR HÁBITO
  // =========================

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
      frequency,
      completed: false,
      streak: 0,

      imageUri,
      location,
      contact: selectedContact,

      calendarEventId,
      calendarEventDate:
      calendarEventDate
      ? calendarEventDate.toISOString()
      : null,
    };

    try {
      await addHabit(newHabit);

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
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
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
              onPress={() =>
                setFrequency('Diario')
              }
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
              onPress={() =>
                setFrequency('Semanal')
              }
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

          {/* FOTO */}

          <Text style={styles.label}>
            Evidencia del hábito
          </Text>

          <Text style={styles.description}>
            Podés sacar una foto o elegir una imagen
            desde tu galería.
          </Text>

          <View style={styles.imageActions}>
            <TouchableOpacity
              style={styles.resourceButton}
              onPress={takePhoto}
            >
              <Text style={styles.resourceIcon}>
                📷
              </Text>

              <Text style={styles.resourceButtonText}>
                Cámara
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resourceButton}
              onPress={pickImage}
            >
              <Text style={styles.resourceIcon}>
                🖼️
              </Text>

              <Text style={styles.resourceButtonText}>
                Galería
              </Text>
            </TouchableOpacity>
          </View>

          {imageUri && (
            <View style={styles.previewContainer}>
              <Image
                source={{ uri: imageUri }}
                style={styles.previewImage}
              />

              <TouchableOpacity
                onPress={removeImage}
                style={styles.removeButton}
              >
                <Text style={styles.removeText}>
                  Quitar imagen
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* RECURSOS */}

<Text style={styles.label}>
  Recursos del hábito
</Text>

<Text style={styles.description}>
  Asociá ubicación o un compañero al hábito.
</Text>

<View style={styles.resourceRow}>
  <TouchableOpacity
    style={styles.compactResourceButton}
    onPress={getCurrentLocation}
    disabled={loadingLocation}
  >
    <Text style={styles.compactResourceIcon}>
      📍
    </Text>

    <Text style={styles.compactResourceText}>
      {loadingLocation
        ? 'Buscando...'
        : location
        ? 'Ubicación ✓'
        : 'Ubicación'}
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.compactResourceButton}
    onPress={openContacts}
    disabled={loadingContacts}
  >
    {loadingContacts ? (
      <ActivityIndicator
        size="small"
        color="#166534"
      />
    ) : (
      <>
        <Text style={styles.compactResourceIcon}>
          👤
        </Text>

        <Text style={styles.compactResourceText}>
          {selectedContact
            ? 'Contacto ✓'
            : 'Contacto'}
        </Text>
      </>
    )}
  </TouchableOpacity>
</View>

{location && (
  <View style={styles.compactPreview}>
    <View style={styles.compactPreviewContent}>
      <Text style={styles.dataPreviewTitle}>
        📍 Ubicación asociada
      </Text>

      <Text style={styles.dataPreviewText}>
        {location.latitude.toFixed(5)},{' '}
        {location.longitude.toFixed(5)}
      </Text>
    </View>

    <TouchableOpacity onPress={removeLocation}>
      <Text style={styles.removeText}>
        Quitar
      </Text>
    </TouchableOpacity>
  </View>
)}

{selectedContact && (
  <View style={styles.compactPreview}>
    <View style={styles.compactPreviewContent}>
      <Text style={styles.dataPreviewTitle}>
        👤 Contacto asociado
      </Text>

      <Text style={styles.contactName}>
        {selectedContact.name}
      </Text>

      <Text style={styles.dataPreviewText}>
        {selectedContact.phone
          ? selectedContact.phone
          : 'Sin número de teléfono'}
      </Text>
    </View>

    <TouchableOpacity onPress={removeContact}>
      <Text style={styles.removeText}>
        Quitar
      </Text>
    </TouchableOpacity>
  </View>
)}

{/* CALENDARIO */}

<Text style={styles.label}>
  Recordatorio en calendario
</Text>

<Text style={styles.description}>
  Elegí cuándo querés recibir el recordatorio.
</Text>

<View style={styles.calendarRow}>
  <TouchableOpacity
    style={styles.calendarButton}
    onPress={() => setShowDatePicker(true)}
  >
    <Text style={styles.calendarIcon}>📆</Text>

    <View>
      <Text style={styles.calendarButtonLabel}>
        Fecha
      </Text>

      <Text style={styles.calendarButtonValue}>
  {`${String(reminderDate.getDate()).padStart(2, '0')}/${String(
    reminderDate.getMonth() + 1
  ).padStart(2, '0')}`}
</Text>
    </View>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.calendarButton}
    onPress={() => setShowTimePicker(true)}
  >
    <Text style={styles.calendarIcon}>🕒</Text>

    <View>
      <Text style={styles.calendarButtonLabel}>
        Hora
      </Text>

      <Text style={styles.calendarButtonValue}>
  {`${String(reminderDate.getHours()).padStart(2, '0')}.${String(
    reminderDate.getMinutes()
  ).padStart(2, '0')}`}
</Text>
    </View>
  </TouchableOpacity>
</View>

{showDatePicker && (
  <DateTimePicker
    value={reminderDate}
    mode="date"
    presentation="dialog"
    onChange={(event, selectedDate) => {
      setShowDatePicker(false);

      if (selectedDate) {
        const updatedDate = new Date(reminderDate);

        updatedDate.setFullYear(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate()
        );

        setReminderDate(updatedDate);
      }
    }}
  />
)}

{showTimePicker && (
  <DateTimePicker
    value={reminderDate}
    mode="time"
    presentation="dialog"
    onChange={(event, selectedDate) => {
      setShowTimePicker(false);

      if (selectedDate) {
        const updatedDate = new Date(reminderDate);

        updatedDate.setHours(
          selectedDate.getHours(),
          selectedDate.getMinutes(),
          0,
          0
        );

        setReminderDate(updatedDate);
      }
    }}
  />
)}

<TouchableOpacity
  style={styles.fullResourceButton}
  onPress={createCalendarReminder}
  disabled={loadingCalendar || !!calendarEventId}
>
  {loadingCalendar ? (
    <ActivityIndicator
      size="small"
      color="#166534"
    />
  ) : (
    <>
      <Text style={styles.fullResourceIcon}>
        📅
      </Text>

      <Text style={styles.fullResourceText}>
        {calendarEventId
          ? 'Recordatorio creado ✓'
          : 'Crear recordatorio'}
      </Text>
    </>
  )}
</TouchableOpacity>

{calendarEventDate && (
  <View style={styles.dataPreview}>
    <Text style={styles.dataPreviewTitle}>
      Evento asociado
    </Text>

    <Text style={styles.dataPreviewText}>
  {`${String(calendarEventDate.getDate()).padStart(2, '0')}/${String(
    calendarEventDate.getMonth() + 1
  ).padStart(2, '0')} · ${String(
    calendarEventDate.getHours()
  ).padStart(2, '0')}.${String(
    calendarEventDate.getMinutes()
  ).padStart(2, '0')}`}
</Text>
  </View>
)}

          {/* NOTIFICACIÓN */}

          <View style={styles.notificationBox}>
            <View style={styles.notificationIcon}>
              <Text>🔔</Text>
            </View>
<View style={styles.notificationInfo}>
  <Text style={styles.notificationTitle}>
    Notificación local activada
  </Text>

  <Text style={styles.notificationText}>
    Se enviará una notificación en 10 segundos.
  </Text>
</View>
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={saveHabit}
          >
            <Text style={styles.saveButtonText}>
              Crear hábito
            </Text>
          </TouchableOpacity>
          
        </View>

        <Text style={styles.tip}>
          💡 La constancia vale más que la
          perfección.
        </Text>
      </ScrollView>

      {/* MODAL CONTACTOS */}

      <Modal
        visible={contactModalVisible}
        animationType="slide"
        onRequestClose={() =>
          setContactModalVisible(false)
        }
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>
                Seleccionar contacto
              </Text>

              <Text style={styles.modalSubtitle}>
                Elegí un compañero o entrenador
              </Text>
            </View>

            <TouchableOpacity
              style={styles.modalClose}
              onPress={() =>
                setContactModalVisible(false)
              }
            >
              <Text style={styles.modalCloseText}>
                Cerrar
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={contacts}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.contactItem}
                onPress={() =>
                  selectContact(item)
                }
              >
                <View style={styles.contactAvatar}>
                  <Text style={styles.contactAvatarText}>
                    👤
                  </Text>
                </View>

                <View style={styles.contactInfo}>
                  <Text style={styles.contactItemName}>
                    {item.fullName &&
                    item.fullName.trim() !== ''
                      ? item.fullName
                      : 'Contacto sin nombre'}
                  </Text>

                  <Text
                    style={styles.contactItemPhone}
                  >
                    {item.phones &&
                    item.phones.length > 0
                      ? item.phones[0].number
                      : 'Sin teléfono'}
                  </Text>
                </View>

                <Text style={styles.contactArrow}>
                  ›
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAF8',
  },

  calendarRow: {
  flexDirection: 'row',
  gap: 10,
  marginBottom: 14,
},

calendarButton: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#F0FDF4',
  borderWidth: 1,
  borderColor: '#BBF7D0',
  borderRadius: 14,
  paddingHorizontal: 12,
  paddingVertical: 11,
},

calendarIcon: {
  fontSize: 20,
  marginRight: 8,
},

calendarButtonLabel: {
  color: '#71717A',
  fontSize: 10,
  fontWeight: '600',
},

calendarButtonValue: {
  color: '#166534',
  fontSize: 12,
  fontWeight: '800',
  marginTop: 2,
},

resourceRow: {
  flexDirection: 'row',
  gap: 10,
  marginBottom: 14,
},

compactResourceButton: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#F0FDF4',
  borderWidth: 1,
  borderColor: '#BBF7D0',
  borderRadius: 14,
  paddingVertical: 12,
},

compactResourceIcon: {
  fontSize: 18,
  marginRight: 7,
},

compactResourceText: {
  color: '#166534',
  fontSize: 12,
  fontWeight: '800',
},

compactPreview: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#FAFAFA',
  borderWidth: 1,
  borderColor: '#E4E4E7',
  borderRadius: 14,
  padding: 12,
  marginBottom: 12,
},

compactPreviewContent: {
  flex: 1,
  marginRight: 12,
},

  content: {
    padding: 22,
    paddingBottom: 40,
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

  description: {
    color: '#71717A',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 13,
  },

  imageActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },

  resourceButton: {
    flex: 1,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },

  resourceIcon: {
    fontSize: 22,
    marginBottom: 5,
  },

  resourceButtonText: {
    color: '#166534',
    fontSize: 13,
    fontWeight: '800',
  },

  previewContainer: {
    marginBottom: 24,
  },

  previewImage: {
    width: '100%',
    height: 190,
    borderRadius: 16,
    backgroundColor: '#F4F4F5',
  },

  fullResourceButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',

    borderRadius: 14,
    paddingVertical: 14,

    marginBottom: 16,
  },

  fullResourceIcon: {
    fontSize: 19,
    marginRight: 8,
  },

  fullResourceText: {
    color: '#166534',
    fontSize: 13,
    fontWeight: '800',
  },

  dataPreview: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E4E4E7',

    borderRadius: 14,
    padding: 14,

    marginBottom: 24,
  },

  dataPreviewTitle: {
    color: '#166534',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 5,
  },

  dataPreviewText: {
    color: '#71717A',
    fontSize: 12,
    marginBottom: 2,
  },

  contactName: {
    color: '#18181B',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 3,
  },

  removeButton: {
    marginTop: 9,
    alignSelf: 'flex-start',
  },

  removeText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '700',
  },

 notificationBox: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#F0FDF4',
  borderWidth: 1,
  borderColor: '#BBF7D0',
  paddingHorizontal: 11,
  paddingVertical: 9,
  borderRadius: 14,
  marginBottom: 14,
},

 notificationIcon: {
  width: 30,
  height: 30,
  borderRadius: 10,
  backgroundColor: '#DCFCE7',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 10,
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

  modalContainer: {
    flex: 1,
    backgroundColor: '#F7FAF8',
    paddingHorizontal: 20,
    paddingTop: 60,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginBottom: 24,
  },

  modalTitle: {
    color: '#18181B',
    fontSize: 25,
    fontWeight: '800',
  },

  modalSubtitle: {
    color: '#71717A',
    fontSize: 13,
    marginTop: 4,
  },

  modalClose: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 10,
  },

  modalCloseText: {
    color: '#166534',
    fontSize: 12,
    fontWeight: '800',
  },

  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#E7ECE8',

    borderRadius: 15,

    padding: 13,

    marginBottom: 10,
  },

  contactAvatar: {
    width: 42,
    height: 42,

    borderRadius: 13,

    backgroundColor: '#DCFCE7',

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 12,
  },

  contactAvatarText: {
    fontSize: 18,
  },

  contactInfo: {
    flex: 1,
  },

  contactItemName: {
    color: '#18181B',
    fontSize: 14,
    fontWeight: '700',
  },

  contactItemPhone: {
    color: '#71717A',
    fontSize: 12,
    marginTop: 3,
  },

  contactArrow: {
    color: '#16A34A',
    fontSize: 27,
    marginLeft: 8,
  },
});