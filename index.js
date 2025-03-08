import React from 'react';
import ReactDOM from 'react-dom';
import "./index.css";
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Auth0Provider } from "@auth0/auth0-react";
import history from "./utils/history";
import { getConfig } from "./config";

const onRedirectCallback = (appState) => {
    history.push('@page')
}

const config = getConfig();

const providerConfig = {
    domain: config.domain,
    clientId: config.clientId,
    onRedirectCallback,
    authorizationParams: {
        redirect_uri: window.location.origin,
        ...(config.audience ? {audience: config.audience}: null),
    },
};

ReactDOM.render(
    <Auth0Provider {...providerConfig}>
        <App />
    </Auth0Provider>,
    document.getElementById('root')
);

serviceWorker.unregister();