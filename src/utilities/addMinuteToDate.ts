export default (minutes = 1, date: Date = new Date()): Date => {
  date.setMinutes(date.getMinutes() + minutes);
  return date;
};
