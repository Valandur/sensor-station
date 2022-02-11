import { useEffect, useState } from 'react';
import axios from 'axios';
import { parseISO } from 'date-fns';

export const BASE_URL = process.env.REACT_APP_API_URL || window.location.origin;
const DATA_UPDATE_INTERVAL = 10 * 1000;

export interface Battery {
	isFault: boolean;
	isButton: boolean;
	batteryStatus: string;
	powerIn: string;
	powerIn5vIo: string;

	charge: number;
	voltage: number;
	current: number;
}

export interface Modem {
	isConnected: boolean;
	operator: string;
	signal: number;
	lat: number;
	lng: number;
	time: string;
	tzOffset: string;
	tzName: string;
}

export interface Data {
	battery: Battery;
	modem: Modem;
}

export const useData = (): Partial<Data> => {
	const [data, setData] = useState<Partial<Data>>({});

	useEffect(() => {
		const main = async () => {
			const { data } = await axios(`${BASE_URL}/data`);
			setData(data);
		};

		main().catch((err) => console.error(err));
		const interval = setInterval(() => main().catch((err) => console.error(err)), DATA_UPDATE_INTERVAL);

		return () => {
			clearInterval(interval);
		};
	}, []);

	return data;
};

export interface WeatherItem {
	time: Date;
	img: string;
	feelsLike: number;
}

export const useWeather = (): [WeatherItem[], number | null, number | null] => {
	const [items, setItems] = useState<WeatherItem[]>([]);
	const [temp, setTemp] = useState<number | null>(null);
	const [rh, setRh] = useState<number | null>(null);

	useEffect(() => {
		const main = async () => {
			const { data } = await axios(`${BASE_URL}/weather`);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			setItems(data.forecasts.map((f: any) => ({ ...f, time: parseISO(f.time) })));
			setTemp(data.temp || 0);
			setRh(data.rh || 0);
		};

		main().catch((err) => console.error(err));
	}, []);

	return [items, temp, rh];
};

export interface NewsItem {
	date: Date;
	title: string;
	description: string;
	img: string;
	link: string;
}

export const useNews = (id: string): NewsItem[] => {
	const [items, setItems] = useState<NewsItem[]>([]);

	useEffect(() => {
		const main = async () => {
			const { data } = await axios(`${BASE_URL}/news/${id}`);
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

export interface UploadItem {
	title: string;
	img: string;
	ratio: number;
}

export const useUpload = (): UploadItem[] => {
	const [items, setItems] = useState<UploadItem[]>([]);

	useEffect(() => {
		const main = async () => {
			const { data } = await axios(`${BASE_URL}/upload`);
			setItems(data);
		};

		main().catch((err) => console.error(err));
	}, []);

	return items;
};
