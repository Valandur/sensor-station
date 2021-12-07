import { styled } from '@stitches/react';
import axios from 'axios';
import { add, format, isAfter, parseISO, startOfDay } from 'date-fns';
import { de } from 'date-fns/locale';
import React, { FC, useEffect, useState } from 'react';

import { BASE_URL } from './const';

interface WeatherEntry {
	time: Date;
	img: string;
	feelsLike: number;
}

const useWeather = (): WeatherEntry[] => {
	const [items, setItems] = useState<WeatherEntry[]>([]);

	useEffect(() => {
		const main = async () => {
			const { data } = await axios(`${BASE_URL}/weather`);
			setItems(
				data.forecasts.map((f: { time: string; img: string; feelsLike: number }) => ({ ...f, time: parseISO(f.time) }))
			);
		};

		main().catch((err) => console.error(err));
	}, []);

	return items;
};

type DateCompare = (now: Date, date: Date) => boolean;
const WEATHER_FORECASTS: DateCompare[] = [
	(now, date) => isAfter(date, startOfDay(now)),
	(now, date) => isAfter(date, startOfDay(add(now, { days: 1 }))),
	(now, date) => isAfter(date, startOfDay(add(now, { days: 2 }))),
	(now, date) => isAfter(date, startOfDay(add(now, { days: 3 }))),
	(now, date) => isAfter(date, startOfDay(add(now, { days: 4 })))
];

const Container = styled('div', {
	flex: 1,
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'space-between',
	alignItems: 'stretch'
});
const Forecast = styled('div', {
	flex: 1,
	display: 'flex',
	flexDirection: 'column'
});
const ForecastImg = styled('i', {
	fontSize: '10em !important',
	textAlign: 'center'
});
const ForecastText = styled('div', {
	fontSize: 60,
	textAlign: 'center',
	marginTop: 40
});

export const Weather: FC = () => {
	const forecasts = useWeather();

	const now = new Date();
	const shownForecasts = WEATHER_FORECASTS.map((dateCompare) =>
		forecasts.find((forecast) => dateCompare(now, forecast.time))
	).filter((forecast) => !!forecast) as WeatherEntry[];

	return (
		<Container>
			{shownForecasts.map((forecast) => (
				<Forecast key={forecast.time.toISOString()}>
					<ForecastText style={{ flex: 1 }}>{format(forecast.time, 'iiiiii', { locale: de })}</ForecastText>
					<ForecastImg className={`owf owf-${forecast.img}`} />
					<ForecastText style={{ flex: 0.8, color: '#23ad00' }}>{forecast.feelsLike.toFixed(0)}°</ForecastText>
				</Forecast>
			))}
		</Container>
	);
};
