import React, { FC, useCallback, useEffect, useState } from 'react';
import { globalCss, styled } from '@stitches/react';
import { differenceInMilliseconds } from 'date-fns';

import { Header } from './header';
import { News } from './news';
import { Weather } from './weather';
import { Events } from './events';

const BIRTHDAYS: { name: string; month: number; day: number }[] = [
	{
		name: 'Mama',
		month: 10,
		day: 5
	},
	{
		name: 'Papa',
		month: 1,
		day: 19
	}
];

const globalStyles = globalCss({
	body: {
		margin: 0,
		padding: 0,
		backgroundColor: 'black',
		fontFamily:
			"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
		color: 'white',
		'-webkit-font-smoothing': 'antialiased',
		'-moz-osx-font-smoothing': 'grayscale'
	}
});

const Container = styled('div', {
	height: '100vh',
	display: 'flex',
	flexDirection: 'column',
	boxSizing: 'border-box'
});

const Progress = styled('div', {
	position: 'absolute',
	backgroundColor: 'gray',
	left: 0,
	bottom: 0,
	height: 2
});

const AUTO_SWITCH = 30 * 1000;

export const App: FC = () => {
	globalStyles();

	const [screen, setScreen] = useState(0);
	const [paused, setPaused] = useState(false);
	const [reset, setReset] = useState(new Date());
	const [, refresh] = useState(false);

	useEffect(() => {
		const interval = setInterval(() => {
			if (!paused) {
				refresh((v) => !v);
				if (differenceInMilliseconds(new Date(), reset) >= AUTO_SWITCH) {
					incScreen();
				}
			}
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}, [paused, reset]);

	const resetTimer = useCallback(() => {
		setReset(new Date());
	}, [setReset]);

	const pause = useCallback((pause: boolean) => {
		if (pause) {
			setPaused(true);
		} else {
			setReset(new Date());
			setPaused(false);
		}
	}, []);

	const now = new Date();
	const birthday = BIRTHDAYS.find((b) => now.getMonth() + 1 === b.month && now.getDate() === b.day);

	const screens: JSX.Element[] = [
		<Weather />,
		<News id="1646" onRequestPause={pause} />,
		<News id="718" onRequestPause={pause} />
	];
	if (birthday) {
		screens.push(
			<Events>
				🎉 Happy Birthday <b>{birthday.name}</b> 🎉
				<br />
				<br />
				Alles gueti zum Geburi! 🥳
			</Events>
		);
	}
	const numScreens = screens.length;

	const incScreen = useCallback(() => {
		setScreen((s) => (s + 1) % numScreens);
		setReset(new Date());
	}, [setScreen, resetTimer, numScreens]);

	const decScreen = useCallback(() => {
		setScreen((s) => (numScreens + s - 1) % numScreens);
		setReset(new Date());
	}, [setScreen, resetTimer, numScreens]);

	return (
		<Container>
			<Header onTimeClick={decScreen} onDateClick={incScreen} />
			{screens[screen]}
			{!paused && (
				<Progress
					style={{ width: `${Math.min(1, differenceInMilliseconds(new Date(), reset) / AUTO_SWITCH) * 100}%` }}
				/>
			)}
		</Container>
	);
};
