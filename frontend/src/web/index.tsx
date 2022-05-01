import React, { FC, useCallback, useEffect, useState } from 'react';
import { globalCss } from '@stitches/react';
import axios from 'axios';
import DatePicker, { registerLocale } from 'react-datepicker';
import de from 'date-fns/locale/de';

import 'react-datepicker/dist/react-datepicker.css';
import { parseISO } from 'date-fns';

registerLocale('de', de);

const globalStyles = globalCss({
	body: {
		backgroundColor: 'black',
		fontFamily:
			"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
		color: 'white',
		'-webkit-font-smoothing': 'antialiased',
		'-moz-osx-font-smoothing': 'grayscale'
	}
});

interface RawItem {
	img: string;
	title: string;
	date: string;
	ratio: number;
}

interface Item {
	img: string;
	title: string;
	date: Date;
	ratio: number;
}

const BASE_URL = 'http://localhost:2000'; // window.location.origin;

export const Web: FC = () => {
	globalStyles();

	const [items, setItems] = useState<Item[]>([]);
	const [newTitle, setNewTitle] = useState('');
	const [newFile, setNewFile] = useState<File>();
	const [newDate, setNewDate] = useState(new Date());

	const refresh = useCallback(async () => {
		const { data } = await axios(`${BASE_URL}/upload`);
		setItems(data.map((d: RawItem) => ({ ...d, date: parseISO(d.date) })));
	}, [setItems]);

	const upload = async () => {
		if (!newFile || !newTitle) {
			return;
		}

		const formData = new FormData();
		formData.append('title', newTitle);
		formData.append('image', newFile);
		formData.append('date', newDate.toISOString());

		const { data } = await axios({ method: 'POST', url: `${BASE_URL}/upload`, data: formData });
		setItems(data.map((d: RawItem) => ({ ...d, date: parseISO(d.date) })));

		setNewTitle('');
		setNewFile(undefined);
	};

	const save = async (img: string, title: string, date: Date) => {
		const { data } = await axios({ method: 'PUT', url: `${BASE_URL}/upload`, data: { img, title, date } });
		setItems(data.map((d: RawItem) => ({ ...d, date: parseISO(d.date) })));
	};

	const remove = async (img: string) => {
		const { data } = await axios({ method: 'DELETE', url: `${BASE_URL}/upload`, data: { img } });
		setItems(data.map((d: RawItem) => ({ ...d, date: parseISO(d.date) })));
	};

	useEffect(() => {
		refresh();
	}, []);

	return (
		<div>
			<h1>Weather station</h1>

			<h2>Upload</h2>

			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<div style={{ display: 'flex', flexDirection: 'row', margin: 10 }}>
					<div style={{ flex: 1 }}>Image:</div>
					<div style={{ flex: 10 }}>
						<input type="file" name="image" onChange={(e) => e.target.files && setNewFile(e.target.files[0])} />
					</div>
				</div>
				<div style={{ display: 'flex', flexDirection: 'row', margin: 10 }}>
					<div style={{ flex: 1 }}>Date:</div>
					<div style={{ flex: 10 }}>
						<DatePicker
							locale="de"
							dateFormat="dd.MM.yyyy"
							selected={newDate}
							onChange={(date) => (date ? setNewDate(date) : null)}
						/>
					</div>
				</div>
				<div style={{ display: 'flex', flexDirection: 'row', margin: 10 }}>
					<div style={{ flex: 1 }}>Title:</div>
					<div style={{ flex: 10 }}>
						<textarea name="title" rows={10} cols={40} value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
					</div>
				</div>
				<div style={{ display: 'flex', flexDirection: 'row', margin: 10 }}>
					<div style={{ flex: 1 }} />
					<div style={{ flex: 10 }}>
						<button disabled={!newTitle || !newFile} onClick={upload} style={{ fontSize: '1em' }}>
							Upload
						</button>
					</div>
				</div>
			</div>

			<h2>Items</h2>
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				{items.map((item) => (
					<div
						key={item.img}
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center'
						}}
					>
						<div style={{ flex: 3 }}>
							<textarea
								name="title"
								rows={10}
								cols={40}
								value={item.title}
								onChange={(e) =>
									setItems((items) => items.map((it) => (it === item ? { ...it, title: e.target.value } : it)))
								}
							/>
						</div>
						<div style={{ flex: 2 }}>
							<DatePicker
								locale="de"
								dateFormat="dd.MM.yyyy"
								selected={item.date}
								onChange={(date) =>
									date ? setItems((items) => items.map((it) => (it === item ? { ...it, date } : it))) : null
								}
							/>
						</div>
						<div style={{ flex: 5 }}>
							<img src={BASE_URL + item.img} style={{ maxWidth: 800, maxHeight: 200 }} />
						</div>
						<div style={{ flex: 1 }}>
							<button onClick={() => save(item.img, item.title, item.date)}>Save</button>
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
