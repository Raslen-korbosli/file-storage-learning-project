import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  files: defineTable({
    lastName: v.string(),
    name: v.string(),
    orgId: v.string(),
  }).index('by_orgId', ['orgId']),
  users: defineTable({
    tokenIdentifier: v.string(),
    orgId: v.array(v.string()),
    role: v.string(),
  }).index('by_tokenIdentifier', ['tokenIdentifier']),
});
