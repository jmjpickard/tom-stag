import { z } from "zod";
import { groupBy } from "lodash";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import {
  TeamScoreResult,
  calculateCumulativeScores,
  groupByAndAggregate,
} from "../utils";
import { TeamScores } from "@prisma/client";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  addTenPoints: publicProcedure
    .input(z.object({ teamId: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.teamScores.create({
        data: {
          teamId: input.teamId,
          score: 10,
        },
      });
    }),

  removeTenPoints: publicProcedure
    .input(z.object({ teamId: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.teamScores.create({
        data: {
          teamId: input.teamId,
          score: -10,
        },
      });
    }),

  getTeamScores: publicProcedure.query(async ({ input, ctx }) => {
    const allRows = await ctx.prisma.teamScores.findMany();
    const groupByTeam = groupBy(allRows, (row: TeamScores) => row.teamId);
    return Object.entries(groupByTeam).map(
      ([teamId, teamScores]: [string, TeamScores[]]) => {
        const cumulativeScores = calculateCumulativeScores(teamScores);
        return {
          teamId,
          teamScores: cumulativeScores,
        };
      }
    );
  }),
  getScoreByTeamId: publicProcedure
    .input(z.object({ teamId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.teamScores.aggregate({
        _sum: {
          score: true,
        },
        where: {
          teamId: input.teamId,
        },
      });
    }),

  getAllTeams: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.teams.findMany();
  }),

  addTeam: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        logo: z.string(),
        members: z.array(z.string()),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.teams.create({
        data: {
          teamName: input.name,
          teamLogo: input.logo,
          teamMembers: input.members,
        },
      });
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  deleteRowsByTeamId: protectedProcedure
    .input(z.object({ teamId: z.array(z.string()) }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.teamScores.deleteMany({
        where: {
          teamId: {
            in: input.teamId,
          },
        },
      });
    }),
});
