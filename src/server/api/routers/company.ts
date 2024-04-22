import { set, z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const companyRouter = createTRPCRouter({
  setMainCompany: protectedProcedure
    .input(z.string())
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
      //return the list of companies, and check if input is one of his companies
      const companies = await ctx.db.company.findMany({
        where: {
          createdbyUserId: user.id,
        },
        select: {
          id: true,
        },
      });
      const companyIds = companies.map((company) => company.id);
      if (!companyIds.includes(input)) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Company not found",
        });
      }
      await ctx.db.user.update({
        where: { id: user.id },
        data: {
          mainCompanyId: input,
        },
      });
      return true;
    }),

  getUserCompanies: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findFirst({
      where: {
        clerkId: ctx.auth.userId,
      },
    });
    if (!user) {
      return [];
    }
    return ctx.db.company.findMany({
      where: {
        createdbyUserId: user.id,
      },
      select: {
        id: true,
        name: true,
        location: true,
        description: true,
        imageUrl: true,
        email: true,
        siteUrl: true,
      },
      orderBy: { name: "asc" },
    });
  }),
  getCompanyJobs: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const company = await ctx.db.company.findFirst({
        where: {
          id: input,
        },
      });
      if (!company) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Company not found",
        });
      }
      const jobs = await ctx.db.job.findMany({
        where: {
          companyId: input,
        },
        select: {
          id: true,
          title: true,
          description: true,
          createdAt: true,
          updatedAt: true,
          jobUrl: true,
          location: true,
        },
        orderBy: { createdAt: "desc" },
      });
      return jobs;
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.company.findMany({
      select: {
        id: true,
        name: true,
        location: true,
        description: true,
        imageUrl: true,
        email: true,
        siteUrl: true,
      },
      orderBy: { name: "asc" },
    });
  }),

  modifyCompany: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        description: z.string().optional(),
        location: z.string(),
        email: z.string().email(),
        imageUrl: z.string().optional(),
        siteUrl: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const company = await ctx.db.company.findFirst({
        where: {
          id: input.id,
        },
      });
      if (!company) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Company not found",
        });
      }
      //check if company is owned by user
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
      if (company.createdbyUserId !== user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Company not owned by user",
        });
      }
      const updatedCompany = await ctx.db.company.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description,
          location: input.location,
          email: input.email,
          imageUrl: input.imageUrl,
          siteUrl: input.siteUrl,
        },
      });
      return updatedCompany;
    }),
  deleteCompany: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const company = await ctx.db.company.findFirst({
        where: {
          id: input,
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
          message: "User not found",
        });
      }
      if (company.createdbyUserId !== user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Company not owned by user",
        });
      }
      await ctx.db.company.delete({
        where: { id: input },
      });
      return true;
    }),
  createCompany: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        location: z.string(),
        email: z.string().email(),
        imageUrl: z.string().optional(),
        siteUrl: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log("Creating company", input);
      const userExists = await ctx.db.user.findFirst({
        where: {
          clerkId: ctx.auth.userId,
        },
      });
      if (!userExists) {
        const newUser = await ctx.db.user.create({
          data: {
            clerkId: ctx.auth.userId,
          },
        });
        console.log(newUser);
      }
      const user = await ctx.db.user.findFirst({
        where: {
          clerkId: ctx.auth.userId,
        },
      });
      if (!user) {
        console.log("Error creating user or user not found");
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not found",
        });
      }
      const companyExists = await ctx.db.company.findFirst({
        where: {
          name: input.name,
        },
      });
      if (companyExists) {
        console.log("Company already exists");
        throw new TRPCError({
          code: "CONFLICT",
          message: "Company already exists",
        });
      }

      const companyCreated = await ctx.db.company.create({
        data: {
          name: input.name,
          description: input.description,
          location: input.location,
          createdbyUserId: user.id,
          email: input.email,
          imageUrl: input.imageUrl,
          siteUrl: input.siteUrl,
        },
      });
      if (companyCreated.id) {
        await ctx.db.user.update({
          where: { id: user.id },
          data: {
            mainCompanyId: companyCreated.id,
          },
        });
      }

      return companyCreated;
    }),
});
