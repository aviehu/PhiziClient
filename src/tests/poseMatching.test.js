import isMatching from "../poseMatching/poseMatching";
import { dist, calculateAngle, findAngle, findCoord, calcAngles, calcLengths } from '../util/calc'
import get3DPositions from "../util/get3DPositions";

const wantedPose = {
    "keypoints3D": [
        {
            "x": -0.4248042404651642,
            "y": -0.39662590622901917,
            "z": -0.27734375,
            "score": 0.9995694756507874,
            "name": "nose"
        },
        {
            "x": -0.38950103521347046,
            "y": -0.4076928496360779,
            "z": -0.30517578125,
            "score": 0.9993333220481873,
            "name": "left_eye_inner"
        },
        {
            "x": -0.3894890546798706,
            "y": -0.4084051847457886,
            "z": -0.3037109375,
            "score": 0.9992985725402832,
            "name": "left_eye"
        },
        {
            "x": -0.3898083567619324,
            "y": -0.4080771803855896,
            "z": -0.303955078125,
            "score": 0.9993040561676025,
            "name": "left_eye_outer"
        },
        {
            "x": -0.3891444802284241,
            "y": -0.41085928678512573,
            "z": -0.277099609375,
            "score": 0.9992533326148987,
            "name": "right_eye_inner"
        },
        {
            "x": -0.38940921425819397,
            "y": -0.4112873375415802,
            "z": -0.278564453125,
            "score": 0.9991704225540161,
            "name": "right_eye"
        },
        {
            "x": -0.39054402709007263,
            "y": -0.41222161054611206,
            "z": -0.27685546875,
            "score": 0.9992591738700867,
            "name": "right_eye_outer"
        },
        {
            "x": -0.31086474657058716,
            "y": -0.3456714153289795,
            "z": -0.347900390625,
            "score": 0.9995694756507874,
            "name": "left_ear"
        },
        {
            "x": -0.3168601095676422,
            "y": -0.35736310482025146,
            "z": -0.2227783203125,
            "score": 0.9994600415229797,
            "name": "right_ear"
        },
        {
            "x": -0.40817990899086,
            "y": -0.3605020344257355,
            "z": -0.290771484375,
            "score": 0.9996498823165894,
            "name": "mouth_left"
        },
        {
            "x": -0.4102659523487091,
            "y": -0.36395925283432007,
            "z": -0.252685546875,
            "score": 0.999514102935791,
            "name": "mouth_right"
        },
        {
            "x": 0,
            "y": 1,
            "z": 0,
            "score": 0.9999904632568359,
            "name": "left_shoulder"
        },
        {
            "x": 0,
            "y": 1,
            "z": 0,
            "score": 0.9999798536300659,
            "name": "right_shoulder"
        },
        {
            "x": 0,
            "y": 0,
            "z": 0,
            "score": 0.9881765246391296,
            "name": "left_elbow"
        },
        {
            "x": 0,
            "y": 0,
            "z": 0,
            "score": 0.9,
            "name": "right_elbow"
        },
        {
            "x": 0,
            "y": 0,
            "z": 1,
            "score": 0.8682692646980286,
            "name": "left_wrist"
        },
        {
            "x": 0,
            "y": 0,
            "z": 1,
            "score": 0.026607107371091843,
            "name": "right_wrist"
        },
        {
            "x": -0.002525508403778076,
            "y": -0.6354875564575195,
            "z": -0.42919921875,
            "score": 0.7496374249458313,
            "name": "left_pinky"
        },
        {
            "x": -0.11991454660892487,
            "y": -0.570542573928833,
            "z": -0.0210113525390625,
            "score": 0.038901977241039276,
            "name": "right_pinky"
        },
        {
            "x": 0.02340090274810791,
            "y": -0.5949193239212036,
            "z": -0.428466796875,
            "score": 0.7157220840454102,
            "name": "left_index"
        },
        {
            "x": -0.10127724707126617,
            "y": -0.5455870628356934,
            "z": -0.042449951171875,
            "score": 0.03690806403756142,
            "name": "right_index"
        },
        {
            "x": -0.026991456747055054,
            "y": -0.6061526536941528,
            "z": -0.415283203125,
            "score": 0.6470180153846741,
            "name": "left_thumb"
        },
        {
            "x": -0.14560513198375702,
            "y": -0.5423997044563293,
            "z": -0.04315185546875,
            "score": 0.03810661658644676,
            "name": "right_thumb"
        },
        {
            "x": 0.014079371467232704,
            "y": -0.06499801576137543,
            "z": -0.064208984375,
            "score": 0.999913215637207,
            "name": "left_hip"
        },
        {
            "x": -0.014771588146686554,
            "y": 0.06487786769866943,
            "z": 0.0655517578125,
            "score": 0.9999953508377075,
            "name": "right_hip"
        },
        {
            "x": 0.25883325934410095,
            "y": -0.31294190883636475,
            "z": -0.09271240234375,
            "score": 0.9954791069030762,
            "name": "left_knee"
        },
        {
            "x": 0.0014933347702026367,
            "y": 0.4436882734298706,
            "z": 0.1434326171875,
            "score": 0.9943581223487854,
            "name": "right_knee"
        },
        {
            "x": 0.11115089058876038,
            "y": -0.6556663513183594,
            "z": -0.0457763671875,
            "score": 0.9537942409515381,
            "name": "left_ankle"
        },
        {
            "x": -0.010400712490081787,
            "y": 0.8164255619049072,
            "z": 0.171630859375,
            "score": 0.9976310729980469,
            "name": "right_ankle"
        },
        {
            "x": 0.0987798273563385,
            "y": -0.7024601697921753,
            "z": -0.037841796875,
            "score": 0.9370958209037781,
            "name": "left_heel"
        },
        {
            "x": -0.0177592933177948,
            "y": 0.859687089920044,
            "z": 0.169921875,
            "score": 0.9905874133110046,
            "name": "right_heel"
        },
        {
            "x": 0.0833769142627716,
            "y": -0.7692403793334961,
            "z": 0.00585174560546875,
            "score": 0.9307105541229248,
            "name": "left_foot_index"
        },
        {
            "x": -0.11112341284751892,
            "y": 0.9010004997253418,
            "z": 0.148193359375,
            "score": 0.992061972618103,
            "name": "right_foot_index"
        }
    ]
}

test('isMatching_true', () => {
    expect(isMatching(wantedPose, wantedPose)).toBe(true)
})

test('isMatchingWithinThreshold', () => {
    const userPose = {
        "keypoints3D": [
            {
                "x": -0.4248042404651642,
                "y": -0.39662590622901917,
                "z": -0.27734375,
                "score": 0.9995694756507874,
                "name": "nose"
            },
            {
                "x": -0.38950103521347046,
                "y": -0.4076928496360779,
                "z": -0.30517578125,
                "score": 0.9993333220481873,
                "name": "left_eye_inner"
            },
            {
                "x": -0.3894890546798706,
                "y": -0.4084051847457886,
                "z": -0.3037109375,
                "score": 0.9992985725402832,
                "name": "left_eye"
            },
            {
                "x": -0.3898083567619324,
                "y": -0.4080771803855896,
                "z": -0.303955078125,
                "score": 0.9993040561676025,
                "name": "left_eye_outer"
            },
            {
                "x": -0.3891444802284241,
                "y": -0.41085928678512573,
                "z": -0.277099609375,
                "score": 0.9992533326148987,
                "name": "right_eye_inner"
            },
            {
                "x": -0.38940921425819397,
                "y": -0.4112873375415802,
                "z": -0.278564453125,
                "score": 0.9991704225540161,
                "name": "right_eye"
            },
            {
                "x": -0.39054402709007263,
                "y": -0.41222161054611206,
                "z": -0.27685546875,
                "score": 0.9992591738700867,
                "name": "right_eye_outer"
            },
            {
                "x": -0.31086474657058716,
                "y": -0.3456714153289795,
                "z": -0.347900390625,
                "score": 0.9995694756507874,
                "name": "left_ear"
            },
            {
                "x": -0.3168601095676422,
                "y": -0.35736310482025146,
                "z": -0.2227783203125,
                "score": 0.9994600415229797,
                "name": "right_ear"
            },
            {
                "x": -0.40817990899086,
                "y": -0.3605020344257355,
                "z": -0.290771484375,
                "score": 0.9996498823165894,
                "name": "mouth_left"
            },
            {
                "x": -0.4102659523487091,
                "y": -0.36395925283432007,
                "z": -0.252685546875,
                "score": 0.999514102935791,
                "name": "mouth_right"
            },
            {
                "x": 1,
                "y": 5.67128,
                "z": 0,
                "score": 0.9999904632568359,
                "name": "left_shoulder"
            },
            {
                "x": 1,
                "y": 5.67128,
                "z": 0,
                "score": 0.9999798536300659,
                "name": "right_shoulder"
            },
            {
                "x": 0,
                "y": 0,
                "z": 0,
                "score": 0.9881765246391296,
                "name": "left_elbow"
            },
            {
                "x": 0,
                "y": 0,
                "z": 0,
                "score": 0.9,
                "name": "right_elbow"
            },
            {
                "x": 0,
                "y": 0,
                "z": 1,
                "score": 0.8682692646980286,
                "name": "left_wrist"
            },
            {
                "x": 0,
                "y": 0,
                "z": 1,
                "score": 0.026607107371091843,
                "name": "right_wrist"
            },
            {
                "x": -0.002525508403778076,
                "y": -0.6354875564575195,
                "z": -0.42919921875,
                "score": 0.7496374249458313,
                "name": "left_pinky"
            },
            {
                "x": -0.11991454660892487,
                "y": -0.570542573928833,
                "z": -0.0210113525390625,
                "score": 0.038901977241039276,
                "name": "right_pinky"
            },
            {
                "x": 0.02340090274810791,
                "y": -0.5949193239212036,
                "z": -0.428466796875,
                "score": 0.7157220840454102,
                "name": "left_index"
            },
            {
                "x": -0.10127724707126617,
                "y": -0.5455870628356934,
                "z": -0.042449951171875,
                "score": 0.03690806403756142,
                "name": "right_index"
            },
            {
                "x": -0.026991456747055054,
                "y": -0.6061526536941528,
                "z": -0.415283203125,
                "score": 0.6470180153846741,
                "name": "left_thumb"
            },
            {
                "x": -0.14560513198375702,
                "y": -0.5423997044563293,
                "z": -0.04315185546875,
                "score": 0.03810661658644676,
                "name": "right_thumb"
            },
            {
                "x": 0.014079371467232704,
                "y": -0.06499801576137543,
                "z": -0.064208984375,
                "score": 0.999913215637207,
                "name": "left_hip"
            },
            {
                "x": -0.014771588146686554,
                "y": 0.06487786769866943,
                "z": 0.0655517578125,
                "score": 0.9999953508377075,
                "name": "right_hip"
            },
            {
                "x": 0.25883325934410095,
                "y": -0.31294190883636475,
                "z": -0.09271240234375,
                "score": 0.9954791069030762,
                "name": "left_knee"
            },
            {
                "x": 0.0014933347702026367,
                "y": 0.4436882734298706,
                "z": 0.1434326171875,
                "score": 0.9943581223487854,
                "name": "right_knee"
            },
            {
                "x": 0.11115089058876038,
                "y": -0.6556663513183594,
                "z": -0.0457763671875,
                "score": 0.9537942409515381,
                "name": "left_ankle"
            },
            {
                "x": -0.010400712490081787,
                "y": 0.8164255619049072,
                "z": 0.171630859375,
                "score": 0.9976310729980469,
                "name": "right_ankle"
            },
            {
                "x": 0.0987798273563385,
                "y": -0.7024601697921753,
                "z": -0.037841796875,
                "score": 0.9370958209037781,
                "name": "left_heel"
            },
            {
                "x": -0.0177592933177948,
                "y": 0.859687089920044,
                "z": 0.169921875,
                "score": 0.9905874133110046,
                "name": "right_heel"
            },
            {
                "x": 0.0833769142627716,
                "y": -0.7692403793334961,
                "z": 0.00585174560546875,
                "score": 0.9307105541229248,
                "name": "left_foot_index"
            },
            {
                "x": -0.11112341284751892,
                "y": 0.9010004997253418,
                "z": 0.148193359375,
                "score": 0.992061972618103,
                "name": "right_foot_index"
            }
        ]
    }
    expect(isMatching(wantedPose, userPose)).toBe(true)
})

test('isMatchingFalse', () => {
    const userPose = {
        "keypoints3D": [
            {
                "x": -0.4248042404651642,
                "y": -0.39662590622901917,
                "z": -0.27734375,
                "score": 0.9995694756507874,
                "name": "nose"
            },
            {
                "x": -0.38950103521347046,
                "y": -0.4076928496360779,
                "z": -0.30517578125,
                "score": 0.9993333220481873,
                "name": "left_eye_inner"
            },
            {
                "x": -0.3894890546798706,
                "y": -0.4084051847457886,
                "z": -0.3037109375,
                "score": 0.9992985725402832,
                "name": "left_eye"
            },
            {
                "x": -0.3898083567619324,
                "y": -0.4080771803855896,
                "z": -0.303955078125,
                "score": 0.9993040561676025,
                "name": "left_eye_outer"
            },
            {
                "x": -0.3891444802284241,
                "y": -0.41085928678512573,
                "z": -0.277099609375,
                "score": 0.9992533326148987,
                "name": "right_eye_inner"
            },
            {
                "x": -0.38940921425819397,
                "y": -0.4112873375415802,
                "z": -0.278564453125,
                "score": 0.9991704225540161,
                "name": "right_eye"
            },
            {
                "x": -0.39054402709007263,
                "y": -0.41222161054611206,
                "z": -0.27685546875,
                "score": 0.9992591738700867,
                "name": "right_eye_outer"
            },
            {
                "x": -0.31086474657058716,
                "y": -0.3456714153289795,
                "z": -0.347900390625,
                "score": 0.9995694756507874,
                "name": "left_ear"
            },
            {
                "x": -0.3168601095676422,
                "y": -0.35736310482025146,
                "z": -0.2227783203125,
                "score": 0.9994600415229797,
                "name": "right_ear"
            },
            {
                "x": -0.40817990899086,
                "y": -0.3605020344257355,
                "z": -0.290771484375,
                "score": 0.9996498823165894,
                "name": "mouth_left"
            },
            {
                "x": -0.4102659523487091,
                "y": -0.36395925283432007,
                "z": -0.252685546875,
                "score": 0.999514102935791,
                "name": "mouth_right"
            },
            {
                "x": 3,
                "y": 3,
                "z": 3,
                "score": 0.9999904632568359,
                "name": "left_shoulder"
            },
            {
                "x": 3,
                "y": 3,
                "z": 3,
                "score": 0.9999798536300659,
                "name": "right_shoulder"
            },
            {
                "x": 2,
                "y": 2,
                "z": 2,
                "score": 0.9881765246391296,
                "name": "left_elbow"
            },
            {
                "x": 2,
                "y": 2,
                "z": 2,
                "score": 0.9,
                "name": "right_elbow"
            },
            {
                "x": 1,
                "y": 1,
                "z": 1,
                "score": 0.8682692646980286,
                "name": "left_wrist"
            },
            {
                "x": 1,
                "y": 1,
                "z": 1,
                "score": 0.026607107371091843,
                "name": "right_wrist"
            },
            {
                "x": -0.002525508403778076,
                "y": -0.6354875564575195,
                "z": -0.42919921875,
                "score": 0.7496374249458313,
                "name": "left_pinky"
            },
            {
                "x": -0.11991454660892487,
                "y": -0.570542573928833,
                "z": -0.0210113525390625,
                "score": 0.038901977241039276,
                "name": "right_pinky"
            },
            {
                "x": 0.02340090274810791,
                "y": -0.5949193239212036,
                "z": -0.428466796875,
                "score": 0.7157220840454102,
                "name": "left_index"
            },
            {
                "x": -0.10127724707126617,
                "y": -0.5455870628356934,
                "z": -0.042449951171875,
                "score": 0.03690806403756142,
                "name": "right_index"
            },
            {
                "x": -0.026991456747055054,
                "y": -0.6061526536941528,
                "z": -0.415283203125,
                "score": 0.6470180153846741,
                "name": "left_thumb"
            },
            {
                "x": -0.14560513198375702,
                "y": -0.5423997044563293,
                "z": -0.04315185546875,
                "score": 0.03810661658644676,
                "name": "right_thumb"
            },
            {
                "x": 0.014079371467232704,
                "y": -0.06499801576137543,
                "z": -0.064208984375,
                "score": 0.999913215637207,
                "name": "left_hip"
            },
            {
                "x": -0.014771588146686554,
                "y": 0.06487786769866943,
                "z": 0.0655517578125,
                "score": 0.9999953508377075,
                "name": "right_hip"
            },
            {
                "x": 0.25883325934410095,
                "y": -0.31294190883636475,
                "z": -0.09271240234375,
                "score": 0.9954791069030762,
                "name": "left_knee"
            },
            {
                "x": 0.0014933347702026367,
                "y": 0.4436882734298706,
                "z": 0.1434326171875,
                "score": 0.9943581223487854,
                "name": "right_knee"
            },
            {
                "x": 0.11115089058876038,
                "y": -0.6556663513183594,
                "z": -0.0457763671875,
                "score": 0.9537942409515381,
                "name": "left_ankle"
            },
            {
                "x": -0.010400712490081787,
                "y": 0.8164255619049072,
                "z": 0.171630859375,
                "score": 0.9976310729980469,
                "name": "right_ankle"
            },
            {
                "x": 0.0987798273563385,
                "y": -0.7024601697921753,
                "z": -0.037841796875,
                "score": 0.9370958209037781,
                "name": "left_heel"
            },
            {
                "x": -0.0177592933177948,
                "y": 0.859687089920044,
                "z": 0.169921875,
                "score": 0.9905874133110046,
                "name": "right_heel"
            },
            {
                "x": 0.0833769142627716,
                "y": -0.7692403793334961,
                "z": 0.00585174560546875,
                "score": 0.9307105541229248,
                "name": "left_foot_index"
            },
            {
                "x": -0.11112341284751892,
                "y": 0.9010004997253418,
                "z": 0.148193359375,
                "score": 0.992061972618103,
                "name": "right_foot_index"
            }
        ]
    }
    expect(isMatching(wantedPose, userPose)).toBe(false)
})

test('isMatchingFalse_userWithoutAllPoints', () => {
    const userPose = {
        "keypoints3D": [
            {
                "x": -0.4248042404651642,
                "y": -0.39662590622901917,
                "z": -0.27734375,
                "score": 0.9995694756507874,
                "name": "nose"
            },
            {
                "x": -0.38950103521347046,
                "y": -0.4076928496360779,
                "z": -0.30517578125,
                "score": 0.9993333220481873,
                "name": "left_eye_inner"
            },
            {
                "x": -0.3894890546798706,
                "y": -0.4084051847457886,
                "z": -0.3037109375,
                "score": 0.9992985725402832,
                "name": "left_eye"
            },
            {
                "x": -0.3898083567619324,
                "y": -0.4080771803855896,
                "z": -0.303955078125,
                "score": 0.9993040561676025,
                "name": "left_eye_outer"
            },
            {
                "x": -0.3891444802284241,
                "y": -0.41085928678512573,
                "z": -0.277099609375,
                "score": 0.9992533326148987,
                "name": "right_eye_inner"
            },
            {
                "x": -0.38940921425819397,
                "y": -0.4112873375415802,
                "z": -0.278564453125,
                "score": 0.9991704225540161,
                "name": "right_eye"
            },
            {
                "x": -0.39054402709007263,
                "y": -0.41222161054611206,
                "z": -0.27685546875,
                "score": 0.9992591738700867,
                "name": "right_eye_outer"
            },
            {
                "x": -0.31086474657058716,
                "y": -0.3456714153289795,
                "z": -0.347900390625,
                "score": 0.9995694756507874,
                "name": "left_ear"
            },
            {
                "x": -0.3168601095676422,
                "y": -0.35736310482025146,
                "z": -0.2227783203125,
                "score": 0.9994600415229797,
                "name": "right_ear"
            },
            {
                "x": -0.40817990899086,
                "y": -0.3605020344257355,
                "z": -0.290771484375,
                "score": 0.9996498823165894,
                "name": "mouth_left"
            },
            {
                "x": -0.4102659523487091,
                "y": -0.36395925283432007,
                "z": -0.252685546875,
                "score": 0.999514102935791,
                "name": "mouth_right"
            },
            {
                "x": 1,
                "y": 5.67128,
                "z": 0,
                "score": 0.9999904632568359,
                "name": "left_shoulder"
            },
            {
                "x": 1,
                "y": 5.67128,
                "z": 0,
                "score": 0.9999798536300659,
                "name": "right_shoulder"
            },
            {
                "x": 0,
                "y": 0,
                "z": 0,
                "score": 0.9881765246391296,
                "name": "left_elbow"
            },
            {
                "x": 0,
                "y": 0,
                "z": 0,
                "score": 0.9,
                "name": "right_elbow"
            },
            {
                "x": 0,
                "y": 0,
                "z": 1,
                "score": 0.8682692646980286,
                "name": "left_wrist"
            },
            {
                "x": 0,
                "y": 0,
                "z": 1,
                "score": 0.026607107371091843,
                "name": "right_wrist"
            },
            {
                "x": -0.002525508403778076,
                "y": -0.6354875564575195,
                "z": -0.42919921875,
                "score": 0.7496374249458313,
                "name": "left_pinky"
            },
            {
                "x": -0.11991454660892487,
                "y": -0.570542573928833,
                "z": -0.0210113525390625,
                "score": 0.038901977241039276,
                "name": "right_pinky"
            },
            {
                "x": 0.02340090274810791,
                "y": -0.5949193239212036,
                "z": -0.428466796875,
                "score": 0.7157220840454102,
                "name": "left_index"
            },
            {
                "x": -0.10127724707126617,
                "y": -0.5455870628356934,
                "z": -0.042449951171875,
                "score": 0.03690806403756142,
                "name": "right_index"
            },
            {
                "x": -0.026991456747055054,
                "y": -0.6061526536941528,
                "z": -0.415283203125,
                "score": 0.6470180153846741,
                "name": "left_thumb"
            },
            {
                "x": -0.14560513198375702,
                "y": -0.5423997044563293,
                "z": -0.04315185546875,
                "score": 0.03810661658644676,
                "name": "right_thumb"
            },
            {
                "x": 0.014079371467232704,
                "y": -0.06499801576137543,
                "z": -0.064208984375,
                "score": 0.999913215637207,
                "name": "left_hip"
            },
            {
                "x": -0.014771588146686554,
                "y": 0.06487786769866943,
                "z": 0.0655517578125,
                "score": 0.9999953508377075,
                "name": "right_hip"
            },
            {
                "x": 0.0014933347702026367,
                "y": 0.4436882734298706,
                "z": 0.1434326171875,
                "score": 0.9943581223487854,
                "name": "right_knee"
            },
            {
                "x": 0.11115089058876038,
                "y": -0.6556663513183594,
                "z": -0.0457763671875,
                "score": 0.9537942409515381,
                "name": "left_ankle"
            },
            {
                "x": -0.010400712490081787,
                "y": 0.8164255619049072,
                "z": 0.171630859375,
                "score": 0.9976310729980469,
                "name": "right_ankle"
            },
            {
                "x": 0.0987798273563385,
                "y": -0.7024601697921753,
                "z": -0.037841796875,
                "score": 0.9370958209037781,
                "name": "left_heel"
            },
            {
                "x": -0.0177592933177948,
                "y": 0.859687089920044,
                "z": 0.169921875,
                "score": 0.9905874133110046,
                "name": "right_heel"
            },
            {
                "x": 0.0833769142627716,
                "y": -0.7692403793334961,
                "z": 0.00585174560546875,
                "score": 0.9307105541229248,
                "name": "left_foot_index"
            },
            {
                "x": -0.11112341284751892,
                "y": 0.9010004997253418,
                "z": 0.148193359375,
                "score": 0.992061972618103,
                "name": "right_foot_index"
            }
        ]
    }
    expect(isMatching(wantedPose, userPose)).toBe(false)
})