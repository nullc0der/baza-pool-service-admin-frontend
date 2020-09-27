const INITIAL_STATE = {
    isAuthenticated: false,
    authToken: '',
    expiresIn: '',
    userName: '',
}

const AUTHENTICATE_USER = 'AUTHENTICATE_USER'
const authenticateUser = (authToken, expiresIn, userName) => ({
    type: AUTHENTICATE_USER,
    authToken,
    expiresIn,
    userName,
})

const DEAUTHENTICATE_USER = 'DEAUTHENTICATE_USER'
const deauthenticateUser = () => ({
    type: DEAUTHENTICATE_USER,
})

export const actions = {
    authenticateUser,
    deauthenticateUser,
}

export default function authReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case AUTHENTICATE_USER:
            return {
                ...state,
                isAuthenticated: true,
                authToken: action.authToken,
                expiresIn: action.expiresIn,
                userName: action.userName,
            }
        case DEAUTHENTICATE_USER:
            return {
                ...state,
                isAuthenticated: false,
                authToken: '',
                expiresIn: '',
                userName: '',
            }
        default:
            return state
    }
}
