import { Context } from '../index';

interface CanUserMutatePostParams {
	userId: number;
	postId: number;
	prisma: Context['prisma'];
}

export const canUserMutatePost = async (params: CanUserMutatePostParams) => {
	const { userId, postId, prisma } = params;

	const user = await prisma.user.findUnique({
		where: { id: userId },
	});

	if (!user) {
		return {
			userErrors: [{ message: 'User not found' }],
			post: null,
		};
	}

	const post = await prisma.post.findUnique({
		where: {
			id: postId,
		},
	});

	if (post?.authorId !== user.id) {
		return {
			userErrors: [{ message: 'Post not owned by user' }],
			post: null,
		};
	}
};
