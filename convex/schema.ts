import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  files: defineTable({
    lastName: v.optional(v.string()),
    name: v.string(),
  }),
});
