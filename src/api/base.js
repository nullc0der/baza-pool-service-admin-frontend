import { create } from 'apisauce'
import Auth from 'utils/authHelpers'

const api = create({
    baseURL: process.env.REACT_APP_API_ROOT,
    headers: {
        Accept: 'application/json',
    },
})

const rejectIfResponseNotOK = response => {
    return response.ok
        ? Promise.resolve(response)
        : Promise.reject(response.data)
}

export const formAPI = function (createRequestPromise) {
    if (typeof createRequestPromise !== 'function') {
        throw new Error('Callback should be a function')
    }

    const API = api

    API.setHeader('Content-Type', 'multipart/form-data')

    if (Auth.isAuthenticated()) {
        API.setHeader('Authorization', `Token ${Auth.getToken()}`)
    } else {
        if ('Authorization' in API.headers) {
            delete API.headers['Authorization']
        }
    }

    return Promise.resolve(API)
        .then(createRequestPromise)
        .then(response => {
            return rejectIfResponseNotOK(response)
        })
}

export const jsonAPI = function (createRequestPromise) {
    if (typeof createRequestPromise !== 'function') {
        throw new Error('Callback should be a function')
    }

    const API = api

    API.setHeader('Content-Type', 'application/json')

    if (Auth.isAuthenticated()) {
        API.setHeader('Authorization', `Token ${Auth.getToken()}`)
    } else {
        if ('Authorization' in API.headers) {
            delete API.headers['Authorization']
        }
    }

    return Promise.resolve(API)
        .then(createRequestPromise)
        .then(response => {
            return rejectIfResponseNotOK(response)
        })
}

export const DispatchAPI = (dispatchFn, promiseFn, options = {}) => {
    if (typeof options.success !== 'function') {
        throw new Error(`DispatchAPI: 'options.success' should be a function`)
    }

    if (typeof options.failure !== 'function') {
        throw new Error(`DispatchAPI: 'options.failure' should be a function`)
    }

    // Hold the final promise here
    var promise

    // If promise function is an array
    // treat the first item as function, and rest it's args
    if (Array.isArray(promiseFn)) {
        let [fn, ...args] = promiseFn
        promise = fn(...args)
    } else if (typeof promiseFn.then === 'function') {
        // If promise function is an executed promise
        // use it directly
        promise = promiseFn
    } else if (typeof promiseFn === 'function') {
        // If promiseFn is a function, execute it
        promise = promiseFn()
    } else {
        // If nothing matches, throw error
        throw new Error(`'api' argument to 'DispatchAPI' is invalid`)
    }

    return promise
        .then(response => {
            dispatchFn(options.success(response))
            return Promise.resolve(response)
        })
        .catch(err => {
            dispatchFn(options.failure(err))
            return Promise.reject(err)
        })
}

export default api
