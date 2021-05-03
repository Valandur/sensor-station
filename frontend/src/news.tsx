import { styled } from '@stitches/react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import React, { FC, useEffect, useState } from 'react';

interface FeedItem {
	date: Date;
	title: string;
	description: string;
	img: string;
}

const useNews = (id: string): FeedItem[] => {
	const [items, setItems] = useState<FeedItem[]>([]);

	useEffect(() => {
		const main = async () => {
			const { data } = await axios(`http://localhost:2000/news/${id}`);
			// console.log(id, data);
			setItems(
				data.map((item: { date: string; title: string; description: string; img: string }) => ({
					...item,
					date: parseISO(item.date)
				}))
			);
		};

		main().catch((err) => console.error(err));
	}, [id]);

	return items;
};

const Container = styled('div', {
	flex: 1,
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-between',
	overflow: 'hidden'
});

const Item = styled('div', {
	flex: 1,
	display: 'flex',
	flexDirection: 'row',
	overflow: 'hidden',
	marginTop: 10
});

const Image = styled('div', {
	flex: 1,
	marginRight: 10,
	backgroundPosition: 'center',
	backgroundSize: 'contain',
	backgroundRepeat: 'no-repeat'
});

const Abstract = styled('div', {
	flex: 4,
	fontSize: 32
});

const Title = styled('div', {
	fontSize: 38,
	color: 'gray'
});

const Date = styled('div', {
	flex: 1,
	fontSize: 26,
	color: 'orange'
});

const Text = styled('div', {
	fontSize: 32
});

interface Props {
	id: string;
	onRequestPause: (pause: boolean) => void;
}

const ITEMS = 3;
const idxMap: Map<string, number> = new Map();

export const News: FC<Props> = ({ id, onRequestPause }) => {
	const newsGeneral = useNews(id);
	const [item, setItem] = useState<FeedItem | null>(null);

	useEffect(
		() => () => {
			const currIdx = idxMap.get(id);
			const newIdx = typeof currIdx == 'number' ? currIdx + ITEMS : ITEMS;
			idxMap.set(id, newIdx);
		},
		[id]
	);

	useEffect(() => {
		onRequestPause(!!item);
	}, [item]);

	const idx = (idxMap.get(id) || 0) % (newsGeneral.length - ITEMS + 1 || 1);

	return (
		<Container onClick={() => (item ? setItem(null) : null)}>
			{item ? (
				<>
					<Title>{item.title}</Title>
					<Date>{format(item.date, 'eeee, d. LLL yyyy - HH:mm', { locale: de })}</Date>
					<Text>{item.description}</Text>
				</>
			) : (
				newsGeneral.slice(idx, idx + ITEMS).map((item) => (
					<Item key={item.title} onClick={() => setItem(item)}>
						<Image style={{ backgroundImage: `url(http://localhost:2000/${item.img})` }} />
						<Abstract>{item.title}</Abstract>
					</Item>
				))
			)}
		</Container>
	);
};
