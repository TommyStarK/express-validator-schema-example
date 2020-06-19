import bodyParser from 'body-parser';
import express from 'express';
import http from 'http';

import FeedReader from './model/feedreader';
import { feedValidator } from './validator';

const HTTP_PORT = process.env.PORT ? +process.env.PORT : 3000;

const app: express.Application = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/checkInput', feedValidator(), (request: express.Request, response: express.Response) => {
	const feed: FeedReader = Object.assign({}, request.body.feed);
	response.status(200).json({ message: `feed with id (${feed.id}) has ${feed.stars} stars and ${feed.subscriptions.length} subscriptions` });
	return;
});

app.use((err: Error, _: express.Request, response: express.Response, next: express.NextFunction) => {
	console.log('error middleware: %s', err.message);
	response.status(500).json({ status: 500, message: 'Internal server error' });
	next();
});

http.createServer(app).listen(HTTP_PORT, '0.0.0.0', () => {
	console.info(`service is now running on http://localhost:${HTTP_PORT}`);
});
