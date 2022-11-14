import Webcam from "react-webcam";
import Canvas from "./Canvas";
import {useState, useRef} from "react";
import {Button} from "@mui/material";

export default function WebCam() {
    const [positions, setPositions] = useState({})
    const [isRunning, setIsRunning] = useState(false)
    const [runningInterval, setRunningInterval] = useState(null)
    const [clearDrawing, setClearDrawing] = useState(false)

    async function startDrawing(getScreenshot) {
        setIsRunning(true)
        const interval = setInterval(async () => {
            const imageSrc = getScreenshot({width: 1920, height: 1080});
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({image: imageSrc})
            };
            const response = await fetch(`http://localhost:3001/image`, requestOptions)
            const ans = JSON.parse(await response.json())
            setPositions(ans)
        }, 750)
        setRunningInterval(interval)
    }

    function stopDrawing() {
        setIsRunning(false)
        setClearDrawing(true)
        clearInterval(runningInterval)
        setRunningInterval(null)
    }

    return (
        <div style={{position:"relative"}}>
            <Webcam style={{zIndex:0, width:"640px", height:"480px", position:"absolute", left:0, top:0}} screenshotQuality={0.4} mirrored={true} videoConstraints={{facingMode: "user", width: 640, height: 480,}} screenshotFormat="image/jpeg">
                {({ getScreenshot }) => (
                    <button disabled={isRunning} style={{position:"absolute", zIndex:10}} onClick={() => startDrawing(getScreenshot)}>
                        Capture photo
                    </button>
                )}
            </Webcam>
            <Canvas positions={positions} clearDrawing={clearDrawing} setClearDrawing={setClearDrawing}></Canvas>
            <Button style={{position: "absolute", right:0, top: 0}} color="primary" onClick={stopDrawing}>Stop</Button>
        </div>
    )
}