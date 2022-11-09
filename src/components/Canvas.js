import {useRef, useEffect} from "react";

export default function Canvas({positions}) {
    const canvasRef = useRef(null)
    const POSE_PAIRS = [ ["Neck", "RShoulder"], ["Neck", "LShoulder"], ["RShoulder", "RElbow"],
        ["RElbow", "RWrist"], ["LShoulder", "LElbow"], ["LElbow", "LWrist"],
        ["Neck", "RHip"], ["RHip", "RKnee"], ["RKnee", "RAnkle"], ["Neck", "LHip"],
        ["LHip", "LKnee"], ["LKnee", "LAnkle"], ["Neck", "Nose"], ["Nose", "REye"],
        ["REye", "REar"], ["Nose", "LEye"], ["LEye", "LEar"] ]
    const widthMult = 640 / 1920
    const heightMult = 480 / 1080

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0,0, canvas.width, canvas.height)
        for(const [key, value] of Object.entries(positions)) {
            if(positions[key]) {
                ctx.beginPath();
                ctx.arc(value[0] * widthMult, value[1] * heightMult, 5, 0, 2 * Math.PI);
                ctx.stroke();
            }
        }
        for(const pair of POSE_PAIRS) {
            const from = pair[0]
            const to = pair[1]
            const fromPoint = positions[from]
            const toPoint = positions[to]
            if(fromPoint && toPoint) {
                console.log(pair)
                ctx.beginPath()
                ctx.moveTo(fromPoint[0] * widthMult, fromPoint[1] * heightMult)
                ctx.lineTo(toPoint[0] * widthMult, toPoint[1] * heightMult)
                ctx.stroke()
            }
        }
    }, [positions])

    return (
        <canvas width={640} height={480} ref={canvasRef} style={{zIndex:5, position: "absolute", left:0, top:0}}/>
    )
}