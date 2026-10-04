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

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (username.trim() === '' || password.trim() === '') {
      Alert.alert('Error', 'Completa usuario y contraseña');
      return;
    }

    try {
      const storedUser = await AsyncStorage.getItem('user');

      if (storedUser === null) {
        Alert.alert(
          'Error',
          'No hay ningún usuario registrado'
        );
        return;
      }

      const user = JSON.parse(storedUser);

      if (
        username.trim() === user.username &&
        password === user.password
      ) {
        navigation.replace('Home');
      } else {
        Alert.alert(
          'Error',
          'Usuario o contraseña incorrectos'
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'No se pudo iniciar sesión'
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoIcon}>↻</Text>
        </View>

        <Text style={styles.logo}>DailyLoop</Text>

        <Text style={styles.subtitle}>
          Construí hábitos. Mantené tu racha.
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>
          Usuario
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Ingresá tu usuario"
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
          placeholder="Ingresá tu contraseña"
          placeholderTextColor="#A1A1AA"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleLogin}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>
            Iniciar sesión
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate('Register')}
          activeOpacity={0.7}
        >
          <Text style={styles.registerText}>
            ¿No tenés cuenta?
          </Text>

          <Text style={styles.registerLink}>
            Registrate
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>
        Un día a la vez. Una racha a la vez.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAF8',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: 42,
  },

  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },

  logoIcon: {
    fontSize: 38,
    color: '#16A34A',
    fontWeight: '700',
  },

  logo: {
    fontSize: 38,
    fontWeight: '800',
    color: '#18181B',
    letterSpacing: -1,
  },

  subtitle: {
    fontSize: 15,
    color: '#71717A',
    textAlign: 'center',
    marginTop: 8,
  },

  form: {
    width: '100%',
  },

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#27272A',
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

  primaryButton: {
    backgroundColor: '#16A34A',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 4,

    shadowColor: '#16A34A',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,

    elevation: 4,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  registerButton: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  registerText: {
    color: '#71717A',
    fontSize: 14,
  },

  registerLink: {
    color: '#16A34A',
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 5,
  },

  footer: {
    textAlign: 'center',
    color: '#A1A1AA',
    fontSize: 12,
    marginTop: 40,
  },
});