import { create } from 'apisauce'
import store, { removeLocalState } from 'store'
import { actions as authActions } from 'store/Auth'

const api = create({
    baseURL: process.env.REACT_APP_API_ROOT,
    headers: {
        Accept: 'application/json',
    },
})

export default class Auth {
    static isAuthenticated() {
        return store.getState().Auth.isAuthenticated
    }

    static getToken() {
        return store.getState().Auth.authToken
    }

    static login(username = '', password = '') {
        return new Promise((resolve, reject) => {
            api.setHeader('Content-Type', 'application/json')
            if ('Authorization' in api.headers) {
                delete api.headers['Authorization']
            }
            api.post('/useraccount/login/', {
                username: username,
                password: password,
            }).then((response) => {
                if (response.problem === 'NETWORK_ERROR') {
                    reject({
                        non_field_errors: [
                            'There is some problem while logging in, Try again later',
                        ],
                    })
                }
                if (response.ok) {
                    resolve(response)
                }
                reject(response.data)
            })
        })
    }

    static logout() {
        return new Promise((resolve, reject) => {
            api.setHeader('Content-Type', 'application/json')
            api.setHeader(
                'Authorization',
                `Token ${store.getState().Auth.authToken}`
            )
            api.post('/useraccount/logout/').then((response) => {
                if (response.ok) {
                    store.dispatch(authActions.deauthenticateUser())
                    removeLocalState()
                    resolve(true)
                }
                resolve(false)
            })
        })
    }

    static isTokenNotExpired() {
        const auth = store.getState().Auth
        if (auth.expiresIn !== '') {
            if (new Date(auth.expiresIn) < new Date()) {
                store.dispatch(authActions.deauthenticateUser())
                removeLocalState()
                return false
            }
        } else {
            store.dispatch(authActions.deauthenticateUser())
            removeLocalState()
            return false
        }
        return true
    }
}
