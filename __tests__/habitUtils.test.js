import { toggleHabitStatus } from '../src/utils/habitUtils';

describe('toggleHabitStatus', () => {
  test('aumenta la racha cuando se completa un hábito', () => {
    const habit = {
      id: '1',
      name: 'Ir al gimnasio',
      frequency: 'Diario',
      completed: false,
      streak: 2,
    };

    const result = toggleHabitStatus(habit);

    expect(result.completed).toBe(true);
    expect(result.streak).toBe(3);
  });
});