type Sub = {
	email: string,
	options: string[]
}

type FeedReader = {
	id: string
	stars: number,
	subscriptions: Sub[]
}

export default FeedReader;
