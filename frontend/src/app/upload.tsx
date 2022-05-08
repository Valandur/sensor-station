import { styled } from '@stitches/react';
import { format } from 'date-fns';
import de from 'date-fns/locale/de';
import React, { FC, Fragment, TouchEvent, useCallback, useEffect, useState } from 'react';

import { BASE_URL, useUpload } from './api';

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
	padding: 20,
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
	onRequestReset: () => void;
}

let savedIdx = 0;

export const Upload: FC<Props> = ({ onRequestReset }) => {
	const uploads = useUpload();
	const [, refresh] = useState(false);
	const [startY, setStartY] = useState(0);

	const inc = useCallback((num: number) => {
		savedIdx = savedIdx + num;
		refresh((v) => !v);
		onRequestReset();
	}, [refresh, onRequestReset]);

	useEffect(
		() => () => {
			inc(1);
		},
		[inc]
	);

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

	const idx = savedIdx % (uploads.length || 1);
	const item = uploads[idx];

	if (!item) {
		return null;
	}

	return (
		<Container onTouchStart={touchStart} onTouchEnd={touchEnd}>
			{item.ratio < 1 ? <ImageFull src={BASE_URL + item.img} /> : <Image src={BASE_URL + item.img} />}
			<Title style={{ maxWidth: item.ratio < 1 ? '40%' : undefined, display: 'flex', flexDirection: 'column' }}>
				<div style={{ flex: 1 }}>
					{item.title.split('\n').map((line, i) => (
						<Fragment key={i}>
							{line}
							<br />
						</Fragment>
					))}
				</div>
				<div style={{ marginBottom: 10 }}>{format(item.date, 'dd. MMM yyyy', { locale: de })}</div>
			</Title>
		</Container>
	);
};
