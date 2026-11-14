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
} from 'react-native';

import * as Notifications from 'expo-notifications';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import { useHabitStore } from '../stores/habitStore';

export default function AddHabitScreen({ navigation }) {
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState('Diario');
  const [imageUri, setImageUri] = useState(null);
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] =
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

      const currentLocation =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

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

      contact: null,
      calendarEventId: null,
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
            onPress={() =>
              setFrequency('Semanal')
            }
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

        <Text style={styles.label}>
          Evidencia del hábito
        </Text>

        <Text style={styles.imageDescription}>
          Podés sacar una foto o elegir una imagen
          desde tu galería.
        </Text>

        <View style={styles.imageActions}>
          <TouchableOpacity
            style={styles.resourceButton}
            onPress={takePhoto}
            activeOpacity={0.8}
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
            activeOpacity={0.8}
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
              style={styles.removeImageButton}
              onPress={removeImage}
            >
              <Text style={styles.removeImageText}>
                Quitar imagen
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.label}>
          Ubicación del hábito
        </Text>

        <Text style={styles.imageDescription}>
          Podés asociar tu ubicación actual al hábito.
        </Text>

        <TouchableOpacity
          style={styles.locationButton}
          onPress={getCurrentLocation}
          activeOpacity={0.8}
          disabled={loadingLocation}
        >
          <Text style={styles.locationButtonIcon}>
            📍
          </Text>

          <Text style={styles.locationButtonText}>
            {loadingLocation
              ? 'Obteniendo ubicación...'
              : 'Usar ubicación actual'}
          </Text>
        </TouchableOpacity>

        {location && (
          <View style={styles.locationPreview}>
            <Text style={styles.locationPreviewTitle}>
              Ubicación asociada
            </Text>

            <Text style={styles.locationPreviewText}>
              Lat: {location.latitude.toFixed(5)}
            </Text>

            <Text style={styles.locationPreviewText}>
              Long: {location.longitude.toFixed(5)}
            </Text>

            <TouchableOpacity
              onPress={removeLocation}
              style={styles.removeLocationButton}
            >
              <Text style={styles.removeLocationText}>
                Quitar ubicación
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.notificationBox}>
          <View style={styles.notificationIcon}>
            <Text>🔔</Text>
          </View>

          <View style={styles.notificationInfo}>
            <Text
              style={styles.notificationTitle}
            >
              Recordatorio activado
            </Text>

            <Text
              style={styles.notificationText}
            >
              Recibirás una notificación de prueba
              10 segundos después.
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAF8',
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

  imageDescription: {
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

  removeImageButton: {
    alignSelf: 'center',
    marginTop: 10,
  },

  removeImageText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '700',
  },

  locationButton: {
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

  locationButtonIcon: {
    fontSize: 19,
    marginRight: 8,
  },

  locationButtonText: {
    color: '#166534',
    fontSize: 13,
    fontWeight: '800',
  },

  locationPreview: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderRadius: 14,
    padding: 14,
    marginBottom: 24,
  },

  locationPreviewTitle: {
    color: '#166534',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 5,
  },

  locationPreviewText: {
    color: '#71717A',
    fontSize: 12,
    marginBottom: 2,
  },

  removeLocationButton: {
    marginTop: 8,
  },

  removeLocationText: {
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