import JWT from 'jsonwebtoken';
import { JSON_SIGNATURE } from '../keys';

interface JWTCred {
	userId: number;
	email: string;
}

export const getUserFromToken = (token: string) => {
	if (!token) return null;

	let [_, desiredToken] = token.split(' ');
	try {
		return JWT.verify(desiredToken, JSON_SIGNATURE) as JWTCred;
	} catch (error) {
		return null;
	}
};
