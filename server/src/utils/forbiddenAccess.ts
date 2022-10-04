import { Context } from '../index';

export const forbiddenAccess = (context: Context) => {
	const { userInfo } = context;

	if (!userInfo?.userId) {
		return {
			userErrors: [{ message: 'Forbidden access (unauthenticated)' }],
			post: null,
		};
	}
};
