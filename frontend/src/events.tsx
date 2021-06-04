import { styled } from '@stitches/react';
import React, { FC, memo, PropsWithChildren } from 'react';

const Container = styled('div', {
	flex: 1,
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	overflow: 'hidden'
});

const Text = styled('div', {
	textAlign: 'center',
	fontSize: '3em'
});

const EventsComp: FC<PropsWithChildren<unknown>> = ({ children }) => {
	return (
		<Container>
			<Text>{children}</Text>
		</Container>
	);
};

export const Events = memo(EventsComp);
