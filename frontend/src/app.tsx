import React, { FC } from 'react';
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

export const App: FC = () => {
	globalStyles();

	return (
		<Container>
			<Header />
			{false && <News />}
			{false && <Reddit />}
			{true && <Weather />}
		</Container>
	);
};
