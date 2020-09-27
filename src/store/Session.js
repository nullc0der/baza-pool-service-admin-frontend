import get from 'lodash/get'

import { DispatchAPI } from 'api/base'
import * as sessionAPI from 'api/session'

const INITIAL_STATE = {
    pastSessions: [],
    currentSession: {},
    nextSession: {},
    isLoading: false,
    hasError: null,
}

const createAction = str => `SESSION_${str}`

const FETCH_SESSIONS = createAction('FETCH_SESSIONS')
const fetchSessions = () => dispatch => {
    return DispatchAPI(dispatch, sessionAPI.fetchSessions, {
        success: fetchSessionsSuccess,
        failure: fetchSessionsError,
    })
}

const FETCH_SESSIONS_SUCCESS = createAction('FETCH_SESSIONS_SUCCESS')
const fetchSessionsSuccess = res => ({
    type: FETCH_SESSIONS_SUCCESS,
    pastSessions: get(res.data, 'past_session', []),
    currentSession: get(res.data, 'current_session', {}),
    nextSession: get(res.data, 'next_session', {}),
})

const FETCH_SESSIONS_ERROR = createAction('FETCH_SESSIONS_ERROR')
const fetchSessionsError = err => ({
    type: FETCH_SESSIONS_ERROR,
    error: err,
})

const UPDATE_SESSION = createAction('UPDATE_SESSION')
const updateSession = (id, data) => dispatch => {
    return DispatchAPI(dispatch, sessionAPI.updateSession(id, data), {
        success: updateSessionSuccess,
        failure: updateSessionError,
    })
}

const UPDATE_SESSION_SUCCESS = createAction('UPDATE_SESSION_SUCCESS')
const updateSessionSuccess = res => ({
    type: UPDATE_SESSION_SUCCESS,
    session: get(res, 'data', {}),
})

const UPDATE_SESSION_ERROR = createAction('UPDATE_SESSION_ERROR')
const updateSessionError = err => ({
    type: UPDATE_SESSION_ERROR,
    error: err,
})

const ADD_TOKEN_TO_CURRENT_AND_NEXT_SESSION = createAction(
    'ADD_TOKEN_TO_CURRENT_AND_NEXT_SESSION'
)
const addTokenToCurrentAndNextSession = token => ({
    type: ADD_TOKEN_TO_CURRENT_AND_NEXT_SESSION,
    token,
})

const UPDATE_TOKEN_OF_CURRENT_AND_NEXT_SESSION = createAction(
    'UPDATE_TOKEN_OF_CURRENT_AND_NEXT_SESSION'
)
const updateTokenOfCurrentAndNextSession = token => ({
    type: UPDATE_TOKEN_OF_CURRENT_AND_NEXT_SESSION,
    token,
})

export const actions = {
    fetchSessions,
    updateSession,
    addTokenToCurrentAndNextSession,
    updateTokenOfCurrentAndNextSession,
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case FETCH_SESSIONS:
        case UPDATE_SESSION:
            return { ...state, isLoading: true, hasError: null }
        case FETCH_SESSIONS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                pastSessions: action.pastSessions,
                currentSession: action.currentSession,
                nextSession: action.nextSession,
            }
        case UPDATE_SESSION_SUCCESS:
            return {
                ...state,
                isLoading: false,
                pastSessions: state.pastSessions.map(x =>
                    x.id === action.session.id ? action.session : x
                ),
                currentSession:
                    state.currentSession.id === action.session.id
                        ? action.session
                        : state.currentSession,
                nextSession:
                    state.nextSession.id === action.session.id
                        ? action.session
                        : state.nextSession,
            }
        case ADD_TOKEN_TO_CURRENT_AND_NEXT_SESSION:
            return {
                ...state,
                currentSession: {
                    ...state.currentSession,
                    tokens: [...state.currentSession.tokens, action.token],
                },
                nextSession: {
                    ...state.nextSession,
                    tokens: [...state.nextSession.tokens, action.token],
                },
            }
        case UPDATE_TOKEN_OF_CURRENT_AND_NEXT_SESSION:
            return {
                ...state,
                currentSession: {
                    ...state.currentSession,
                    tokens: state.currentSession.tokens.map(x =>
                        x.id === action.token.id ? action.token : x
                    ),
                },
                nextSession: {
                    ...state.nextSession,
                    tokens: state.nextSession.tokens.map(x =>
                        x.id === action.token.id ? action.token : x
                    ),
                },
            }
        case FETCH_SESSIONS_ERROR:
        case UPDATE_SESSION_ERROR:
            return { ...state, isLoading: false, hasError: action.error }
        default:
            return state
    }
}
