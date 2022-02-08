import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { App } from './app';
import { Web } from './web';

ReactDOM.render(
	<React.StrictMode>
		<Router>
			<Routes>
				{!process.env.REACT_APP_DISABLE_UPLOAD && <Route path="/web" element={<Web />} />}
				<Route path="/*" element={<App />} />
			</Routes>
		</Router>
	</React.StrictMode>,
	document.getElementById('root')
);
