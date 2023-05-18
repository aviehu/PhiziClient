const api = {}
const serverUrl = process.env.REACT_APP_SERVER_URL

const postRequestOptions = function (body) {
    return {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    }
};
const getRequestOptions = function () {
    return {
        method: 'GET'
    }
};

const deleteRequestOptions = function () {
    return {
        method: 'DELETE'
    }
};


// Users API
api.editUserGoals = async function(req){
    console.log("req",req)
    const requestOptions = postRequestOptions(req)
    const response = await fetch(`${serverUrl}/editUserGoals`, requestOptions)
    return await response.json()
}
api.login = async function (body) {
    const requestOptions = postRequestOptions(body)
    const response = await fetch(`${serverUrl}/users/login`, requestOptions)
    return await response.json()
}

api.register = async function (body) {
    const requestOptions = postRequestOptions(body)
    const response = await fetch(`${serverUrl}/users/register`, requestOptions)
    return await response.json()
}

api.getAllUsers = async function () {
    const requestOptions = getRequestOptions()
    const response = await fetch(`${serverUrl}/users/getAllUsers`, requestOptions)
    return await response.json()
}

api.getUser = async function (email) {
    const requestOptions = getRequestOptions()
    const response = await fetch(`${serverUrl}/users/getUser/${email}`, requestOptions)
    return await response.json()
}

api.updateUser = async function (body) {
    const requestOptions = postRequestOptions(body)
    const response = await fetch(`${serverUrl}/users/updateUser`, requestOptions)
    return await response.json()
}


// Sessions API

api.getAllSessions = async function () {
    const requestOptions = getRequestOptions()
    const response = await fetch(`${serverUrl}/sessions/getAllSessions`, requestOptions)
    return await response.json()
}

api.addSession = async function (body) {
    const requestOptions = postRequestOptions(body)
    const response = await fetch(`${serverUrl}/sessions/addSession`, requestOptions)
    return await response.json()
}

api.deleteSession = async function (id) {
    const requestOptions = deleteRequestOptions()
    const response = await fetch(`${serverUrl}/sessions/deleteSession/${id}`, requestOptions)
    return await response.json()
}

api.getSession = async function (name) {
    const requestOptions = getRequestOptions()
    const response = await fetch(`${serverUrl}/sessions/getSession/${name}`, requestOptions)
    return await response.json()
}

api.updateSession = async function (body) {
    const requestOptions = postRequestOptions(body)
    const response = await fetch(`${serverUrl}/sessions/updateSession/${body.name}`, requestOptions)
    return await response.json()
}

api.getSessionForUser = async function (goals) {
    const requestOptions = postRequestOptions({goals})
    const response = await fetch(`${serverUrl}/sessions/getSessionForUser`, requestOptions)
    return await response.json()
}


// Poses API

api.getAllPoses = async function () {
    const requestOptions = getRequestOptions()
    const response = await fetch(`${serverUrl}/poses/getAllPoses`, requestOptions)
    return await response.json()
}

api.addPose = async function (body) {
    const requestOptions = postRequestOptions(body)
    const response = await fetch(`${serverUrl}/poses/addPose`, requestOptions)
    return await response.json()
}

api.deletePose = async function (id) {
    const requestOptions = deleteRequestOptions()
    const response = await fetch(`${serverUrl}/poses/deletePose/${id}`, requestOptions)
    return await response.json()
}

api.getPose = async function (body) {
    const requestOptions = postRequestOptions(body)
    const response = await fetch(`${serverUrl}/poses/getPose`, requestOptions)
    return await response.json()
}

api.updatePose = async function (body) {
    const requestOptions = postRequestOptions(body)
    const response = await fetch(`${serverUrl}/poses/updatePose`, requestOptions)
    return await response.json()
}

api.getPosesByGoals = async function (body) {
    const requestOptions = postRequestOptions(body)
    const response = await fetch(`${serverUrl}/poses/getPosesByGoals`, requestOptions)
    return await response.json()
}

export default api