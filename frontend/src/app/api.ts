import { useEffect, useState } from 'react';
import axios from 'axios';
import { parseISO } from 'date-fns';

export const BASE_URL = window.location.origin;

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
			setItems(
				data.forecasts.map((f: { time: string; img: string; feelsLike: number }) => ({ ...f, time: parseISO(f.time) }))
			);
			setTemp(data.sensor.temp || 0);
			setRh(data.sensor.rh || 0);
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

export interface RedditItem {
	date: Date;
	title: string;
	img: string;
	ratio: number;
}

export const useReddit = (name: string): RedditItem[] => {
	const [items, setItems] = useState<RedditItem[]>([]);

	useEffect(() => {
		const main = async () => {
			const { data } = await axios(`${BASE_URL}/reddit/${name}`);
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

export interface StatusInfo {
	isFault: boolean;
	isButton: boolean;
	batteryStatus: string;
	powerIn: string;
	powerIn5vIo: string;
}

export interface Battery {
	charge: number;
	voltage: number;
	current: number;
}

export interface PiJuice {
	status: StatusInfo;
	battery: Battery;
}

export const useBattery = (): PiJuice | undefined => {
	const [piJuice, setPiJuice] = useState<PiJuice>();

	useEffect(() => {
		const main = async () => {
			const { data } = await axios(`${BASE_URL}/pijuice`);
			setPiJuice(data);
		};

		main().catch((err) => console.error(err));
		const interval = setInterval(() => main().catch((err) => console.error(err)), 5000);

		return () => {
			clearInterval(interval);
		};
	}, []);

	return piJuice;
};
