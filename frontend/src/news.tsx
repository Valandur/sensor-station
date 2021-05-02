import { styled } from '@stitches/react';
import axios from 'axios';
import { parseISO } from 'date-fns';
import React, { FC, useEffect, useState } from 'react';

interface FeedItem {
	date: Date;
	title: string;
	description: string;
	img: string;
}

const useNews = (name: string): FeedItem[] => {
	const [items, setItems] = useState<FeedItem[]>([]);

	useEffect(() => {
		const main = async () => {
			const { data } = await axios(`http://localhost:2000/news/${name}`);
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
	flexDirection: 'column'
});

const Item = styled('div', {
	display: 'flex',
	flexDirection: 'row',
	marginBottom: 15
});

const Image = styled('div', {
	flex: 1,
	marginRight: 10
});

const Title = styled('div', {
	flex: 4,
	fontSize: 40,
	lineHeight: '1em'
});

export const News: FC = () => {
	const newsGeneral = useNews('1646');

	return (
		<Container>
			{newsGeneral.slice(0, 3).map((item) => (
				<Item key={item.title}>
					<Image>
						<img src={`http://localhost:2000/${item.img}`} style={{ width: '100%' }} />
					</Image>
					<Title>{item.title}</Title>
				</Item>
			))}
		</Container>
	);
};
