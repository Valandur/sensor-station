import { styled } from '@stitches/react';
import axios from 'axios';
import { add, format, isAfter, parseISO, startOfDay } from 'date-fns';
import { de } from 'date-fns/locale';
import React, { FC, useEffect, useState } from 'react';

interface WeatherEntry {
	time: Date;
	img: string;
	feelsLike: number;
}

const useWeather = (): [WeatherEntry[], number | null, number | null] => {
	const [items, setItems] = useState<WeatherEntry[]>([]);
	const [temp, setTemp] = useState<number | null>(null);
	const [rh, setRh] = useState<number | null>(null);

	useEffect(() => {
		const main = async () => {
			const { data } = await axios(`/weather`);
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

type DateCompare = (now: Date, date: Date) => boolean;
const WEATHER_FORECASTS: DateCompare[] = [
	(now, date) => isAfter(date, startOfDay(now)),
	(now, date) => isAfter(date, startOfDay(add(now, { days: 1 }))),
	(now, date) => isAfter(date, startOfDay(add(now, { days: 2 }))),
	(now, date) => isAfter(date, startOfDay(add(now, { days: 3 })))
];

const Container = styled('div', {
	flex: 1,
	display: 'flex',
	flexDirection: 'row'
});
const ContainerSensor = styled('div', {
	flex: 1,
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-evenly',
	alignItems: 'center'
});
const SensorText = styled('div', {
	fontSize: 100,
	textAlign: 'center'
});
const ContainerForecasts = styled('div', {
	flex: 3,
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
	fontSize: 80,
	textAlign: 'center',
	marginTop: 35
});

export const Weather: FC = () => {
	const [forecasts, temp, rh] = useWeather();

	const now = new Date();
	const shownForecasts = WEATHER_FORECASTS.map((dateCompare) =>
		forecasts.find((forecast) => dateCompare(now, forecast.time))
	).filter((forecast) => !!forecast) as WeatherEntry[];

	return (
		<Container>
			<ContainerSensor>
				<SensorText style={{ color: '#23ad00' }}>{temp?.toFixed(0)}°</SensorText>
				<SensorText style={{ color: '#0052d6' }}>{rh?.toFixed(0)}%</SensorText>
			</ContainerSensor>
			<ContainerForecasts>
				{shownForecasts.map((forecast) => (
					<Forecast key={forecast.time.toISOString()}>
						<ForecastText style={{ flex: 1 }}>{format(forecast.time, 'iiiiii', { locale: de })}</ForecastText>
						<ForecastImg className={`owf owf-${forecast.img}`} />
						<ForecastText style={{ flex: 0.5, color: '#23ad00' }}>{forecast.feelsLike.toFixed(0)}°</ForecastText>
					</Forecast>
				))}
			</ContainerForecasts>
		</Container>
	);
};
