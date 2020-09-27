import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import thunk from 'redux-thunk'
import * as History from 'history'
import debounce from 'lodash/debounce'

import createRootReducer from './rootReducer'

export const history = History.createBrowserHistory()

const initialState = {}
const enhancers = []
const middleware = [thunk, routerMiddleware(history)]

// This is the timeout for debounced store save
const STORE_TIMEOUT = 1000
function _saveLocalState(keyName = 'auth', providedState = {}) {
    localStorage.setItem(keyName, JSON.stringify(providedState))
}

export const saveLocalState = debounce(_saveLocalState, STORE_TIMEOUT, {
    trailing: true,
})

export function removeLocalState(keyName = 'auth') {
    localStorage.removeItem(keyName)
}

export function loadLocalState(keyName = 'auth') {
    const _state = localStorage.getItem(keyName)
    if (typeof _state === 'string' && _state[0] === '{')
        return JSON.parse(_state)
    return {}
}

const uiState = loadLocalState('ui')

const authState = loadLocalState('auth')

const finalState = { ...authState, ...uiState, ...initialState }

if (process.env.NODE_ENV === 'development') {
    const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__

    if (typeof devToolsExtension === 'function') {
        enhancers.push(devToolsExtension())
    }
}

const composedEnhancers = compose(applyMiddleware(...middleware), ...enhancers)

export default createStore(
    createRootReducer(history),
    finalState,
    composedEnhancers
)
