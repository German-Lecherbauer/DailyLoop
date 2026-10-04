# DailyLoop

DailyLoop es una aplicación móvil desarrollada con React Native y Expo para el seguimiento de hábitos y rutinas.

La aplicación permite crear hábitos, marcarlos como realizados, mantener rachas y visualizar el progreso diario.

## Parcial 1 - Aplicaciones Móviles

Opción elegida:

**Seguimiento de hábitos o rutinas**

## Tecnologías utilizadas

- React Native
- Expo
- React Navigation
- AsyncStorage
- Expo Notifications
- Jest
- React Native Testing Library

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
- Persistencia de datos utilizando AsyncStorage.

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

### Notificaciones

Al crear un hábito se programa una notificación local de prueba.

La notificación se dispara 10 segundos después de crear el hábito.

Ejemplo:

> DailyLoop 🔥  
> Recordá cumplir tu hábito: Ir al gimnasio

### Navegación

La aplicación utiliza React Navigation con Stack Navigation.

Pantallas:

- Login
- Registro
- Mis hábitos
- Nuevo hábito

### Testing

Se utiliza Jest junto con React Native Testing Library.

Se implementaron 3 tests:

1. Verificación del renderizado del nombre de un hábito.
2. Verificación de la interacción con el botón "Completar hábito".
3. Verificación de la lógica de incremento de racha.

Para ejecutar los tests:

~~~bash
npm test
~~~

Resultado esperado:

~~~text
Test Suites: 2 passed, 2 total
Tests:       3 passed, 3 total
~~~

## Instalación

Clonar el repositorio:

~~~bash
git clone https://github.com/German-Lecherbauer/DailyLoop.git
~~~

Ingresar al proyecto:

~~~bash
cd DailyLoop
~~~

Instalar dependencias:

~~~bash
npm install
~~~

Ejecutar la aplicación:

~~~bash
npx expo start
~~~

Luego abrir la aplicación utilizando Expo Go.

## Estructura del proyecto

~~~text
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
│   ├── storage/
│   │   └── storage.js
│   │
│   └── utils/
│       └── habitUtils.js
│
├── App.js
├── package.json
└── README.md
~~~

## Video Demo

Video demostrativo de la aplicación:

**YouTube:** LINK_DEL_VIDEO

## Autor

Germán Lecherbauer

Aplicaciones Móviles - 2026