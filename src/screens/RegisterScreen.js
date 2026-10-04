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

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (username.trim() === '' || password.trim() === '') {
      Alert.alert('Error', 'Completa usuario y contraseña');
      return;
    }

    const user = {
      username: username.trim(),
      password: password,
    };

    try {
      await AsyncStorage.setItem(
        'user',
        JSON.stringify(user)
      );

      Alert.alert(
        'Registro exitoso',
        'Tu usuario fue creado correctamente'
      );

      navigation.goBack();
    } catch (error) {
      Alert.alert(
        'Error',
        'No se pudo registrar el usuario'
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🌱</Text>
        </View>

        <Text style={styles.title}>
          Crear cuenta
        </Text>

        <Text style={styles.subtitle}>
          Empezá hoy a construir mejores hábitos.
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>
          Usuario
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Elegí un usuario"
          placeholderTextColor="#A1A1AA"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <Text style={styles.label}>
          Contraseña
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Elegí una contraseña"
          placeholderTextColor="#A1A1AA"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>
            Crear mi cuenta
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.messageCard}>
        <Text style={styles.messageTitle}>
          🔥 Empezá tu primera racha
        </Text>

        <Text style={styles.messageText}>
          Registrate, creá tus hábitos y marcá tu progreso día a día.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAF8',
    paddingHorizontal: 24,
    paddingTop: 45,
  },

  header: {
    alignItems: 'center',
    marginBottom: 38,
  },

  iconContainer: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },

  icon: {
    fontSize: 31,
  },

  title: {
    color: '#18181B',
    fontSize: 32,
    fontWeight: '800',
  },

  subtitle: {
    color: '#71717A',
    fontSize: 15,
    marginTop: 8,
    textAlign: 'center',
  },

  form: {
    width: '100%',
  },

  label: {
    color: '#27272A',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 16,
    color: '#18181B',
    marginBottom: 20,
  },

  button: {
    backgroundColor: '#16A34A',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 5,

    shadowColor: '#16A34A',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,

    elevation: 4,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  messageCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 16,
    padding: 18,
    marginTop: 32,
  },

  messageTitle: {
    color: '#166534',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 5,
  },

  messageText: {
    color: '#4B5563',
    fontSize: 13,
    lineHeight: 19,
  },
});