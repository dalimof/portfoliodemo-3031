import { z } from "zod";
import { ORPCError } from "@orpc/server";
import { base } from "../__core/app";
import { db } from "../database";
import { contactMessages } from "../database/schema";

const recent = new Map<string, number>();
export const contact = {
  submit: base
    .input(
      z.object({
        name: z.string().trim().min(2).max(100),
        email: z.string().trim().email().max(254),
        message: z.string().trim().min(10).max(5000),
        website: z.string().max(200).optional(),
      }),
    )
    .handler(async ({ input }) => {
      if (input.website) throw new ORPCError("BAD_REQUEST", { message: "Please try again." });
      const now = Date.now();
      if (recent.size > 1000)
        for (const [email, time] of recent) if (now - time > 60000) recent.delete(email);
      if (now - (recent.get(input.email) ?? 0) < 30000)
        throw new ORPCError("TOO_MANY_REQUESTS", {
          message: "Please wait a moment before sending another message.",
        });
      await db
        .insert(contactMessages)
        .values({ name: input.name, email: input.email, message: input.message });
      recent.set(input.email, now);
      return { success: true };
    }),
};
