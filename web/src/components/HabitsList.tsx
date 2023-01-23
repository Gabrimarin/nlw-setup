import * as Checkbox from "@radix-ui/react-checkbox";
import dayjs from "dayjs";
import { Check } from "phosphor-react";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";

interface HabitsListProps {
  date: Date;
  onCompletedChanged?: (completed: number) => void;
}

interface HabitsInfo {
  possibleHabits: {
    id: string;
    title: string;
    created_at: string;
  }[];
  completedHabits: string[];
}

function HabitsList({ date, onCompletedChanged }: HabitsListProps) {
  const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>();
  async function handleToggleHabit(habitId: string) {
    const isHabitCompleted = habitsInfo!.completedHabits.includes(habitId);
    await api.patch(`/habits/${habitId}/toggle`);
    let completedHabits: string[] = [];
    if (isHabitCompleted) {
      completedHabits = habitsInfo!.completedHabits.filter(
        (id) => id !== habitId
      );
    } else {
      completedHabits = [...habitsInfo!.completedHabits, habitId];
    }
    setHabitsInfo({
      possibleHabits: habitsInfo!.possibleHabits,
      completedHabits,
    });

    onCompletedChanged?.(completedHabits.length);
  }

  useEffect(() => {
    api
      .get("day", {
        params: {
          date: date.toISOString(),
        },
      })
      .then((response) => {
        setHabitsInfo(response.data);
      });
  }, []);

  const isDateInPast = dayjs(date).endOf("day").isBefore(new Date());

  return (
    <div className="mt-6 flex-col flex gap-3">
      {habitsInfo?.possibleHabits.map((habit) => {
        return (
          <Checkbox.Root
            onCheckedChange={() => handleToggleHabit(habit.id)}
            checked={habitsInfo?.completedHabits.includes(habit.id)}
            key={habit.id}
            className="flex items-center gap-3 group"
            disabled={isDateInPast}
          >
            <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500">
              <Checkbox.Indicator>
                <Check size={20} className="text-white" />
              </Checkbox.Indicator>
            </div>
            <span className="font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=unchecked]:text-zinc-400">
              {habit.title}
            </span>
          </Checkbox.Root>
        );
      })}
    </div>
  );
}

export default HabitsList;
