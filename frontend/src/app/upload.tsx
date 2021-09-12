import { styled } from '@stitches/react';
import axios from 'axios';
import React, { FC, Fragment, useCallback, useEffect, useState } from 'react';

interface FeedItem {
	title: string;
	img: string;
	ratio: number;
}

const useUpload = (): FeedItem[] => {
	const [items, setItems] = useState<FeedItem[]>([]);

	useEffect(() => {
		const main = async () => {
			const { data } = await axios(`http://localhost:2000/upload`);
			console.log(data);
			setItems(data);
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
