import React from 'react';
import {
  render,
  screen,
  fireEvent,
} from '@testing-library/react-native';

import HabitItem from '../src/components/HabitItem';

describe('HabitItem', () => {
  const habit = {
    id: '1',
    name: 'Leer 20 minutos',
    frequency: 'Diario',
    completed: false,
    streak: 3,
  };

  test('muestra correctamente el nombre del hábito', async () => {
    await render(
      <HabitItem
        habit={habit}
        onToggle={() => {}}
        onDelete={() => {}}
      />
    );

    expect(
      screen.getByText('Leer 20 minutos')
    ).toBeTruthy();
  });

  test('ejecuta onToggle al presionar completar hábito', async () => {
    const onToggleMock = jest.fn();

    await render(
      <HabitItem
        habit={habit}
        onToggle={onToggleMock}
        onDelete={() => {}}
      />
    );

    await fireEvent.press(
      screen.getByText('Completar hábito')
    );

    expect(onToggleMock).toHaveBeenCalledWith('1');
  });
});