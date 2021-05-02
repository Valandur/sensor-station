import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import React, { FC } from 'react';

export const App: FC = () => {
	const now = new Date();
	const time = format(now, 'HH:mm');
	const date = format(now, 'dd. MMM', { locale: de });
	const dateSub = format(now, 'eeee', { locale: de });

	return (
		<div style={{ height: '100vh', padding: 10 }}>
			<div style={{ fontSize: 80 }}>{time}</div>
			<div>{date}</div>
			<div>{dateSub}</div>
		</div>
	);
};
