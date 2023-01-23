import dayjs from "dayjs";
export function generateDatesFromYearBegining() {
  const firstDayOfTheYear = dayjs().startOf("year");
  const today = new Date();

  const dates = [];

  let comapareDate = firstDayOfTheYear;
  while (comapareDate.isBefore(today)) {
    dates.push(comapareDate.toDate());
    comapareDate = comapareDate.add(1, "day");
  }
  return dates;
}
