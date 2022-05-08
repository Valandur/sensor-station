import { styled } from '@stitches/react';
import React, { FC, TouchEvent, useCallback, useEffect, useState } from 'react';

import { BASE_URL, NewsItem, useNews } from './api';

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
	left: 10,
	fontSize: 40
});

interface Props {
	id: string;
	onRequestPause: (pause: boolean) => void;
}

const ITEMS = 2;
const idxMap: Map<string, number> = new Map();

export const News: FC<Props> = ({ id, onRequestPause }) => {
	const news = useNews(id);
	const [item, setItem] = useState<NewsItem | null>(null);
	const [startY, setStartY] = useState(0);

	const inc = useCallback(
		(num: number) => {
			const currIdx = idxMap.get(id);
			const newIdx = typeof currIdx == 'number' ? currIdx + num * ITEMS : ITEMS;
			idxMap.set(id, newIdx);
		},
		[id]
	);

	useEffect(() => inc(1), [id]);

	const touchStart = useCallback(
		(e: TouchEvent<HTMLDivElement>) => {
			setStartY(e.changedTouches[0].clientY);
		},
		[setStartY]
	);
	const touchEnd = useCallback(
		(e: TouchEvent<HTMLDivElement>) => {
			const diff = e.changedTouches[0].clientY - startY;
			if (diff < -100) {
				inc(1);
			} else if (diff > 100) {
				inc(-1);
			}
		},
		[inc, startY]
	);

	useEffect(() => {
		onRequestPause(!!item);
	}, [item]);

	const idx = (idxMap.get(id) || 0) % (news.length - ITEMS + 1 || 1);

	return (
		<Container onTouchStart={touchStart} onTouchEnd={touchEnd}>
			{item ? (
				<DetailContainer>
					<IFrame src={BASE_URL + item.link} />
					<CloseButton onClick={() => setItem(null)}>❌</CloseButton>
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
