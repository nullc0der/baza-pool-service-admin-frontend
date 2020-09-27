import { jsonAPI, formAPI } from 'api/base'

export const fetchTokens = () => {
    return jsonAPI(api => api.get('/tokendb/'))
}

export const createToken = data => {
    return formAPI(api => api.post('/tokendb/', data))
}

export const updateToken = (id, data) => {
    return formAPI(api => api.patch(`/tokendb/${id}/`, data))
}
