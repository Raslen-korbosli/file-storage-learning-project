import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';
export const createFile = mutation({
  args: { name: v.string(), lastName: v.string() },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    console.log(identity);
    if (!identity) throw new ConvexError('u must be logged in');
    await ctx.db.insert('files', {
      name: args.name,
      lastName: args.lastName,
    });
  },
});
export const getFiles = query({
  args: {},
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    return ctx.db.query('files').collect();
  },
});
