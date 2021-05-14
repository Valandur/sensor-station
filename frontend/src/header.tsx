import { styled } from '@stitches/react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import React, { FC, useEffect, useState } from 'react';
import Holidays from 'date-holidays';

const HeaderContainer = styled('div', {
	display: 'flex',
	flexDirection: 'row',
	paddingBottom: 20,
	boxSizing: 'border-box',
	justifyContent: 'space-between'
});

const Time = styled('div', {
	fontSize: 150,
	lineHeight: '1em',
	color: 'orange',
	marginTop: -12,
	marginLeft: -5
});

const DateContainer = styled('div', {
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-between',
	alignItems: 'flex-end',
	paddingBottom: 10,
	overflowX: 'hidden'
});

const DateMain = styled('div', {
	fontSize: 80,
	lineHeight: '1em'
});

const DateSub = styled('div', {
	fontSize: 50,
	lineHeight: '1em',
	color: 'gray',
	whiteSpace: 'nowrap'
});

interface Props {
	onTimeClick: () => void;
	onDateClick: () => void;
}

const holidays = new Holidays('CH', 'ZH');

export const Header: FC<Props> = ({ onTimeClick, onDateClick }) => {
	const now = new Date();
	const holiday = holidays.isHoliday(now);
	const time = format(now, 'HH:mm');
	const date = format(now, 'dd. MMM', { locale: de });
	const dateSub = format(now, holiday ? 'eee' : 'eeee', { locale: de }).replace('.', '');

	const [, refresh] = useState(false);

	useEffect(() => {
		const interval = setInterval(() => refresh((r) => !r), 1000);
		return () => {
			clearInterval(interval);
		};
	}, []);

	return (
		<HeaderContainer>
			<Time onClick={onTimeClick}>{time}</Time>
			<DateContainer onClick={onDateClick}>
				<DateMain>{date}</DateMain>
				<DateSub>
					{dateSub}
					{/* eslint-disable-next-line no-irregular-whitespace */}
					{holiday && ` • ${holiday[0].name}`}
				</DateSub>
			</DateContainer>
		</HeaderContainer>
	);
};
