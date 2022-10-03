import { Post, prisma } from '@prisma/client';
import { Context } from '../index';

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

export const Mutation = {
	postCreate: async (_: any, args: PostCreateArgs, context: Context): Promise<PostPayloadType> => {
		const { title, content } = args.data;
		const { prisma } = context;

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
				authorId: 1,
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
		const { prisma } = context;

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
		const { prisma } = context;

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
};
