import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'

import store, { history, saveLocalState } from './store'
import * as serviceWorker from './serviceWorker'
import App from 'containers/App'

store.subscribe(() => {
    const { Auth, Session, ...others } = store.getState()
    saveLocalState('ui', others)
})

const render = Component => {
    return ReactDOM.render(
        <React.StrictMode>
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <Component />
                </ConnectedRouter>
            </Provider>
        </React.StrictMode>,
        document.getElementById('root')
    )
}

render(App)

if (module.hot) {
    module.hot.accept('./containers/App', () => {
        const NextApp = require('./containers/App').default
        render(NextApp)
    })
}

if (process.env.NODE_ENV !== 'development') {
    Sentry.init({
        dsn: process.env.REACT_APP_SENTRY_DSN,
        integrations: [new Integrations.BrowserTracing()],

        // We recommend adjusting this value in production, or using tracesSampler
        // for finer control
        tracesSampleRate: 1.0,
    })
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
