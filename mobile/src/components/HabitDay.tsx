import {
  Dimensions,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import clsx from "clsx";
import { generateProgressPercentage } from "../utils/generate-progress-percentage";
import dayjs from "dayjs";
const WEEK_DAYS = 7;
const SCREEN_HORIZONTAL_PADDING = (32 * 2) / 5;

export const DAY_MARGIN_BETWEEN = 8;
export const DAY_SIZE =
  Dimensions.get("screen").width / WEEK_DAYS -
  SCREEN_HORIZONTAL_PADDING -
  DAY_MARGIN_BETWEEN;

interface Props extends TouchableOpacityProps {
  amountOfHabits?: number;
  amountCompleted?: number;
  date: Date;
}

export default function HabitDay({
  amountOfHabits = 0,
  amountCompleted = 0,
  date,
  ...rest
}: Props) {
  const completedPercentage =
    amountOfHabits > 0
      ? generateProgressPercentage(amountOfHabits, amountCompleted)
      : 0;
  const today = dayjs().startOf("day").toDate();
  const isToday = dayjs(date).isSame(today, "day");
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={clsx("rounded-lg border-2 m-1", {
        "bg-zinc-900 border-zinc-800": completedPercentage === 0,
        "bg-violet-900 border-violet-700":
          completedPercentage > 0 && completedPercentage < 20,
        "bg-violet-800 border-violet-600":
          completedPercentage >= 20 && completedPercentage < 40,
        "bg-violet-700 border-violet-500":
          completedPercentage >= 40 && completedPercentage < 60,
        "bg-violet-600 border-violet-500":
          completedPercentage >= 60 && completedPercentage < 80,
        "bg-violet-500 border-violet-400": completedPercentage >= 80,
        "border-white border-4": isToday,
      })}
      style={{
        width: DAY_SIZE,
        height: DAY_SIZE,
      }}
      {...rest}
    />
  );
}
