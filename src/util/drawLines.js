const POSE_PAIRS = [['nose', 'leftEye'], ['nose', 'rightEye'], ['leftEye', 'leftEar'],
    ['rightEye','rightEar'], ['leftShoulder','rightShoulder'], ['leftShoulder','leftElbow'],
    ['rightShoulder', 'rightElbow'], ['leftElbow', 'leftWrist'], ['rightElbow', 'rightWrist'],
    ['leftHip', 'leftShoulder'], ['rightHip', 'leftHip'], ['rightHip','rightShoulder'],
    ['leftHip', 'leftKnee'], ['rightHip', 'rightKnee'],['leftKnee', 'leftAnkle'], ['rightKnee', 'rightAnkle']]

export default function drawLines(ctx, positions){
    POSE_PAIRS.forEach((pair) => {
        const from = pair[0]
        const to = pair[1]
        const fromPoint = positions.find((pos) => pos.part === from)
        const toPoint = positions.find((pos) => pos.part === to)
        if(fromPoint && toPoint) {
            ctx.strokeStyle = "rgb(26,255,255)";
            ctx.lineWidth = 4
            ctx.beginPath()
            ctx.moveTo(fromPoint.x, fromPoint.y)
            ctx.lineTo(toPoint.x, toPoint.y)
            ctx.stroke()
        }
    })
}