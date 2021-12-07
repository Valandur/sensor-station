import { styled } from '@stitches/react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import React, { FC, useEffect, useState } from 'react';
import Holidays from 'date-holidays';
import axios from 'axios';

import { BASE_URL } from './const';

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
	padding: 30,
	boxSizing: 'border-box',
	height: '100%'
});

const ProgressBackground = styled('div', {
	width: 20,
	height: '100%',
	position: 'relative',
	backgroundColor: 'white'
});

const Progress = styled('div', {
	position: 'absolute',
	backgroundColor: 'green',
	width: '100%',
	bottom: 0
});

interface Props {
	onTimeClick: () => void;
	onDateClick: () => void;
}

const holidays = new Holidays('CH', 'ZH');

interface StatusInfo {
	isFault: boolean;
	isButton: boolean;
	batteryStatus: string;
	powerIn: string;
	powerIn5vIo: string;
}

interface Battery {
	charge: number;
	voltage: number;
	current: number;
}

interface PiJuice {
	status: StatusInfo;
	battery: Battery;
}

export const Header: FC<Props> = ({ onTimeClick, onDateClick }) => {
	const now = new Date();
	const holiday = holidays.isHoliday(new Date('2021-08-01 12:00:00 GMT+0100'));
	const time = format(now, 'HH:mm');
	const date = format(now, 'dd. MMMM', { locale: de });
	const dateSub = format(now, holiday ? 'eee' : 'eeee', { locale: de }).replace('.', '');
	const [piJuice, setPiJuice] = useState<PiJuice>();

	useEffect(() => {
		const main = async () => {
			const { data } = await axios(`${BASE_URL}/pijuice`);
			setPiJuice(data);
		};

		main().catch((err) => console.error(err));
		const interval = setInterval(() => main().catch((err) => console.error(err)), 10000);

		return () => {
			clearInterval(interval);
		};
	}, []);

	return (
		<HeaderContainer>
			<Time onClick={onTimeClick}>{time}</Time>
			{piJuice && (
				<ProgressContainer>
					<ProgressBackground>
						<Progress style={{ height: `${piJuice.battery.charge}%` }} />
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
