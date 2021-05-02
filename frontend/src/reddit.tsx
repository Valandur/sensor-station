import { styled } from '@stitches/react';
import axios from 'axios';
import { parseISO } from 'date-fns';
import React, { FC, Fragment, useEffect, useState } from 'react';

interface FeedItem {
	date: Date;
	title: string;
	description: string;
	img: string;
}

const useReddit = (name: string): FeedItem[] => {
	const [items, setItems] = useState<FeedItem[]>([]);

	useEffect(() => {
		const main = async () => {
			const { data } = await axios(`http://localhost:2000/reddit/${name}`);
			console.log(name, data);
			setItems(
				data.map((item: { date: string; title: string; description: string; img: string }) => ({
					...item,
					date: parseISO(item.date)
				}))
			);
		};

		main().catch((err) => console.error(err));
	}, []);

	return items;
};

const Container = styled('div', {
	flex: 1,
	display: 'flex',
	flexDirection: 'row'
});

const Image = styled('div', {
	flex: 2,
	marginRight: 10
});

const Title = styled('div', {
	flex: 1,
	fontSize: 30,
	lineHeight: '1em'
});

export const Reddit: FC = () => {
	const reddit = useReddit('earthporn');
	const [index, setIndex] = useState(0);

	const item = reddit[index];

	useEffect(() => {
		setIndex((idx) => (idx + 1) % (reddit.length || 1));
	}, [reddit]);

	if (!item) {
		return null;
	}

	return (
		<Container>
			<Image style={{ backgroundImage: `url(http://localhost:2000/${item.img})`, backgroundRepeat: 'no-repeat' }} />
			<Title>
				{item.title.split('\n').map((line) => (
					<Fragment key={line}>
						{line}
						<br />
					</Fragment>
				))}
			</Title>
		</Container>
	);
};
