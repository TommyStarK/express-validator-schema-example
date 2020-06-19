import express from 'express';

import { checkSchema, validationResult, Schema, ValidationChain } from 'express-validator';

const FeedReaderSchema: Schema = {
	feed: {
		in: 'body',
	},
	'feed.id': {
		isLength: {
			errorMessage: 'ID should be at least 1 char long',
			options: {
				min: 1,

			}
		}
	},
	'feed.stars': {
		isInt: {
			options: {
				min: 0,
			},
			errorMessage: "Stars must be a positive integer"
		},
		toInt: true,
	},
	'feed.subscriptions': {
		isEmpty: {
			errorMessage: "Field 'subscriptions' cannot be empty",
			negated: true,
		}
	},
	'feed.subscriptions.*.email': {
		isEmail: true,
		errorMessage: 'Field email should be valid',
		custom: {
			options: (value, { req, location, path }) => {
				// could make a call to a DB here
				if (value === 'test@dummy.com') {
					return false;
				}

				return true
			},
			errorMessage: 'email already exists',
		}
	},
	'feed.subscriptions.*.options[*]': {
		matches: {
			options: [/\b(?:a|b|c|d)\b/],
			errorMessage: "Invalid option must be either a|b|c|d"
		}
	}
};

const processValidationResultMiddleware = (request: express.Request, response: express.Response, next: express.NextFunction) => {
	try {
		const result = validationResult(request);
		const errors = result.array().reverse();
		if (errors.length) {
			response.status(422).json({ errors });
			return
		}

		next();
	} catch (error) {
		console.log('validation error: %s', error.message)
		throw error;
	}
}

export const feedValidator = () => {
	return async (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const chain: ValidationChain[] = checkSchema(FeedReaderSchema);
		const promises = chain.map(async (elem: ValidationChain) => {
			const result = await elem.run(request);
			return result;
		});

		await Promise.all(promises);
		return processValidationResultMiddleware(request, response, next);
	}
}

