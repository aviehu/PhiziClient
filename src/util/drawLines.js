export const POSE_PAIRS = [
    ["nose", "left_eye_inner"], ["nose","right_eye_inner"], ["left_eye_inner","left_eye"],
    ["left_eye","left_eye_outer"], ["left_eye_outer","left_ear"], ["right_eye_inner","right_eye"],
    ["right_eye","right_eye_outer"], ["right_eye_outer", "right_ear"], ["mouth_left", "mouth_right"],
    ["left_shoulder" ,"right_shoulder"], ["right_shoulder" ,"right_elbow"], ["right_elbow","right_wrist"],
    ["right_wrist","right_index"], ["right_wrist","right_pinky"], ["right_wrist","right_thumb"],
    ["right_pinky","right_index"], ["right_shoulder","right_hip"], ["right_hip","right_knee"],
    ["right_knee","right_ankle"], ["right_ankle","right_foot_index"], ["right_ankle","right_heel"],
    ["right_heel" ,"right_foot_index"], ["right_hip","left_hip"], ["left_shoulder","left_elbow"],
    ["left_elbow","left_wrist"], ["left_wrist","left_thumb"], ["left_wrist","left_pinky"],
    ["left_wrist","left_index"], ["left_index","left_pinky"], ["left_shoulder","left_hip"],
    ["left_hip","left_knee"], ["left_knee","left_ankle"], ["left_ankle","left_heel"],
    ["left_ankle","left_foot_index"], ["left_heel", "left_foot_index"]
]

export const LENGTH_PAIRS = [
    ["left_shoulder", "right_shoulder"], ["right_shoulder", "right_elbow"], ["right_elbow", "right_wrist"],
    ["right_knee", "right_ankle"], ["right_hip", "left_hip"], ["right_hip", "right_knee"],
    ["left_shoulder", "left_elbow"], ["left_elbow", "left_wrist"], ["left_shoulder", "left_hip"],
    ["left_hip", "left_knee"], ["left_knee", "left_ankle"], ["right_shoulder", "right_hip"]
]

export default function drawLines(ctx, positions){
    POSE_PAIRS.forEach((pair) => {
        const from = pair[0]
        const to = pair[1]
        const fromPoint = positions.find((pos) => pos.part === from)
        const toPoint = positions.find((pos) => pos.part === to)
        if(fromPoint && toPoint) {
            ctx.strokeStyle = "rgb(26,255,255)";
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo(fromPoint.x, fromPoint.y)
            ctx.lineTo(toPoint.x, toPoint.y)
            ctx.stroke()
        }
    })
};
