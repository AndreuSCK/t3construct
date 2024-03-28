import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const jobRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.job.findMany({
      select: {
        id: true,
        title: true,
        location: true,
        description: true,
        createdAt: true,
        company: { select: { name: true, location: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  post: publicProcedure
    .input(
      z.object({
        // name: z.string().min(1),
        title: z.string().min(1),
        description: z.string().min(1),
        location: z.string().min(1),

        // company: z.object({
        //   id: z.string().uuid(),
        // }),

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
          // company: { connect: { id: "7d081ba1-961e-4fdd-8847-6a9dade49ea0" } },
          companyId: "7d081ba1-961e-4fdd-8847-6a9dade49ea0",
        },
      });
    }),
});
