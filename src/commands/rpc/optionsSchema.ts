import { z } from "zod";

export const optionsSchema = z.object({
  server: z.string(),
  method: z.string(),
  stream: z.boolean().optional(),
  args: z.string(),
});
