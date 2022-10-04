import { Context } from '../index';

export const Query = {
	me: async (_: any, __: any, { userInfo, prisma }: Context) => {
		if (!userInfo) return null;
		const user = await prisma.user.findUnique({
			where: {
				id: userInfo.userId,
			},
		});

		return user;
	},
	profile: async (_: any, { userId }: { userId: string }, { prisma, userInfo }: Context) => {
		const isMyProfile = Number(userId) === userInfo?.userId;

		const profile = await prisma.profile.findUnique({
			where: {
				userId: Number(userId),
			},
		});

		if (!profile) return null;

		return {
			...profile,
			isMyProfile,
		};
	},
	posts: async (_: any, __: any, context: Context) => {
		const { prisma } = context;

		const posts = await prisma.post.findMany({
			orderBy: {
				createdAt: 'desc',
			},
		});

		return posts;
	},
};
