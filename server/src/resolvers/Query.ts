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
