import { styled } from '@stitches/react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import React, { FC } from 'react';
import Holidays from 'date-holidays';

import { useData } from './api';

const HeaderContainer = styled('div', {
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'stretch',
	paddingLeft: 4,
	paddingRight: 4,
	marginBottom: 30
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
	alignSelf: 'center',
	overflowX: 'hidden'
});

const DateMain = styled('div', {
	fontSize: 60,
	lineHeight: '1em'
});

const DateSub = styled('div', {
	display: 'flex',
	flexDirection: 'row',
	fontSize: 40,
	whiteSpace: 'nowrap'
});

const SymbolContainer = styled('div', {
	display: 'flex',
	flexDirection: 'row-reverse',
	alignItems: 'center',
	height: 50
});

const BasicSymbol = styled('div', {
	fontSize: '2em',
	marginRight: 20
});

const MobileContainer = styled('div', {
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'flex-end',
	marginRight: 20
});

const MobileBar = styled('div', {
	width: 10,
	marginRight: 2
});

const BatteryContainer = styled('div', {
	width: 200,
	backgroundColor: 'gray',
	border: '1px solid black'
});

const BatteryCharge = styled('div', {
	color: 'black',
	backgroundColor: 'orange',
	paddingLeft: 4,
	fontSize: 28,
	whiteSpace: 'nowrap'
});

interface Props {
	isPaused: boolean;
	onTimeClick: () => void;
}

const holidays = new Holidays('CH', 'ZH');

export const Header: FC<Props> = ({ isPaused, onTimeClick }) => {
	const { battery, modem } = useData();

	const now = new Date();
	const holiday = holidays.isHoliday(now);
	const time = format(now, 'HH:mm');
	const date = format(now, 'd. MMMM', { locale: de });
	const dateSub = format(now, holiday ? 'eee' : 'eeee', { locale: de }).replace('.', '');

	return (
		<HeaderContainer>
			<LeftContainer onClick={onTimeClick}>{time}</LeftContainer>

			<RightContainer>
				<SymbolContainer>
					{battery && (
						<BatteryContainer>
							<BatteryCharge style={{ width: `${battery.charge}%` }}>
								{battery.charge}% {battery.batteryStatus.includes('CHARGING') && '⚡'}
							</BatteryCharge>
						</BatteryContainer>
					)}

					{modem?.operator && (
						<MobileContainer>
							<MobileBar style={{ height: 5, backgroundColor: modem.signal > 0 ? 'orange' : 'gray' }}></MobileBar>
							<MobileBar style={{ height: 15, backgroundColor: modem.signal > 1 ? 'orange' : 'gray' }}></MobileBar>
							<MobileBar style={{ height: 25, backgroundColor: modem.signal > 2 ? 'orange' : 'gray' }}></MobileBar>
							<MobileBar style={{ height: 35, backgroundColor: modem.signal > 3 ? 'orange' : 'gray' }}></MobileBar>
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
		</HeaderContainer>
	);
};
