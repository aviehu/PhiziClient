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
api.getTrainingPoses = async function (body) {
    return [{
        "keypoints": [
            {
                "x": 84.7504585981369,
                "y": 59.521115362644196,
                "z": -0.537134051322937,
                "score": 0.9995517730712891,
                "name": "nose"
            },
            {
                "x": 89.06324952840805,
                "y": 59.278525590896606,
                "z": -0.582205057144165,
                "score": 0.9993128776550293,
                "name": "left_eye_inner"
            },
            {
                "x": 89.40041065216064,
                "y": 59.50618642568588,
                "z": -0.5827436447143555,
                "score": 0.9992888569831848,
                "name": "left_eye"
            },
            {
                "x": 89.68060463666916,
                "y": 59.74342781305313,
                "z": -0.5827631950378418,
                "score": 0.9992865920066833,
                "name": "left_eye_outer"
            },
            {
                "x": 89.15721625089645,
                "y": 59.27668583393097,
                "z": -0.5329558849334717,
                "score": 0.9992162585258484,
                "name": "right_eye_inner"
            },
            {
                "x": 89.54770863056183,
                "y": 59.466613471508026,
                "z": -0.5326837301254272,
                "score": 0.9991261959075928,
                "name": "right_eye"
            },
            {
                "x": 89.88326787948608,
                "y": 59.66197311878204,
                "z": -0.5326768755912781,
                "score": 0.9992380738258362,
                "name": "right_eye_outer"
            },
            {
                "x": 91.88617765903473,
                "y": 65.17371046543121,
                "z": -0.6641456484794617,
                "score": 0.9995508790016174,
                "name": "left_ear"
            },
            {
                "x": 92.05709397792816,
                "y": 64.25505363941193,
                "z": -0.43048906326293945,
                "score": 0.9994155168533325,
                "name": "right_ear"
            },
            {
                "x": 83.84951949119568,
                "y": 62.860859632492065,
                "z": -0.5597280859947205,
                "score": 0.9996063709259033,
                "name": "mouth_left"
            },
            {
                "x": 83.87818187475204,
                "y": 62.94335055351257,
                "z": -0.492173969745636,
                "score": 0.9994274377822876,
                "name": "mouth_right"
            },
            {
                "x": 91.3526862859726,
                "y": 79.60217535495758,
                "z": -0.6520742774009705,
                "score": 0.9999882578849792,
                "name": "left_shoulder"
            },
            {
                "x": 88.2401168346405,
                "y": 86.66335165500641,
                "z": -0.2852775454521179,
                "score": 0.9999731779098511,
                "name": "right_shoulder"
            },
            {
                "x": 109.0884804725647,
                "y": 41.23004800081253,
                "z": -0.7416531443595886,
                "score": 0.9893573522567749,
                "name": "left_elbow"
            },
            {
                "x": 98.58778864145279,
                "y": 53.811404168605804,
                "z": -0.21060822904109955,
                "score": 0.01902054063975811,
                "name": "right_elbow"
            },
            {
                "x": 133.02133977413177,
                "y": 23.39480769634247,
                "z": -0.8155562877655029,
                "score": 0.875198245048523,
                "name": "left_wrist"
            },
            {
                "x": 117.38316714763641,
                "y": 38.53537851572037,
                "z": -0.2500018775463104,
                "score": 0.025610771030187607,
                "name": "right_wrist"
            },
            {
                "x": 138.21884989738464,
                "y": 20.466354548931122,
                "z": -0.871571958065033,
                "score": 0.752742350101471,
                "name": "left_pinky"
            },
            {
                "x": 126.86118483543396,
                "y": 32.71669989824295,
                "z": -0.2342393845319748,
                "score": 0.03858722001314163,
                "name": "right_pinky"
            },
            {
                "x": 139.60880041122437,
                "y": 22.38788616657257,
                "z": -0.8624624013900757,
                "score": 0.7202643156051636,
                "name": "left_index"
            },
            {
                "x": 125.87371468544006,
                "y": 34.62557137012482,
                "z": -0.2759322226047516,
                "score": 0.03660914674401283,
                "name": "right_index"
            },
            {
                "x": 137.9730850458145,
                "y": 24.04013881087303,
                "z": -0.8117557764053345,
                "score": 0.6538975238800049,
                "name": "left_thumb"
            },
            {
                "x": 122.52025306224823,
                "y": 37.24594157934189,
                "z": -0.26547878980636597,
                "score": 0.03777432441711426,
                "name": "right_thumb"
            },
            {
                "x": 131.35744631290436,
                "y": 111.77139484882355,
                "z": -0.12752528488636017,
                "score": 0.9999006986618042,
                "name": "left_hip"
            },
            {
                "x": 131.37684762477875,
                "y": 125.51035809516907,
                "z": 0.12635500729084015,
                "score": 0.9999948740005493,
                "name": "right_hip"
            },
            {
                "x": 165.55532813072205,
                "y": 71.12538242340088,
                "z": -0.16241252422332764,
                "score": 0.995071530342102,
                "name": "left_knee"
            },
            {
                "x": 134.70779359340668,
                "y": 178.10797715187073,
                "z": 0.20764175057411194,
                "score": 0.9934723973274231,
                "name": "right_knee"
            },
            {
                "x": 140.22623002529144,
                "y": 24.56132087111473,
                "z": -0.039455026388168335,
                "score": 0.9430009126663208,
                "name": "left_ankle"
            },
            {
                "x": 126.87654793262482,
                "y": 230.05296969413757,
                "z": 0.20729584991931915,
                "score": 0.9970941543579102,
                "name": "right_ankle"
            },
            {
                "x": 137.20369338989258,
                "y": 21.143046975135803,
                "z": -0.020092865452170372,
                "score": 0.9242765307426453,
                "name": "left_heel"
            },
            {
                "x": 130.9405118227005,
                "y": 236.0635211467743,
                "z": 0.20841656625270844,
                "score": 0.9894602298736572,
                "name": "right_heel"
            },
            {
                "x": 144.11649107933044,
                "y": 3.7143881879746914,
                "z": 0.017535893246531487,
                "score": 0.9126998782157898,
                "name": "left_foot_index"
            },
            {
                "x": 108.07384550571442,
                "y": 237.01286482810974,
                "z": 0.19068695604801178,
                "score": 0.9903996586799622,
                "name": "right_foot_index"
            }
        ]
    }]

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