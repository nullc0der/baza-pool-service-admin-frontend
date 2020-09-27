import get from 'lodash/get'
import { DispatchAPI } from 'api/base'
import * as tokenAPI from 'api/token'

const INITIAL_STATE = {
    tokens: [],
    isLoading: false,
    hasError: null,
}

const createAction = str => `TOKEN_${str}`

const FETCH_TOKENS = createAction('FETCH_TOKENS')
const fetchTokens = () => dispatch => {
    return DispatchAPI(dispatch, tokenAPI.fetchTokens, {
        success: fetchTokensSuccess,
        failure: fetchTokensError,
    })
}

const FETCH_TOKENS_SUCCESS = createAction('FETCH_TOKENS_SUCCESS')
const fetchTokensSuccess = res => ({
    type: FETCH_TOKENS_SUCCESS,
    tokens: get(res, 'data', []),
})

const FETCH_TOKENS_ERROR = createAction('FETCH_TOKENS_ERROR')
const fetchTokensError = err => ({
    type: FETCH_TOKENS_ERROR,
    error: err,
})

const CREATE_TOKEN = createAction('CREATE_TOKEN')
const createToken = data => dispatch => {
    return DispatchAPI(dispatch, tokenAPI.createToken(data), {
        success: createTokenSuccess,
        failure: createTokenError,
    })
}

const CREATE_TOKEN_SUCCESS = createAction('CREATE_TOKEN_SUCCESS')
const createTokenSuccess = res => ({
    type: CREATE_TOKEN_SUCCESS,
    token: get(res, 'data', {}),
})

const CREATE_TOKEN_ERROR = createAction('CREATE_TOKEN_ERROR')
const createTokenError = err => ({
    type: CREATE_TOKEN_ERROR,
    error: err,
})

const UPDATE_TOKEN = createAction('UPDATE_TOKEN')
const updateToken = (id, data) => dispatch => {
    return DispatchAPI(dispatch, tokenAPI.updateToken(id, data), {
        success: updateTokenSuccess,
        failure: updateTokenError,
    })
}

const UPDATE_TOKEN_SUCCESS = createAction('UPDATE_TOKEN_SUCCESS')
const updateTokenSuccess = res => ({
    type: UPDATE_TOKEN_SUCCESS,
    token: get(res, 'data', {}),
})

const UPDATE_TOKEN_ERROR = createAction('UPDATE_TOKEN_ERROR')
const updateTokenError = err => ({
    type: UPDATE_TOKEN_ERROR,
    error: err,
})

export const actions = {
    fetchTokens,
    createToken,
    updateToken,
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case FETCH_TOKENS:
        case CREATE_TOKEN:
        case UPDATE_TOKEN:
            return { ...state, isLoading: true, hasError: null }
        case FETCH_TOKENS_SUCCESS:
            return { ...state, isLoading: false, tokens: action.tokens }
        case CREATE_TOKEN_SUCCESS:
            return {
                ...state,
                isLoading: false,
                tokens: [...state.tokens, action.token],
            }
        case UPDATE_TOKEN_SUCCESS:
            return {
                ...state,
                isLoading: false,
                tokens: state.tokens.map(x =>
                    x.id === action.token.id ? action.token : x
                ),
            }
        case FETCH_TOKENS_ERROR:
        case CREATE_TOKEN_ERROR:
        case UPDATE_TOKEN_ERROR:
            return { ...state, isLoading: false, hasError: action.error }
        default:
            return state
    }
}
