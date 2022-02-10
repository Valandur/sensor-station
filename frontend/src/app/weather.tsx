import { styled } from '@stitches/react';
import { add, format, isAfter, startOfDay } from 'date-fns';
import { de } from 'date-fns/locale';
import React, { FC } from 'react';

import { useWeather, WeatherItem } from './api';

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
	flexDirection: 'column',
	alignItems: 'center'
});
const ForecastImg = styled('img', {
	width: '60%'
});
const ForecastText = styled('div', {
	fontSize: 80,
	textAlign: 'center'
});

export const Weather: FC = () => {
	const [forecasts, temp, rh] = useWeather();

	const now = new Date();
	const shownForecasts = WEATHER_FORECASTS.map((dateCompare) =>
		forecasts.find((forecast) => dateCompare(now, forecast.time))
	).filter((forecast) => !!forecast) as WeatherItem[];

	return (
		<Container>
			{!process.env.REACT_APP_DISABLE_SENSOR && (
				<ContainerSensor>
					<SensorText style={{ color: '#23ad00' }}>{temp?.toFixed(0)}°</SensorText>
					<SensorText style={{ color: '#0052d6' }}>{rh?.toFixed(0)}%</SensorText>
				</ContainerSensor>
			)}
			<ContainerForecasts>
				{shownForecasts.map((forecast) => (
					<Forecast key={forecast.time.toISOString()}>
						<ForecastText>{format(forecast.time, 'iiiiii', { locale: de })}</ForecastText>
						<ForecastImg src={forecast.img} />
						<ForecastText style={{ color: '#23ad00' }}>{forecast.feelsLike.toFixed(0)}°</ForecastText>
					</Forecast>
				))}
			</ContainerForecasts>
		</Container>
	);
};
