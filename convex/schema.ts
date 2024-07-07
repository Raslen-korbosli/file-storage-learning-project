import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
export const fileType = v.union(
  v.literal('image'),
  v.literal('csv'),
  v.literal('pdf')
);
export default defineSchema({
  files: defineTable({
    name: v.string(),
    fileId: v.id('_storage'),
    type: fileType,
    orgId: v.string(),
  }).index('by_orgId', ['orgId']),
  users: defineTable({
    tokenIdentifier: v.string(),
    orgId: v.array(v.string()),
    role: v.string(),
  }).index('by_tokenIdentifier', ['tokenIdentifier']),
});
