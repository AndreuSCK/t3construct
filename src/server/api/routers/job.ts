import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const jobRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }) => {
      if (!input) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid job id",
        });
      }

      return ctx.db.job.findFirst({
        where: {
          id: input,
        },
        select: {
          id: true,
          title: true,
          location: true,
          description: true,
          jobUrl: true,
          createdAt: true,
          company: { select: { name: true, location: true, imageUrl: true, email: true } },
        },
      });
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.job.findMany({
      select: {
        id: true,
        title: true,
        location: true,
        description: true,
        createdAt: true,
        company: { select: { name: true, location: true, imageUrl: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  deleteJob: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const job = await ctx.db.job.findFirst({
        where: {
          id: input,
        },
      });
      if (!job) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Job not found",
        });
      }
      const company = await ctx.db.company.findFirst({
        where: {
          id: job.companyId,
        },
      });
      if (!company) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Company not found",
        });
      }
      const user = await ctx.db.user.findFirst({
        where: {
          clerkId: ctx.auth.userId,
        },
      });
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authorized",
        });
      }
      if (company.createdbyUserId !== user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Company not owned by user",
        });
      }
      await new Promise((resolve) => setTimeout(resolve, 250));

      return ctx.db.job.delete({
        where: {
          id: job.id,
        },
      });
    }),

  modifyJob: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        location: z.string().min(1),
        jobUrl: z.string().optional(),
        companyId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const job = await ctx.db.job.findFirst({
        where: {
          id: input.companyId,
        },
      });
      if (!job) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Job not found",
        });
      }
      const company = await ctx.db.company.findFirst({
        where: {
          id: job.companyId,
        },
      });
      if (!company) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Company not found",
        });
      }
      const user = await ctx.db.user.findFirst({
        where: {
          clerkId: ctx.auth.userId,
        },
      });
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authorized",
        });
      }
      if (company.createdbyUserId !== user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Company not owned by user",
        });
      }
      await new Promise((resolve) => setTimeout(resolve, 250));

      return ctx.db.job.update({
        where: {
          id: job.id,
        },
        data: {
          title: input.title,
          description: input.description,
          location: input.location,
          jobUrl: input.jobUrl,
        },
      });
    }),

  post: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        location: z.string().min(1),
        companyId: z.string().uuid(),
        jobUrl: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const company = await ctx.db.company.findFirst({
        where: {
          id: input.companyId,
        },
      });
      if (!company) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Company not found",
        });
      }
      const user = await ctx.db.user.findFirst({
        where: {
          clerkId: ctx.auth.userId,
        },
      });
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authorized",
        });
      }
      if (company.createdbyUserId !== user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Company not owned by user",
        });
      }

      await new Promise((resolve) => setTimeout(resolve, 250));

      return ctx.db.job.create({
        data: {
          title: input.title,
          description: input.description,
          location: input.location,
          companyId: input.companyId,
          jobUrl: input.jobUrl,
        },
      });
    }),
});
