export const toggleHabitStatus = (habit) => {
  return {
    ...habit,
    completed: !habit.completed,
    streak: habit.completed
      ? Math.max(0, habit.streak - 1)
      : habit.streak + 1,
  };
};