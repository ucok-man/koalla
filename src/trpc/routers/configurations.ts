import {
  CaseColor,
  CaseFinish,
  CaseMaterial,
  PhoneModel,
} from "@prisma/client";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { createTRPCRouter, privateProcedure } from "../init";

export const configurationRouter = createTRPCRouter({
  findById: privateProcedure
    .input(
      z.object({
        cid: z.string().trim().min(1, "id is required"),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const config = await ctx.db.configuration.findUnique({
          where: {
            id: input.cid,
          },
        });

        if (!config) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Configuration with id #${input.cid} not found`,
          });
        }

        return config;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch configuration by id`,
          cause: error,
        });
      }
    }),

  update: privateProcedure
    .input(
      z.object({
        configId: z.string().trim().min(1, "config id is required"),
        color: z.enum(CaseColor),
        finish: z.enum(CaseFinish),
        material: z.enum(CaseMaterial),
        model: z.enum(PhoneModel),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const config = await ctx.db.configuration.update({
          where: { id: input.configId },
          data: {
            color: input.color,
            finish: input.finish,
            material: input.material,
            model: input.model,
          },
        });

        return config;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to update configuration`,
          cause: error,
        });
      }
    }),
});
