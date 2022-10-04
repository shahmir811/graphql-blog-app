import { ApolloServer } from 'apollo-server';

import { typeDefs } from './schema';
import { Query, Profile, Post, User, Mutation } from './resolvers';
import { PrismaClient, Prisma } from '@prisma/client';
import { getUserFromToken } from './utils/getUserFromToken';

export interface Context {
	prisma: PrismaClient<
		Prisma.PrismaClientOptions,
		never,
		Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
	>;
	userInfo: {
		userId: number;
		email: string;
	} | null;
}

const prisma = new PrismaClient();

const server = new ApolloServer({
	typeDefs,
	resolvers: {
		Query,
		Profile,
		Post,
		User,
		Mutation,
	},
	context: async ({ req }: any): Promise<Context> => {
		const authHeader = req.headers.authorization ? req.headers.authorization : null;
		const userInfo = await getUserFromToken(req.headers.authorization);

		return {
			prisma,
			userInfo,
		};
	},
});

server.listen().then(({ url }) => console.log(`Server is running on port ${url}`));
