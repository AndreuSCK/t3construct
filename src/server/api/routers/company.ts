import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const companyRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.company.findMany({
      select: {
        id: true,
        name: true,
        location: true,
        description: true,
      },
      orderBy: { name: "asc" },
    });
  }),

  createCompany: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().min(1),
        location: z.string().min(1),
        email: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: {
          clerkId: ctx.auth.userId,
        },
      });
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not found",
        });
      }
      return ctx.db.company.create({
        data: {
          name: input.name,
          description: input.description,
          location: input.location,
          email: input.email,
          createdbyUserId: user.id,
        },
      });
    }),
});
