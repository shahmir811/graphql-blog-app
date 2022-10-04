import { Post, prisma } from '@prisma/client';
import { Context } from '../../index';
import { canUserMutatePost } from '../../utils/canUserMutatePost';

interface PostCreateArgs {
	data: {
		title: string;
		content: string;
	};
}

interface PostUpdateArgs {
	postId: string;
	data: {
		title?: string;
		content?: string;
	};
}

interface PostPayloadType {
	userErrors: { message: string }[];
	post: Post | null;
}

export const postResolvers = {
	postCreate: async (_: any, args: PostCreateArgs, context: Context): Promise<PostPayloadType> => {
		const { title, content } = args.data;
		const { prisma, userInfo } = context;

		if (!userInfo?.userId) {
			return {
				userErrors: [{ message: 'Forbidden access (unauthenticated)' }],
				post: null,
			};
		}

		if (!title || !content) {
			return {
				userErrors: [{ message: 'Title and content fields are required to create a post' }],
				post: null,
			};
		}

		const post = await prisma.post.create({
			data: {
				title,
				content,
				authorId: userInfo.userId,
			},
		});

		return {
			userErrors: [],
			post,
		};
	},
	postUpdate: async (_: any, args: PostUpdateArgs, context: Context): Promise<PostPayloadType> => {
		const { postId } = args;
		const { title, content } = args.data;
		const { prisma, userInfo } = context;

		if (!userInfo?.userId) {
			return {
				userErrors: [{ message: 'Forbidden access (unauthenticated)' }],
				post: null,
			};
		}

		const error = await canUserMutatePost({
			userId: userInfo.userId,
			postId: Number(postId),
			prisma,
		});

		if (error) return error;

		if (!title && !content) {
			return {
				userErrors: [{ message: 'Need to have atleast title or content to update the post.' }],
				post: null,
			};
		}

		const postExists = await prisma.post.findUnique({
			where: {
				id: Number(postId),
			},
		});

		if (!postExists) {
			return {
				userErrors: [{ message: 'Post does not exist.' }],
				post: null,
			};
		}

		let payloadToUpdate = {
			title,
			content,
		};

		if (!title) delete payloadToUpdate['title'];
		if (!content) delete payloadToUpdate['content'];

		const post = await prisma.post.update({
			data: { ...payloadToUpdate },
			where: { id: Number(postId) },
		});

		return {
			userErrors: [],
			post,
		};
	},
	postDelete: async (_: any, args: { postId: string }, context: Context): Promise<PostPayloadType> => {
		const { postId } = args;
		const { prisma, userInfo } = context;

		if (!userInfo?.userId) {
			return {
				userErrors: [{ message: 'Forbidden access (unauthenticated)' }],
				post: null,
			};
		}

		const error = await canUserMutatePost({
			userId: userInfo.userId,
			postId: Number(postId),
			prisma,
		});

		if (error) return error;

		const post = await prisma.post.findUnique({
			where: {
				id: Number(postId),
			},
		});

		if (!post) {
			return {
				userErrors: [{ message: 'Post does not exist.' }],
				post: null,
			};
		}

		await prisma.post.delete({
			where: {
				id: Number(postId),
			},
		});

		return {
			userErrors: [],
			post,
		};
	},
	postPublish: async (_: any, args: { postId: string }, context: Context): Promise<PostPayloadType> => {
		const { postId } = args;
		const { prisma, userInfo } = context;

		if (!userInfo?.userId) {
			return {
				userErrors: [{ message: 'Forbidden access (unauthenticated)' }],
				post: null,
			};
		}

		const error = await canUserMutatePost({
			userId: userInfo.userId,
			postId: Number(postId),
			prisma,
		});

		if (error) return error;

		const postExists = await prisma.post.findUnique({
			where: {
				id: Number(postId),
			},
		});

		if (!postExists) {
			return {
				userErrors: [{ message: 'Post does not exist.' }],
				post: null,
			};
		}

		const post = await prisma.post.update({
			where: {
				id: Number(postId),
			},
			data: {
				published: true,
			},
		});

		return {
			userErrors: [],
			post,
		};
	},
	postUnpublish: async (_: any, args: { postId: string }, context: Context): Promise<PostPayloadType> => {
		const { postId } = args;
		const { prisma, userInfo } = context;

		if (!userInfo?.userId) {
			return {
				userErrors: [{ message: 'Forbidden access (unauthenticated)' }],
				post: null,
			};
		}

		const error = await canUserMutatePost({
			userId: userInfo.userId,
			postId: Number(postId),
			prisma,
		});

		if (error) return error;

		const postExists = await prisma.post.findUnique({
			where: {
				id: Number(postId),
			},
		});

		if (!postExists) {
			return {
				userErrors: [{ message: 'Post does not exist.' }],
				post: null,
			};
		}

		const post = await prisma.post.update({
			where: {
				id: Number(postId),
			},
			data: {
				published: false,
			},
		});

		return {
			userErrors: [],
			post,
		};
	},
};
