import { styled } from '@stitches/react';
import axios from 'axios';
import { parseISO } from 'date-fns';
import React, { FC, Fragment, useCallback, useEffect, useState } from 'react';

interface FeedItem {
	date: Date;
	title: string;
	img: string;
	ratio: number;
}

const useReddit = (name: string): FeedItem[] => {
	const [items, setItems] = useState<FeedItem[]>([]);

	useEffect(() => {
		const main = async () => {
			const { data } = await axios(`http://localhost:2000/reddit/${name}`);
			// console.log(name, data);
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
	flexDirection: 'row',
	overflow: 'hidden'
});

const Image = styled('div', {
	marginRight: 10,
	position: 'relative'
});
const ImageFull = styled('div', {
	position: 'absolute',
	top: 10,
	right: 10,
	bottom: 10,
	width: '50%',
	backgroundColor: 'black',
	textAlign: 'right'
});

const Title = styled('div', {
	fontSize: 30,
	lineHeight: '1em'
});

interface Props {
	id: string;
	onRequestReset: () => void;
}

const idxMap: Map<string, number> = new Map();

export const Reddit: FC<Props> = ({ id, onRequestReset }) => {
	const reddit = useReddit(id);
	const [, refresh] = useState(false);

	const inc = useCallback(() => {
		const currIdx = idxMap.get(id);
		const newIdx = typeof currIdx == 'number' ? currIdx + 1 : 1;
		idxMap.set(id, newIdx);
		refresh((v) => !v);
	}, [refresh]);

	useEffect(
		() => () => {
			inc();
		},
		[inc]
	);

	const onClick = useCallback(() => {
		inc();
		onRequestReset();
	}, [inc, onRequestReset]);

	const idx = (idxMap.get(id) || 0) % (reddit.length || 1);
	const item = reddit[idx];

	if (!item) {
		return null;
	}

	return (
		<Container onClick={onClick}>
			{item.ratio <= 1 ? (
				<ImageFull>
					<img src={item.img} style={{ maxHeight: '100%', maxWidth: '100%' }} />
				</ImageFull>
			) : (
				<Image>
					<img src={item.img} style={{ height: '100%' }} />
				</Image>
			)}
			<Title style={{ maxWidth: item.ratio <= 1 ? '48%' : '' }}>
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
