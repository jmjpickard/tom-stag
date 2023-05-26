import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

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

  getTeamScores: publicProcedure.query(({ input, ctx }) => {
    return ctx.prisma.teamScores.groupBy({
      by: ["teamId"],
      _sum: {
        score: true,
      },
    });
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
});
