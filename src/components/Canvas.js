import {useRef, useEffect} from "react";
import {videoWidth, videoHeight} from "../util/envVars";
import colorMap from "../util/colorMap";

export default function Canvas({positions, clearDrawing, setClearDrawing}) {
    const canvasRef = useRef(null)
    const POSE_PAIRS = [['nose', 'leftEye'], ['nose', 'rightEye'], ['leftEye', 'leftEar'],
        ['rightEye','rightEar'], ['leftShoulder','rightShoulder'], ['leftShoulder','leftElbow'],
        ['rightShoulder', 'rightElbow'], ['leftElbow', 'leftWrist'], ['rightElbow', 'rightWrist'],
        ['leftHip', 'leftShoulder'], ['rightHip', 'leftHip'], ['rightHip','rightShoulder'],
        ['leftHip', 'leftKnee'], ['rightHip', 'rightKnee'],['leftKnee', 'leftAnkle'], ['rightKnee', 'rightAnkle']]

    useEffect(() => {
        if(clearDrawing) {
            setTimeout(() => {
                const canvas = canvasRef.current
                const ctx = canvas.getContext('2d')
                ctx.clearRect(0,0, canvas.width, canvas.height)
                setClearDrawing(false)
            }, 3000)
        }
    }, [clearDrawing])

    function drawCircles(ctx) {
        return new Promise((resolve) => {
            for(const pos of positions) {
                ctx.beginPath();
                ctx.fillStyle = colorMap[pos.part]
                ctx.arc(pos.x, pos.y, 3, 0, 2 * Math.PI);
                ctx.fill();
            }
            resolve()
        })
    }

    function drawLines(ctx) {
        return new Promise((resolve) => {
            for(const pair of POSE_PAIRS) {
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
            }
            resolve()
        })
    }

    async function draw() {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0,0, canvas.width, canvas.height)
        await drawLines(ctx)
        await drawCircles(ctx)
    }

    useEffect( () => {
        draw(positions)
    }, [positions])

    return (
        <canvas width={`${videoWidth}px`} height={`${videoHeight}px`} ref={canvasRef} style={{zIndex:5, position: "absolute", left:0, top:0}}/>
    )
}