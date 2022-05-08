import React, { FC, TouchEvent, useCallback, useEffect, useState } from 'react';
import { globalCss, styled } from '@stitches/react';
import { differenceInMilliseconds } from 'date-fns';

import { Header } from './header';
import { News } from './news';
import { Weather } from './weather';
import { Events } from './events';
import { Upload } from './upload';

const BIRTHDAYS: { name: string; month: number; day: number }[] = [
	{
		name: 'Michi',
		month: 6,
		day: 4
	},
	{
		name: 'Robin',
		month: 3,
		day: 26
	},
	{
		name: 'Lea',
		month: 8,
		day: 1
	},
	{
		name: 'Marco',
		month: 12,
		day: 14
	}
];

const globalStyles = globalCss({
	body: {
		margin: 0,
		padding: 0,
		fontFamily: "'Roboto', sans-serif",
		'-webkit-font-smoothing': 'antialiased',
		'-moz-osx-font-smoothing': 'grayscale',
		backgroundColor: 'black',
		color: 'orange'
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
	const [startX, setStartX] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			if (!paused) {
				refresh((v) => !v);
				if (differenceInMilliseconds(new Date(), reset) >= AUTO_SWITCH) {
					changeScreen();
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

	const pause = useCallback(
		(pause?: boolean) => {
			setReset(new Date());

			if (typeof pause !== 'boolean') {
				setPaused((p) => !p);
			} else {
				setPaused(pause);
			}
		},
		[paused]
	);

	const now = new Date();
	const birthday = BIRTHDAYS.find((b) => now.getMonth() + 1 === b.month && now.getDate() === b.day);

	const screens: JSX.Element[] = [
		<Weather />,
		<News id="1646" onRequestPause={pause} />,
		!process.env.REACT_APP_DISABLE_UPLOAD && <Upload onRequestReset={resetTimer} />,
		birthday && (
			<Events>
				🎉 Happy Birthday <b>{birthday.name}</b> 🎉
				<br />
				<br />
				Alles gueti zum Geburi! 🥳
			</Events>
		)
	].filter((e) => !!e) as JSX.Element[];

	const numScreens = screens.length;

	const changeScreen = useCallback(
		(diff = 1) => {
			setScreen((s) => (s + numScreens + diff) % numScreens);
			setReset(new Date());
		},
		[setScreen, resetTimer, numScreens]
	);

	const touchStart = useCallback(
		(e: TouchEvent<HTMLDivElement>) => {
			setStartX(e.changedTouches[0].clientX);
		},
		[setStartX]
	);
	const touchEnd = useCallback(
		(e: TouchEvent<HTMLDivElement>) => {
			const diff = e.changedTouches[0].clientX - startX;
			if (diff < -100) {
				changeScreen(1);
			} else if (diff > 100) {
				changeScreen(-1);
			}
		},
		[changeScreen, startX]
	);

	return (
		<Container onTouchStart={touchStart} onTouchEnd={touchEnd}>
			<Header isPaused={paused} onRequestPause={pause} />
			{screens[screen]}
			{!paused && (
				<Progress
					style={{ width: `${Math.min(1, differenceInMilliseconds(new Date(), reset) / AUTO_SWITCH) * 100}%` }}
				/>
			)}
		</Container>
	);
};
