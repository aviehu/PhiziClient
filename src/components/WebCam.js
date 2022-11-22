import Webcam from "react-webcam";
import Canvas from "./Canvas";
import {useEffect, useState} from "react";
import {Button} from "@mui/material";
import { screenshotWidth, screenshotHeight, screenshotQuality, serverURL, videoWidth, videoHeight, sampleInterval } from '../util/envVars'

export default function WebCam() {
    const [positions, setPositions] = useState({})
    const [isRunning, setIsRunning] = useState(false)
    const [runningInterval, setRunningInterval] = useState(null)
    const [clearDrawing, setClearDrawing] = useState(false)

    async function startDrawing(getScreenshot) {
        setIsRunning(true)
        const interval = setInterval(async () => {
            const imageSrc = getScreenshot({width: screenshotWidth, height: screenshotHeight});
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({image: imageSrc})
            };
            const response = await fetch(`${serverURL}/image`, requestOptions)
            const ans = JSON.parse(await response.json())
            setPositions(ans)
        }, sampleInterval)
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
            <Webcam style={{zIndex:0, width:`${videoWidth}px`, height:`${videoHeight}px`, position:"absolute", left:0, top:0}} screenshotQuality={screenshotQuality} mirrored={true} videoConstraints={{facingMode: "user", width: videoWidth, height: videoHeight,}} screenshotFormat="image/jpeg">
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