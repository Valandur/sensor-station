import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { App } from './app';
import { Web } from './web';

ReactDOM.render(
	<React.StrictMode>
		<Router>
			<Switch>
				<Route path="/" exact>
					<App />
				</Route>
				<Route path="/web">
					<Web />
				</Route>
			</Switch>
		</Router>
	</React.StrictMode>,
	document.getElementById('root')
);
