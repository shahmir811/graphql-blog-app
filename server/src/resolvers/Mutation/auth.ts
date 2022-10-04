import { Context } from '../../index';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';
import { JSON_SIGNATURE } from '../../keys';

interface SignupArgs {
	data: {
		name: string;
		email: string;
		password: string;
		bio: string;
	};
}

interface UserPayload {
	userErrors: { message: string }[];
	token: string | null;
}

export const authResolvers = {
	signup: async (_: any, args: SignupArgs, context: Context): Promise<UserPayload> => {
		const { name, email, bio, password } = args.data;
		const { prisma } = context;

		// Validation
		const isEmail = validator.isEmail(email);

		if (!isEmail) {
			return {
				userErrors: [
					{
						message: 'Invalid email',
					},
				],
				token: null,
			};
		}

		const isValidPassword = validator.isLength(password, {
			min: 5,
		});

		if (!isValidPassword) {
			return {
				userErrors: [
					{
						message: 'Password length must be greater than 05 characters',
					},
				],
				token: null,
			};
		}

		if (!name || !bio) {
			return {
				userErrors: [
					{
						message: 'Invalid name or bio',
					},
				],
				token: null,
			};
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await prisma.user.create({
			data: {
				email,
				name,
				password: hashedPassword,
			},
		});

		await prisma.profile.create({
			data: {
				bio,
				userId: user.id,
			},
		});

		const token = await JWT.sign(
			{
				userId: user.id,
				email: user.email,
			},
			JSON_SIGNATURE,
			{
				expiresIn: 3600000, //
			}
		);

		return {
			userErrors: [],
			token,
		};
	},

	signin: async (_: any, args: SignupArgs, context: Context): Promise<UserPayload> => {
		const { email, password } = args.data;
		const { prisma } = context;

		const user = await prisma.user.findUnique({
			where: {
				email,
			},
		});

		if (!user) {
			return {
				userErrors: [{ message: 'Invalid credentials' }],
				token: null,
			};
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return {
				userErrors: [{ message: 'Invalid credentials' }],
				token: null,
			};
		}

		const token = await JWT.sign(
			{
				userId: user.id,
				email: user.email,
			},
			JSON_SIGNATURE,
			{
				expiresIn: 3600000, //
			}
		);

		return {
			userErrors: [],
			token,
		};
	},
};
