import { FastifyInstance } from "fastify";
import { prisma } from "./lib/prisma";
import { z } from "zod";
import dayjs from "dayjs";

export async function appRoutes(app: FastifyInstance) {
  app.post("/habits", async (request) => {
    const createHabitBody = z.object({
      title: z.string(),
      weekDays: z.array(z.number().min(0).max(6)),
    });

    const { title, weekDays } = createHabitBody.parse(request.body);
    const today = dayjs().startOf("day").toDate();
    await prisma.habit.create({
      data: {
        title,
        created_at: today,
        weekDays: {
          create: weekDays.map((weekDay) => ({ week_day: weekDay })),
        },
      },
    });
  });

  app.get("/day", async (request) => {
    const getDayParams = z.object({
      date: z.coerce.date(),
    });

    const { date } = getDayParams.parse(request.query);
    const parsedDate = dayjs(date).startOf("day");
    const weekDay = dayjs(date).day();
    const possibleHabits = await prisma.habit.findMany({
      where: {
        created_at: {
          lte: date,
        },
        weekDays: {
          some: {
            week_day: weekDay,
          },
        },
      },
    });

    const day = await prisma.day.findUnique({
      where: {
        date: parsedDate.toDate(),
      },
      include: {
        DayHabits: true,
      },
    });

    const completedHabits =
      day?.DayHabits.map((dh) => {
        return dh.habit_id;
      }) ?? [];

    return {
      possibleHabits,
      completedHabits,
    };
  });

  app.patch("/habits/:id/toggle", async (request) => {
    const toggleHabitParms = z.object({
      id: z.string().uuid(),
    });

    const { id } = toggleHabitParms.parse(request.params);

    const today = dayjs().startOf("day").toDate();
    let day = await prisma.day.findUnique({
      where: {
        date: today,
      },
    });

    if (!day) {
      day = await prisma.day.create({
        data: {
          date: today,
        },
      });
    }

    const dayHabit = await prisma.dayHabit.findUnique({
      where: {
        day_id_habit_id: {
          day_id: day.id,
          habit_id: id,
        },
      },
    });

    if (dayHabit) {
      return prisma.dayHabit.delete({
        where: {
          day_id_habit_id: {
            day_id: day.id,
            habit_id: id,
          },
        },
      });
    }
    await prisma.dayHabit.create({
      data: {
        day_id: day.id,
        habit_id: id,
      },
    });
  });

  app.get("/summary", async () => {
    const summary = await prisma.$queryRaw`
      SELECT
        D.id,
        D.date,
        (
          Select cast(count(*) as float)
          FROM day_habits DH
          WHERE DH.day_id = D.id
        ) as completed,
        (
          SELECT cast(count(*) as float)
          FROM habit_week_days HWD
          JOIN habits H ON HWD.habit_id = H.id
          WHERE HWD.week_day = cast(strftime('%w', D.date / 1000.0, 'unixepoch') as int) 
          AND H.created_at <= D.date
        ) as amount
      FROM days D
      
           `;
    return summary;
  });
}