const api = {}
const serverUrl = process.env.REACT_APP_SERVER_URL

const postRequestOptions = function (body) {
    return {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    }
};
const getRequest = function () {
    return {
        method: 'GET'
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


api.getAllUsers = async function () {
    const requestOptions = getRequest()
    const response = await fetch(`${serverUrl}/getAllUsers`, requestOptions)
    return await response.json()
}

api.getAllSessions = async function () {
    const requestOptions = getRequest()
    const response = await fetch(`${serverUrl}/sessions/getAllSessions`, requestOptions)
    return await response.json()
}

api.addSession = async function (body) {
    const requestOptions = postRequestOptions(body)
    const response = await fetch(`${serverUrl}/sessions/addSession`, requestOptions)
    return await response.json()
}

api.deleteSession = async function (body) {
    const requestOptions = postRequestOptions(body)
    const response = await fetch(`${serverUrl}/sessions/deleteSession`, requestOptions)
    return await response.json()
}

api.getSession = async function (body) {
    const requestOptions = postRequestOptions(body)
    const response = await fetch(`${serverUrl}/sessions/getSession`, requestOptions)
    return await response.json()
}

api.updateSession = async function (body) {
    const requestOptions = postRequestOptions(body)
    const response = await fetch(`${serverUrl}/sessions/updateSession`, requestOptions)
    return await response.json()
}

export default api