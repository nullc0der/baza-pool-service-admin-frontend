import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import Auth from './Auth'
import Session from './Session'
import Token from './Token'

const createRootReducer = history =>
    combineReducers({
        router: connectRouter(history),
        Auth,
        Session,
        Token,
    })

export default createRootReducer
