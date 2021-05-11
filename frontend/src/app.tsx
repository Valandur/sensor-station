import React, { FC, useCallback, useEffect, useState } from 'react';
import { global, styled } from '@stitches/react';
import { differenceInMilliseconds } from 'date-fns';

import { Header } from './header';
import { News } from './news';
import { Reddit } from './reddit';
import { Weather } from './weather';

const globalStyles = global({
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
	boxSizing: 'border-box',
	padding: 10,
	paddingTop: 0
});

const Progress = styled('div', {
	position: 'absolute',
	backgroundColor: 'gray',
	left: 0,
	bottom: 0,
	height: 2
});

const NUM_SCREENS = 4;
const AUTO_SWITCH = 20 * 1000;

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
					// incScreen();
				}
			}
		}, 100);

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

	const incScreen = useCallback(() => {
		setScreen((s) => (s + 1) % NUM_SCREENS);
		setReset(new Date());
	}, [setScreen, resetTimer]);

	const decScreen = useCallback(() => {
		setScreen((s) => (NUM_SCREENS + s - 1) % NUM_SCREENS);
		setReset(new Date());
	}, [setScreen, resetTimer]);

	return (
		<Container>
			<Header onTimeClick={decScreen} onDateClick={incScreen} />
			{screen === 0 && <Weather />}
			{screen === 1 && <News id="1646" onRequestPause={pause} />}
			{screen === 2 && <News id="718" onRequestPause={pause} />}
			{screen === 3 && <Reddit id="earthporn" onRequestReset={resetTimer} />}
			{!paused && (
				<Progress
					style={{ width: `${Math.min(1, differenceInMilliseconds(new Date(), reset) / AUTO_SWITCH) * 100}%` }}
				/>
			)}
		</Container>
	);
};
