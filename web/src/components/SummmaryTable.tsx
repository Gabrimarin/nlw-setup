import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import { generateDatesFromYearBegining } from "../utils/generate-range-between-days";
import HabitDay from "./HabitDay";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

const summaryDates = generateDatesFromYearBegining();
const minimumSummaryDatesSize = 18 * 7;
const amountOfDatesToFill = minimumSummaryDatesSize - summaryDates.length;
type Summary = {
  id: number;
  date: string;
  amount: number;
  completed: number;
}[];

export default function SummmaryTable() {
  const [summary, setSummary] = useState<Summary>([]);

  useEffect(() => {
    api.get("summary").then((response) => {
      setSummary(response.data);
    });
  }, []);

  return (
    <div className="w-full flex">
      <div className="grid grid-rows-7 grid-flow-row gap-3">
        {weekDays.map((day, i) => (
          <div
            key={day + i}
            className="text-zinc-400 text-xl h-10 w-10 flex items-center justify-center font-bold"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-rows-7 grid-flow-col gap-3">
        {summary.length > 0 &&
          summaryDates.map((date, i) => {
            const dayInSummary = summary.find((day) => {
              return dayjs(date).isSame(day.date, "day");
            });
            return (
              <HabitDay
                key={date.toString() + i}
                amount={dayInSummary?.amount}
                defaultCompleted={dayInSummary?.completed}
                date={date}
              />
            );
          })}
        {amountOfDatesToFill > 0 &&
          Array.from({ length: amountOfDatesToFill }).map((_, i) => (
            <div
              key={i}
              className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed"
            />
          ))}
      </div>
    </div>
  );
}
