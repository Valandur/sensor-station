import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { global, styled } from '@stitches/react';

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

const NUM_SCREENS = 4;

export const App: FC = () => {
	globalStyles();

	const interval = useRef<NodeJS.Timeout>();
	const [screen, setScreen] = useState(0);
	const [paused, setPaused] = useState(false);

	const incScreen = useCallback(() => {
		setScreen((s) => (s + 1) % NUM_SCREENS);
	}, [setScreen]);

	const decScreen = useCallback(() => {
		setScreen((s) => (NUM_SCREENS + s - 1) % NUM_SCREENS);
	}, [setScreen]);

	useEffect(() => {
		if (paused) {
			if (interval.current) {
				clearInterval(interval.current);
			}
		} else {
			interval.current = setInterval(incScreen, 20 * 1000);
		}
	}, [paused]);

	return (
		<Container>
			<Header onTimeClick={decScreen} onDateClick={incScreen} />
			{screen === 0 && <News id="1646" onRequestPause={(pause) => setPaused(pause)} />}
			{screen === 1 && <News id="718" onRequestPause={(pause) => setPaused(pause)} />}
			{screen === 2 && <Reddit />}
			{screen === 3 && <Weather />}
		</Container>
	);
};
