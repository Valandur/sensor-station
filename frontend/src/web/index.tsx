import React, { FC, useCallback, useEffect, useState } from 'react';
import { global } from '@stitches/react';
import axios from 'axios';

const globalStyles = global({
	body: {
		backgroundColor: 'black',
		fontFamily:
			"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
		color: 'white',
		'-webkit-font-smoothing': 'antialiased',
		'-moz-osx-font-smoothing': 'grayscale'
	}
});

const ENDPOINT = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/upload`;
//const ENDPOINT = `http://localhost:2000/upload`;

interface Item {
	title: string;
	img: string;
	ratio: number;
}

export const Web: FC = () => {
	globalStyles();

	const [items, setItems] = useState<Item[]>([]);
	const [descr, setDescr] = useState('');
	const [file, setFile] = useState<File>();

	const refresh = useCallback(async () => {
		const { data } = await axios(ENDPOINT);
		setItems(data);
	}, [setItems]);

	const upload = async () => {
		if (!file || !descr) {
			return;
		}

		const formData = new FormData();
		formData.append('description', descr);
		formData.append('image', file);

		const { data } = await axios({ method: 'POST', url: ENDPOINT, data: formData });
		setItems(data);

		setDescr('');
		setFile(undefined);
	};

	const remove = async (img: string) => {
		const { data } = await axios({ method: 'DELETE', url: ENDPOINT, data: { img } });
		setItems(data);
	};

	useEffect(() => {
		refresh();
	}, []);

	return (
		<div>
			<h1>Upload</h1>

			<div>
				Title: <input type="text" name="description" value={descr} onChange={(e) => setDescr(e.target.value)} />
				<br />
				Image: <input type="file" name="image" onChange={(e) => e.target.files && setFile(e.target.files[0])} />
				<br />
				<button onClick={upload}>Upload</button>
			</div>

			<h2>Items</h2>
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				{items.map((item) => (
					<div key={item.img} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
						<div style={{ flex: 1 }}>{item.title}</div>
						<div style={{ flex: 5 }}>
							<img src={item.img} style={{ maxWidth: 800, maxHeight: 200 }} />
						</div>
						<div style={{ flex: 1 }}>
							<button onClick={() => remove(item.img)}>X</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
