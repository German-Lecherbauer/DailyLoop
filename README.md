# DailyLoop

DailyLoop es una aplicación móvil desarrollada con React Native y Expo para el seguimiento de hábitos y rutinas.

La aplicación permite crear hábitos, marcarlos como realizados, mantener rachas, visualizar el progreso diario y asociar distintos recursos a cada hábito, como imágenes, ubicación, contactos y recordatorios en calendario.

## Aplicaciones Móviles - Parcial 1 y Parcial 2

Opción elegida:

**Seguimiento de hábitos o rutinas**

---

## Tecnologías utilizadas

- React Native
- Expo SDK 58
- React Navigation
- AsyncStorage
- Zustand
- Expo Notifications
- Expo Image Picker
- Expo Location
- Expo Contacts
- Expo Calendar
- Expo UI
- Jest
- React Native Testing Library

---

## Funcionalidades

### Autenticación

- Registro local de usuario.
- Inicio de sesión mediante usuario y contraseña.
- Datos almacenados con AsyncStorage.
- Validación de credenciales.
- Cierre de sesión.

### Hábitos

- Crear nuevos hábitos.
- Seleccionar frecuencia diaria o semanal.
- Mostrar lista de hábitos.
- Marcar hábitos como realizados.
- Eliminar hábitos.
- Persistencia local de los hábitos.
- Asociación de recursos adicionales a cada hábito.

### Rachas

Cada hábito posee una racha.

Al completar un hábito:

- Se incrementa la racha.
- Se actualiza visualmente el estado del hábito.
- Se actualiza el progreso diario.

### Progreso diario

La pantalla principal muestra:

- Cantidad de hábitos completados.
- Cantidad total de hábitos.
- Porcentaje de progreso.
- Barra visual de progreso.

---

## Funcionalidades agregadas en el Parcial 2

### Cámara y galería

La aplicación permite asociar una imagen a un hábito.

El usuario puede:

- Tomar una fotografía utilizando la cámara.
- Seleccionar una imagen desde la galería.
- Visualizar la imagen antes de guardar el hábito.
- Visualizar la imagen asociada desde la pantalla principal.
- Eliminar la imagen antes de guardar el hábito.

Los permisos de cámara y galería se solicitan antes de utilizar cada funcionalidad.

En caso de que el usuario rechace el permiso, la aplicación muestra un mensaje informativo.

### Ubicación

Se utiliza `expo-location` para obtener la ubicación actual del dispositivo.

El usuario puede:

- Solicitar su ubicación actual.
- Asociar las coordenadas al hábito.
- Visualizar latitud y longitud.
- Eliminar la ubicación antes de guardar el hábito.

El permiso de ubicación se solicita antes de intentar acceder al GPS.

### Contactos

Se utiliza `expo-contacts` para acceder a los contactos del dispositivo.

El usuario puede:

- Abrir una lista de contactos.
- Seleccionar un compañero o entrenador.
- Asociar su nombre y número de teléfono al hábito.
- Visualizar el contacto desde la pantalla principal.
- Quitar el contacto antes de guardar el hábito.

El permiso de contactos se solicita antes de acceder a la agenda.

### Calendario

Se utiliza `expo-calendar` para crear recordatorios relacionados con los hábitos.

El usuario puede:

- Elegir una fecha.
- Elegir una hora.
- Crear un evento en el calendario del dispositivo.
- Asociar el evento al hábito.
- Visualizar el recordatorio desde la pantalla principal.

Los recordatorios se muestran con formato:

```text
16/11 · 18.55
```

Antes de utilizar el calendario se solicita el permiso correspondiente.

### Notificaciones locales

Al crear un hábito se programa una notificación local.

La notificación se dispara 10 segundos después de guardar el hábito.

Ejemplo:

> DailyLoop 🔥  
> Recordá cumplir tu hábito: Ir al gimnasio

Esta funcionalidad utiliza `expo-notifications`.

---

## Manejo de permisos

DailyLoop solicita permisos antes de utilizar funcionalidades nativas del dispositivo.

Se manejan permisos para:

- Cámara.
- Galería.
- Ubicación.
- Contactos.
- Calendario.
- Notificaciones.

La aplicación verifica si el permiso ya fue otorgado antes de solicitarlo nuevamente.

En caso de que el acceso sea rechazado, se muestra un mensaje explicando por qué es necesario.

---

## Estado global con Zustand

En el Parcial 2 se incorporó Zustand para manejar globalmente el estado de los hábitos.

El store centraliza:

- Lista de hábitos.
- Carga inicial.
- Creación de hábitos.
- Eliminación de hábitos.
- Marcado de hábitos como completados.
- Actualización de hábitos.

La persistencia continúa utilizando AsyncStorage.

Esto permite separar el manejo del estado de las pantallas y evitar mantener la lista de hábitos directamente mediante estados locales.

---

## Navegación

La aplicación utiliza React Navigation con Stack Navigation.

Pantallas:

- Login
- Registro
- Mis hábitos
- Nuevo hábito

---

## Testing

Se utiliza Jest junto con React Native Testing Library.

Se implementaron 3 tests:

1. Verificación del renderizado del nombre de un hábito.
2. Verificación de la interacción con el botón `Completar hábito`.
3. Verificación de la lógica de incremento de racha.

Para ejecutar los tests:

```bash
npm test
```

Resultado actual:

```text
PASS __tests__/habitUtils.test.js
PASS __tests__/HabitItem.test.js

Test Suites: 2 passed, 2 total
Tests:       3 passed, 3 total
```

---

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/German-Lecherbauer/DailyLoop.git
```

Ingresar al proyecto:

```bash
cd DailyLoop
```

Instalar dependencias:

```bash
npm install
```

---

## Ejecución

Debido a que el proyecto utiliza módulos nativos como calendario y `@expo/ui`, se utiliza un Development Build.

Para iniciar Metro:

```bash
npx expo start --dev-client
```

También se puede iniciar limpiando la caché:

```bash
npx expo start -c
```

Luego se ejecuta la aplicación utilizando el Development Build instalado en el dispositivo o emulador Android.

---

## Estructura del proyecto

```text
DailyLoop/
│
├── __tests__/
│   ├── HabitItem.test.js
│   └── habitUtils.test.js
│
├── src/
│   ├── components/
│   │   └── HabitItem.js
│   │
│   ├── screens/
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── HomeScreen.js
│   │   └── AddHabitScreen.js
│   │
│   ├── stores/
│   │   └── habitStore.js
│   │
│   ├── storage/
│   │   └── storage.js
│   │
│   └── utils/
│       └── habitUtils.js
│
├── App.js
├── app.json
├── eas.json
├── package.json
└── README.md
```

---

## Uso de Inteligencia Artificial

Durante el desarrollo se utilizó ChatGPT como herramienta de apoyo para analizar implementaciones, detectar problemas y proponer refactorizaciones.

Algunos ejemplos de consultas utilizadas fueron:

```text
Tengo una app Expo SDK 58 de seguimiento de hábitos.
Necesito migrar el manejo de los hábitos a Zustand,
manteniendo la persistencia con AsyncStorage y sin cambiar
el comportamiento actual de la aplicación.
```

```text
Necesito agregar expo-location.
Antes de acceder al GPS debe verificarse el permiso,
manejar el caso rechazado y guardar latitud y longitud
dentro del hábito.
```

```text
Necesito integrar expo-calendar en Expo SDK 58.
El usuario debe poder elegir fecha y hora,
crear un evento y asociarlo al hábito.
```

Las respuestas generadas fueron utilizadas como referencia y luego adaptadas a:

- La estructura existente del proyecto.
- Expo SDK 58.
- Las APIs utilizadas por DailyLoop.
- El diseño visual de la aplicación.
- Los requerimientos específicos del parcial.

Las implementaciones finales fueron probadas manualmente en Android y verificadas mediante los tests automatizados del proyecto.

---

## Video Demo

### Parcial 1

Video demostrativo:

https://youtube.com/shorts/ig-p5Cps1kk?si=KvI-ldZf3nhfqFVw

### Parcial 2

Video demostrativo de las nuevas funcionalidades:

https://www.youtube.com/shorts/zyF9FTvm8jA

---

## Repositorio

GitHub:

https://github.com/German-Lecherbauer/DailyLoop

---

## Autor

**Germán Lecherbauer**

Aplicaciones Móviles - 2026