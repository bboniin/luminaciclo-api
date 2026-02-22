import prismaClient from "../../prisma";
import { addDays, addWeeks, endOfDay, startOfDay } from "date-fns";

interface DashRequest {
  userId: string;
  date_start: string;
  date_end: string;
}

class GetDashService {
  async execute({ userId, date_start, date_end }: DashRequest) {
    const admin = await prismaClient.admin.findUnique({
      where: {
        id: userId,
      },
    });
    if (!admin) {
      throw new Error("Usuário não encontrado");
    }

    const usersTotal = await prismaClient.user.count();
    const usersTotalLastDay = await prismaClient.user.count({
      where: {
        created_at: {
          gte: addDays(new Date(), -1),
        },
      },
    });
    const usersTotalLastWeek = await prismaClient.user.count({
      where: {
        created_at: {
          gte: addWeeks(startOfDay(new Date()), -1),
        },
      },
    });

    const usersTotalPeriod = await prismaClient.user.count({
      where: {
        created_at: {
          gte: startOfDay(new Date(date_start)),
          lte: endOfDay(new Date(date_end)),
        },
      },
    });

    const usersTotalPremium = await prismaClient.user.findMany({
      where: {
        plan_name: {
          not: "FREE",
        },
      },
    });

    const usersTotalPremiumMensal = usersTotalPremium.reduce((acc, item) => {
      return item.plan_name == "PREMIUM_MENSAL" ? acc + 1 : acc;
    }, 0);

    const usersTotalPremiumAnual = usersTotalPremium.reduce((acc, item) => {
      return item.plan_name == "PREMIUM_ANUAL" ? acc + 1 : acc;
    }, 0);

    const exercisesTotal = await prismaClient.exercise.findMany();
    const insightsTotal = await prismaClient.insight.findMany();
    const nutritionsTotal = await prismaClient.nutrition.findMany();
    const articlesTotal = await prismaClient.article.findMany();

    const contentsPTBR = {
      exercisesTotal: exercisesTotal.reduce((acc, item) => {
        return item.language == "PT-br" ? acc + 1 : acc;
      }, 0),
      nutritionsTotal: nutritionsTotal.reduce((acc, item) => {
        return item.language == "PT-br" ? acc + 1 : acc;
      }, 0),
      insightsTotal: insightsTotal.reduce((acc, item) => {
        return item.language == "PT-br" ? acc + 1 : acc;
      }, 0),
      articlesTotal: articlesTotal.reduce((acc, item) => {
        return item.language == "PT-br" ? acc + 1 : acc;
      }, 0),
    };

    const contentsENUS = {
      exercisesTotal: exercisesTotal.reduce((acc, item) => {
        return item.language == "EN-us" ? acc + 1 : acc;
      }, 0),
      nutritionsTotal: nutritionsTotal.reduce((acc, item) => {
        return item.language == "EN-us" ? acc + 1 : acc;
      }, 0),
      insightsTotal: insightsTotal.reduce((acc, item) => {
        return item.language == "EN-us" ? acc + 1 : acc;
      }, 0),
      articlesTotal: articlesTotal.reduce((acc, item) => {
        return item.language == "EN-us" ? acc + 1 : acc;
      }, 0),
    };

    const contentsESES = {
      exercisesTotal: exercisesTotal.reduce((acc, item) => {
        return item.language == "ES-es" ? acc + 1 : acc;
      }, 0),
      nutritionsTotal: nutritionsTotal.reduce((acc, item) => {
        return item.language == "ES-es" ? acc + 1 : acc;
      }, 0),
      insightsTotal: insightsTotal.reduce((acc, item) => {
        return item.language == "ES-es" ? acc + 1 : acc;
      }, 0),
      articlesTotal: articlesTotal.reduce((acc, item) => {
        return item.language == "ES-es" ? acc + 1 : acc;
      }, 0),
    };

    return {
      usersTotal,
      usersTotalLastDay,
      usersTotalLastWeek,
      usersTotalPeriod,
      usersTotalFree: usersTotal - usersTotalPremium.length,
      usersTotalPremium: usersTotalPremium.length,
      usersTotalPremiumAnual,
      usersTotalPremiumMensal,
      contentsPTBR,
      contentsESES,
      contentsENUS,
    };
  }
}

export { GetDashService };
