import { styled } from '@stitches/react';
import axios from 'axios';
import { parseISO } from 'date-fns';
import React, { FC, Fragment, useCallback, useEffect, useState } from 'react';

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
	marginRight: 10,
	position: 'relative'
});

const Title = styled('div', {
	fontSize: 30,
	lineHeight: '1em'
});

let idx = 0;

export const Reddit: FC = () => {
	const reddit = useReddit('earthporn');
	const item = reddit[idx % reddit.length];
	const [, refresh] = useState(false);

	const inc = useCallback(() => {
		idx++;
		refresh((v) => !v);
	}, [refresh]);

	useEffect(
		() => () => {
			idx++;
		},
		[]
	);

	if (!item) {
		return null;
	}

	return (
		<Container onClick={inc}>
			<Image>
				<img src={`http://localhost:2000/${item.img}`} style={{ height: 300 }} />
			</Image>
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
