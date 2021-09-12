import { styled } from '@stitches/react';
import axios from 'axios';
import { parseISO } from 'date-fns';
import React, { FC, useEffect, useState } from 'react';

interface FeedItem {
	date: Date;
	title: string;
	description: string;
	img: string;
	link: string;
}

const useNews = (id: string): FeedItem[] => {
	const [items, setItems] = useState<FeedItem[]>([]);

	useEffect(() => {
		const main = async () => {
			const { data } = await axios(`http://localhost:2000/news/${id}`);
			// console.log(id, data);
			setItems(
				data.map((item: { date: string }) => ({
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
	alignItems: 'center',
	overflow: 'hidden',
	marginTop: 10
});

const Image = styled('img', {
	height: '100%',
	marginRight: 10
});

const Abstract = styled('div', {
	flex: 4,
	fontSize: 38,
	lineHeight: '1.1em'
});

const IFrame = styled('iframe', {
	width: '100%',
	height: '100%',
	borderWidth: 1,
	borderStyle: 'solid',
	borderColor: 'gray'
});

const DetailContainer = styled('div', {
	position: 'absolute',
	top: 10,
	left: 10,
	right: 10,
	bottom: 10
});

const CloseButton = styled('button', {
	position: 'absolute',
	top: 10,
	right: 10,
	fontSize: 20
});

interface Props {
	id: string;
	onRequestPause: (pause: boolean) => void;
}

const ITEMS = 2;
const idxMap: Map<string, number> = new Map();

export const News: FC<Props> = ({ id, onRequestPause }) => {
	const news = useNews(id);
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

	const idx = (idxMap.get(id) || 0) % (news.length - ITEMS + 1 || 1);

	return (
		<Container onClick={() => (item ? setItem(null) : null)}>
			{item ? (
				<DetailContainer>
					<IFrame src={item.link} />
					<CloseButton>X</CloseButton>
				</DetailContainer>
			) : (
				news.slice(idx, idx + ITEMS).map((item) => (
					<Item key={item.title} onClick={() => setItem(item)}>
						<Image src={item.img} />
						<Abstract>{item.title}</Abstract>
					</Item>
				))
			)}
		</Container>
	);
};
