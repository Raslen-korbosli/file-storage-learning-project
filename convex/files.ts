import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getUser } from './users';
import { fileType } from './schema';

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) throw new ConvexError('u must be logged in');
  return await ctx.storage.generateUploadUrl();
});
export const createFile = mutation({
  args: {
    name: v.string(),
    orgId: v.string(),
    fileId: v.id('_storage'),
    type: fileType,
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new ConvexError('u must be logged in');
    const user = await getUser(ctx, identity.tokenIdentifier);
    if (
      !user.orgId.includes(args.orgId) &&
      user.tokenIdentifier !== identity.tokenIdentifier
    )
      throw new ConvexError('you dont have the access to this org');
    await ctx.db.insert('files', {
      name: args.name,
      fileId: args.fileId,
      orgId: args.orgId,
      type: args.type,
    });
  },
});
export const getFiles = query({
  args: {
    orgId: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    return await ctx.db
      .query('files')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .collect();
  },
});
export const deleteFile = mutation({
  args: { fileId: v.id('files') },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError('u must be logged in');
    const file = await ctx.db.get(args.fileId);
    if (!file) throw new ConvexError('the file dosent exist');

    await ctx.db.delete(args.fileId);
    await ctx.storage.delete(file.fileId);
  },
});
export const getFileImageUrl = query({
  args: {
    fileId: v.id('_storage'),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError('u must be logged in');
    const fileUrl = await ctx.storage.getUrl(args.fileId);
    return fileUrl;
  },
});
