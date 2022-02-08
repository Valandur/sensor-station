import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { App } from './app';
import { Web } from './web';

ReactDOM.render(
	<React.StrictMode>
		<Router>
			<Routes>
				<Route path="/web">
					<Web />
				</Route>
				<Route path="/*">
					<App />
				</Route>
			</Routes>
		</Router>
	</React.StrictMode>,
	document.getElementById('root')
);
