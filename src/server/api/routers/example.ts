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
    .input(z.object({ teamId: z.number() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.teamScores.create({
        data: {
          teamId: input.teamId,
          score: 10,
        },
      });
    }),

  removeTenPoints: publicProcedure
    .input(z.object({ teamId: z.number() }))
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

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
