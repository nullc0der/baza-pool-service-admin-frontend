import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
