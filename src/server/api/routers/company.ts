import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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

  createCompany: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        title: z.string().min(1),
        description: z.string().min(1),
        location: z.string().min(1),

        // company: z.object({ // Optional company object
        //   id: z.string().uuid(), // Ensure company ID is a valid UUID
        // }).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.job.create({
        data: {
          title: input.title,
          description: input.description,
          location: input.location,
          company: { connect: { id: "existing-company-uuid" } },
        },
      });
    }),
});
