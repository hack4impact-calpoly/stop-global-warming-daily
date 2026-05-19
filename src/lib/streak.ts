export const getDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const calculateStreak = (completedDates: Date[]) => {
  const completedSet = new Set(completedDates.map((date) => getDateKey(new Date(date))));

  const currentDate = new Date();

  if (!completedSet.has(getDateKey(currentDate))) {
    currentDate.setDate(currentDate.getDate() - 1);
  }

  let streak = 0;

  while (completedSet.has(getDateKey(currentDate))) {
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
};
