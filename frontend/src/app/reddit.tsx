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
			const { data } = await axios(`/reddit/${name}`);
			setItems(
				data.map((item: { date: string }) => ({
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

const Image = styled('img', {
	height: 'auto',
	maxHeight: '100%',
	width: 'auto',
	maxWidth: '70%'
});
const ImageFull = styled('img', {
	position: 'absolute',
	boxSizing: 'border-box',
	top: 0,
	right: 0,
	bottom: 0,
	paddingTop: 20,
	paddingBottom: 20,
	paddingLeft: 10,
	backgroundColor: 'black',
	textAlign: 'right',
	maxHeight: '100%',
	maxWidth: '100%'
});

const Title = styled('div', {
	flex: 1,
	fontSize: 30,
	lineHeight: '1em',
	marginLeft: 10
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
			{item.ratio < 1 ? <ImageFull src={item.img} /> : <Image src={item.img} />}
			<Title style={{ maxWidth: item.ratio < 1 ? '40%' : undefined }}>
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
