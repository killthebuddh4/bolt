import { z } from "zod";

export const optionsSchema = z.object({
  config: z.string(),
  pretty: z
    .union([z.literal("false"), z.literal("true"), z.boolean()])
    .optional(),
});
