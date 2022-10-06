import React from 'react';
import { gql, useQuery } from '@apollo/client';

import Post from '../../components/Post/Post';

const GET_POSTS = gql`
	query {
		posts {
			id
			title
			content
			createdAt
			user {
				name
			}
		}
	}
`;

export default function Posts() {
	const { data, error, loading } = useQuery(GET_POSTS);

	if (loading) return <div>Loading...</div>;

	if (error) return <div>Error Page</div>;

	const { posts } = data;

	return (
		<div>
			{posts.map(post => (
				<Post
					key={post.id}
					id={post.id}
					title={post.title}
					content={post.content}
					date={post.createdAt}
					user={post.user.name}
				/>
			))}
		</div>
	);
}
