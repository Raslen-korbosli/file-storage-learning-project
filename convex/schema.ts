import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
export const fileType = v.union(
  v.literal('image'),
  v.literal('csv'),
  v.literal('pdf')
);
export const roles = v.union(v.literal('admin'), v.literal('member'));
export default defineSchema({
  files: defineTable({
    name: v.string(),
    fileId: v.id('_storage'),
    type: fileType,
    orgId: v.string(),
    shouldDeleted: v.boolean(),
    userId: v.id('users'),
  })
    .index('by_orgId', ['orgId'])
    .index('by_shouldDeleted', ['shouldDeleted']),
  favorites: defineTable({
    fileId: v.id('files'),
    orgId: v.string(),
    userId: v.id('users'),
  }).index('by_userId_orgId_fileId', ['userId', 'orgId', 'fileId']),
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    orgIds: v.array(
      v.object({
        orgId: v.string(),
        role: roles,
      })
    ),
  }).index('by_tokenIdentifier', ['tokenIdentifier']),
});
