import { jsonAPI } from 'api/base'

export const fetchSessions = () => {
    return jsonAPI(api => api.get('/votingsession/'))
}

export const updateSession = (id, data) => {
    return jsonAPI(api => api.patch(`/votingsession/${id}/`, data))
}
