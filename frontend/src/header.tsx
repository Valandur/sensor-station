import { styled } from '@stitches/react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import React, { FC, useEffect, useState } from 'react';

const HeaderContainer = styled('div', {
	display: 'flex',
	flexDirection: 'row',
	paddingBottom: 40,
	boxSizing: 'border-box',
	justifyContent: 'space-between'
});

const Time = styled('div', {
	fontSize: 150,
	lineHeight: '0.8em',
	color: 'orange'
});

const DateContainer = styled('div', {
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-end'
});

const DateMain = styled('div', {
	fontSize: 80,
	lineHeight: '1em'
});

const DateSub = styled('div', {
	fontSize: 50,
	lineHeight: '1em',
	color: 'gray'
});

export const Header: FC = () => {
	const now = new Date();
	const time = format(now, 'HH:mm');
	const date = format(now, 'dd. MMM', { locale: de });
	const dateSub = format(now, 'eeee', { locale: de });

	const [, refresh] = useState(false);

	useEffect(() => {
		const interval = setInterval(() => refresh((r) => !r), 1000);
		return () => {
			clearInterval(interval);
		};
	}, []);

	return (
		<HeaderContainer>
			<Time>{time}</Time>
			<DateContainer>
				<DateMain>{date}</DateMain>
				<DateSub>{dateSub}</DateSub>
			</DateContainer>
		</HeaderContainer>
	);
};
