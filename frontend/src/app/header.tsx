import { styled } from '@stitches/react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import React, { FC } from 'react';
import Holidays from 'date-holidays';

import { useBattery, useModem } from './api';

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

const SymbolContainer = styled('div', {
	margin: 10,
	marginLeft: 20,
	boxSizing: 'border-box',
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center'
});

const MobileContainer = styled('div', {
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'flex-end'
});

const MobileBar = styled('div', {
	width: 10,
	marginRight: 2
});

const GPSContainer = styled('div', {
	fontSize: '2em',
	textAlign: 'center'
});

const BatteryContainer = styled('div', {
	flex: 1,
	position: 'relative',
	backgroundColor: 'gray',
	alignSelf: 'stretch'
});

const BatteryCharge = styled('div', {
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'flex-end',
	alignItems: 'center',
	position: 'absolute',
	backgroundColor: 'orange',
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
	const modem = useModem();

	return (
		<HeaderContainer>
			<Time onClick={onTimeClick}>{time}</Time>
			<SymbolContainer>
				{modem?.operator && (
					<MobileContainer>
						<MobileBar style={{ height: 5, backgroundColor: modem.signal > 0 ? 'orange' : 'gray' }}></MobileBar>
						<MobileBar style={{ height: 15, backgroundColor: modem.signal > 1 ? 'orange' : 'gray' }}></MobileBar>
						<MobileBar style={{ height: 25, backgroundColor: modem.signal > 2 ? 'orange' : 'gray' }}></MobileBar>
						<MobileBar style={{ height: 35, backgroundColor: modem.signal > 3 ? 'orange' : 'gray' }}></MobileBar>
					</MobileContainer>
				)}
				{!!modem?.lat && !!modem?.lng && <GPSContainer>🛰️</GPSContainer>}
				{piJuice && (
					<BatteryContainer>
						<BatteryCharge style={{ height: `${piJuice.battery.charge}%` }}>
							{piJuice.status.batteryStatus.includes('CHARGING') && '⚡'}
						</BatteryCharge>
					</BatteryContainer>
				)}
			</SymbolContainer>

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
