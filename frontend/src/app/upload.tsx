import { styled } from '@stitches/react';
import { format } from 'date-fns';
import de from 'date-fns/locale/de';
import React, { FC, Fragment, useCallback, useEffect, useState } from 'react';

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
	onRequestReset: () => void;
}

let savedIdx = 0;

export const Upload: FC<Props> = ({ onRequestReset }) => {
	const uploads = useUpload();
	const [, refresh] = useState(false);

	const inc = useCallback(() => {
		savedIdx = savedIdx + 1;
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

	const idx = savedIdx % (uploads.length || 1);
	const item = uploads[idx];

	if (!item) {
		return null;
	}

	return (
		<Container onClick={onClick}>
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
