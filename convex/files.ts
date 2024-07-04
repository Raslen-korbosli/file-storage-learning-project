import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getUser } from './users';
export const createFile = mutation({
  args: { firstName: v.string(), lastName: v.string(), orgId: v.string() },
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
      name: args.firstName,
      lastName: args.lastName,
      orgId: args.orgId,
    });
  },
});
export const getFiles = query({
  args: {
    orgId: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    console.log(identity?.tokenIdentifier);
    if (!identity) return [];
    return ctx.db
      .query('files')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .collect();
  },
});
