import { styled } from '@stitches/react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import React, { FC } from 'react';
import Holidays from 'date-holidays';

import { useBattery } from './api';

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
	marginTop: -2
});

const DateContainer = styled('div', {
	flex: 1,
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-between',
	alignItems: 'flex-end',
	paddingBottom: 10,
	overflowX: 'hidden',
	paddingTop: 4
});

const DateMain = styled('div', {
	fontSize: 80,
	lineHeight: '1em'
});

const DateSub = styled('div', {
	display: 'flex',
	flexDirection: 'row',
	fontSize: 50,
	lineHeight: '1em',
	color: 'gray',
	whiteSpace: 'nowrap'
});

const ProgressContainer = styled('div', {
	padding: 10,
	paddingLeft: 20,
	boxSizing: 'border-box',
	height: '100%'
});

const ProgressBackground = styled('div', {
	width: 40,
	height: '100%',
	position: 'relative',
	backgroundColor: 'white'
});

const Progress = styled('div', {
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'flex-end',
	alignItems: 'center',
	position: 'absolute',
	backgroundColor: 'green',
	width: '100%',
	bottom: 0,
	boxSizing: 'border-box',
	paddingBottom: 4,
	fontSize: '2em'
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
	const date = format(now, 'd. MMMM', { locale: de });
	const dateSub = format(now, holiday ? 'eee' : 'eeee', { locale: de }).replace('.', '');
	const piJuice = useBattery();

	return (
		<HeaderContainer>
			<Time onClick={onTimeClick}>{time}</Time>
			{piJuice && (
				<ProgressContainer>
					<ProgressBackground>
						<Progress style={{ height: `${piJuice.battery.charge}%` }}>
							{piJuice.status.batteryStatus.includes('CHARGING') && '⚡'}
						</Progress>
					</ProgressBackground>
				</ProgressContainer>
			)}
			<DateContainer onClick={onDateClick}>
				<DateMain>{date}</DateMain>
				<DateSub>
					<div>{dateSub}</div>
					{holiday && <div>&nbsp;•&nbsp;{holiday[0].name}</div>}
				</DateSub>
			</DateContainer>
		</HeaderContainer>
	);
};
