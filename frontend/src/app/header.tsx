import { styled } from '@stitches/react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import React, { FC, useCallback, useState } from 'react';
import Holidays from 'date-holidays';

import { useData } from './api';

const HeaderContainer = styled('div', {
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'stretch',
	paddingLeft: 10,
	paddingRight: 10,
	marginBottom: 20
});

const LeftContainer = styled('div', {
	fontSize: 150,
	paddingRight: 30
});

const RightContainer = styled('div', {
	flex: 1,
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-end',
	overflowX: 'hidden',
	paddingTop: 10
});

const DateMain = styled('div', {
	fontSize: 60,
	paddingTop: 10
});

const DateSub = styled('div', {
	display: 'flex',
	flexDirection: 'row',
	fontSize: 30,
	whiteSpace: 'nowrap'
});

const SymbolContainer = styled('div', {
	display: 'flex',
	flexDirection: 'row-reverse',
	alignItems: 'center',
	height: 20
});

const BasicSymbol = styled('div', {
	fontSize: 20,
	marginRight: 20
});

const MobileContainer = styled('div', {
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'flex-end',
	marginRight: 20
});

const MobileBar = styled('div', {
	width: 4,
	marginRight: 2
});

const BatteryContainer = styled('div', {
	width: 100,
	backgroundColor: 'gray',
	border: '1px solid black'
});

const BatteryCharge = styled('div', {
	color: 'black',
	backgroundColor: 'orange',
	paddingLeft: 4,
	fontSize: 20,
	whiteSpace: 'nowrap'
});

const Options = styled('div', {
	position: 'fixed',
	top: 160,
	left: 10,
	right: 10,
	bottom: 10,
	padding: 10,
	backgroundColor: 'black',
	border: '1px solid orange',
	fontSize: 20
});

interface Props {
	isPaused: boolean;
	onRequestPause: (pause?: boolean) => void;
}

const holidays = new Holidays('CH', 'ZH');

export const Header: FC<Props> = ({ isPaused, onRequestPause }) => {
	const { battery, modem } = useData();

	const now = new Date();
	const holiday = holidays.isHoliday(now);
	const time = now.toLocaleTimeString('de-CH', { timeZone: modem?.tzName, timeStyle: 'short' });
	const date = format(now, 'd. MMMM', { locale: de });
	const dateSub = format(now, holiday ? 'eee' : 'eeee', { locale: de }).replace('.', '');

	const onTimeClick = useCallback(() => onRequestPause(), []);

	const [showOptions, setShowOptions] = useState(false);
	const toggleOptions = useCallback(() => {
		setShowOptions(!showOptions);
		onRequestPause(!showOptions);
	}, [setShowOptions, onRequestPause, showOptions]);

	return (
		<HeaderContainer>
			<LeftContainer onClick={onTimeClick}>{time}</LeftContainer>

			<RightContainer onClick={toggleOptions}>
				<SymbolContainer>
					{battery && (
						<BatteryContainer>
							<BatteryCharge style={{ width: `${battery.charge}%` }}>
								{battery.batteryStatus.includes('CHARGING') && '⚡'} {battery.charge}%
							</BatteryCharge>
						</BatteryContainer>
					)}

					{modem?.operator && (
						<MobileContainer>
							<MobileBar style={{ height: 5, backgroundColor: modem.signal > 0 ? 'orange' : 'gray' }}></MobileBar>
							<MobileBar style={{ height: 10, backgroundColor: modem.signal > 1 ? 'orange' : 'gray' }}></MobileBar>
							<MobileBar style={{ height: 15, backgroundColor: modem.signal > 2 ? 'orange' : 'gray' }}></MobileBar>
							<MobileBar style={{ height: 20, backgroundColor: modem.signal > 3 ? 'orange' : 'gray' }}></MobileBar>
						</MobileContainer>
					)}

					{!!modem?.lat && !!modem?.lng && <BasicSymbol>🛰️</BasicSymbol>}

					{isPaused && <BasicSymbol>⏸️</BasicSymbol>}
				</SymbolContainer>

				<DateMain>{date}</DateMain>

				<DateSub>
					<div>{dateSub}</div>
					{holiday && <div>&nbsp;•&nbsp;{holiday[0].name}</div>}
				</DateSub>
			</RightContainer>

			{showOptions && (
				<Options>
					<div>Time: {modem?.time}</div>
					<div>
						TZ: {modem?.tzOffset} ({modem?.tzName})
					</div>
					<div>Net: {modem?.operator}</div>
					<div>Lat: {modem?.lat}</div>
					<div>Lng: {modem?.lng}</div>
					<div>Power: {battery?.powerIn}</div>
					<div>Voltage: {battery?.voltage}V</div>
					<div>Current: {battery?.current}A</div>
				</Options>
			)}
		</HeaderContainer>
	);
};
