const api = {}
const serverUrl = process.env.REACT_APP_SERVER_URL

const postRequestOptions = function (body) {
    return {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    }
};

api.login = async function (body) {
    const requestOptions = postRequestOptions(body)
    const response = await fetch(`${serverUrl}/login`, requestOptions)
    return await response.json()
}

api.register = async function (body) {
    const requestOptions = postRequestOptions(body)
    const response = await fetch(`${serverUrl}/register`, requestOptions)
    return await response.json()
}

api.sendPose = async function (body) {
    const requestOptions = postRequestOptions(body)
    const response = await fetch(`${serverUrl}/pose`, requestOptions)
    return await response.json()
}

export default api