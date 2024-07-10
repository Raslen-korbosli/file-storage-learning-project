import { ConvexError, v } from 'convex/values';
import { mutation, MutationCtx, query, QueryCtx } from './_generated/server';
import { getUser } from './users';
import { fileType } from './schema';
import { ArgsArray, DefaultFunctionArgs, FunctionArgs } from 'convex/server';
import { Id } from './_generated/dataModel';

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
    favorites: v.optional(v.boolean()),
    query: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    let allFiles = await ctx.db
      .query('files')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .collect();
    if (args.favorites) {
      const user = await getUser(ctx, identity.tokenIdentifier);
      if (!user) return allFiles;
      const favoriteFiles = await ctx.db
        .query('favorites')
        .withIndex('by_userId_orgId_fileId', (q) =>
          q.eq('userId', user._id).eq('orgId', args.orgId)
        )
        .collect();
      allFiles = allFiles.filter((file) => {
        return favoriteFiles.some(
          (favoriteFile) => favoriteFile.fileId === file._id
        );
      });
      console.log(favoriteFiles);
    }

    allFiles = allFiles.filter((file) =>
      file.name.toLowerCase().startsWith(args.query.toLowerCase())
    );

    return allFiles;
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
export const isFavoriteFile = async (
  ctx: QueryCtx | MutationCtx,
  args: { orgId: string; fileId: Id<'files'> },
  userId: Id<'users'>
) => {
  const data = await ctx.db
    .query('favorites')
    .withIndex('by_userId_orgId_fileId', (q) =>
      q.eq('userId', userId).eq('orgId', args.orgId).eq('fileId', args.fileId)
    )
    .first();
  return data;
};
export const toggleFavorite = mutation({
  args: { fileId: v.id('files'), orgId: v.string() },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError('u must be logged in');
    const user = await getUser(ctx, identity.tokenIdentifier);
    if (
      !user.orgId.includes(args.orgId) &&
      user.tokenIdentifier !== identity.tokenIdentifier
    )
      throw new ConvexError('you dont have the access to this org');
    const favorite = await isFavoriteFile(ctx, args, user._id);
    if (favorite) {
      await ctx.db.delete(favorite._id);
    } else {
      await ctx.db.insert('favorites', {
        fileId: args.fileId,
        userId: user._id,
        orgId: args.orgId,
      });
    }
  },
});
