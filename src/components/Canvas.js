import {useRef, useEffect} from "react";
import {screenshotWidth, screenshotHeight, videoWidth, videoHeight} from "../util/envVars";

export default function Canvas({positions, clearDrawing, setClearDrawing}) {
    const canvasRef = useRef(null)
    const POSE_PAIRS = [ ["Neck", "RShoulder"], ["Neck", "LShoulder"], ["RShoulder", "RElbow"],
        ["RElbow", "RWrist"], ["LShoulder", "LElbow"], ["LElbow", "LWrist"],
        ["Neck", "RHip"], ["RHip", "RKnee"], ["RKnee", "RAnkle"], ["Neck", "LHip"],
        ["LHip", "LKnee"], ["LKnee", "LAnkle"], ["Neck", "Nose"], ["Nose", "REye"],
        ["REye", "REar"], ["Nose", "LEye"], ["LEye", "LEar"] ]

    const widthMult = videoWidth / screenshotWidth
    const heightMult = videoHeight / screenshotHeight

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

    function drawCircles(ctx, positions) {
        return new Promise((resolve) => {
            for(const [key, value] of Object.entries(positions)) {
                if(positions[key]) {
                    ctx.fillStyle = key === "LElbow" || key === "LShoulder" ? "blue" : key === "RElbow" || key === "RShoulder" ? "yellow" : "red";
                    ctx.beginPath();
                    ctx.arc(value[0] * widthMult, value[1] * heightMult, 3, 0, 2 * Math.PI);
                    ctx.fill();
                }
            }
            resolve()
        })
    }

    function drawLines(ctx, positions) {
        return new Promise((resolve) => {
            for(const pair of POSE_PAIRS) {
                const from = pair[0]
                const to = pair[1]
                const fromPoint = positions[from]
                const toPoint = positions[to]
                if(fromPoint && toPoint) {
                    ctx.strokeStyle = "blue";
                    ctx.beginPath()
                    ctx.moveTo(fromPoint[0] * widthMult, fromPoint[1] * heightMult)
                    ctx.lineTo(toPoint[0] * widthMult, toPoint[1] * heightMult)
                    ctx.stroke()
                }
            }
            resolve()
        })
    }

    async function draw(positions) {
        const currPos = {...positions}
        if(currPos["LShoulder"] && currPos["RShoulder"] && currPos["LShoulder"][0] < currPos["RShoulder"][0]) {
            const temp = currPos["LShoulder"]
            currPos["LShoulder"] = currPos["RShoulder"]
            currPos["RShoulder"] = temp
        }
        if(currPos["LElbow"] && currPos["RElbow"] && currPos["LElbow"][0] < currPos["RElbow"][0]) {
            const temp = currPos["LElbow"]
            currPos["LElbow"] = currPos["RElbow"]
            currPos["RElbow"] = temp
        }
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0,0, canvas.width, canvas.height)
        await drawCircles(ctx, currPos)
        await drawLines(ctx, currPos)
    }

    useEffect( () => {
        draw(positions)
    }, [positions])

    return (
        <canvas width={`${videoWidth}px`} height={`${videoHeight}px`} ref={canvasRef} style={{zIndex:5, position: "absolute", left:0, top:0}}/>
    )
}