import { gql } from 'apollo-server';

export const typeDefs = gql`
	type Query {
		me: User
		posts: [Post!]!
		profile(userId: ID!): Profile
	}

	type Mutation {
		postCreate(data: PostInput!): PostPayload!
		postUpdate(postId: ID!, data: PostInput!): PostPayload!
		postDelete(postId: ID!): PostPayload!
		postPublish(postId: ID!): PostPayload!
		postUnpublish(postId: ID!): PostPayload!

		signup(data: UserSignupInput!): AuthPayload!
		signin(data: CredentialsInput!): AuthPayload!
	}

	type Post {
		id: ID!
		title: String!
		content: String!
		published: Boolean!
		createdAt: String!
		user: User!
	}

	type User {
		id: ID!
		name: String!
		email: String!
		posts: [Post!]!
	}

	type Profile {
		id: ID!
		bio: String!
		isMyProfile: Boolean!
		user: User!
	}

	type UserError {
		message: String!
	}

	type PostPayload {
		userErrors: [UserError!]!
		post: Post
	}

	type AuthPayload {
		userErrors: [UserError!]!
		token: String
	}

	input PostInput {
		title: String
		content: String
	}

	input UserSignupInput {
		name: String!
		email: String!
		password: String!
		bio: String!
	}

	input CredentialsInput {
		email: String!
		password: String!
	}
`;
