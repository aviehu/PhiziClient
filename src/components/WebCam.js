import Webcam from "react-webcam";
import Canvas from "./Canvas";
import {useRef, useState, useCallback, useEffect} from "react";
import {Button} from "@mui/material";
import {screenshotQuality, videoWidth, videoHeight, sampleInterval, scoreThreshold } from '../util/envVars'
import * as tf from "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";

export default function WebCam() {
    const [positions, setPositions] = useState([])
    const [isRunning, setIsRunning] = useState(false)
    const [runningInterval, setRunningInterval] = useState(null)
    const [clearDrawing, setClearDrawing] = useState(false)
    const [posenetModel, setPoseNetModel] = useState(null)

    const webcamRef = useRef(null)

    const capture = useCallback(
        () => {
            webcamRef.current.video.width = videoWidth;
            webcamRef.current.video.height = videoHeight;
            return webcamRef.current.video;
        },
        [webcamRef]
    );

    async function load() {
        if(!posenetModel) {
            const posenet_model = await posenet.load({
                inputResolution: { width: videoWidth, height: videoHeight },
                scale: 0.8,
            });
            setPoseNetModel(posenet_model)
            console.log("ready")
        }
    }

    useEffect(() => {
        load()
    }, [])

    async function startDrawing() {
        setIsRunning(true)
        const interval = setInterval(async () => {
            const video = capture();
            const allPositions = await posenetModel.estimateSinglePose(video);
            const positions = allPositions.keypoints.filter((pos) => pos.score > scoreThreshold)
            const ans = positions.map((pos) => {
                return {
                    part: pos.part,
                    x: videoWidth - pos.position.x,
                    y: pos.position.y
                }
            })
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
            <Webcam
                ref={webcamRef}
                style={{zIndex:0, width:`${videoWidth}px`, height:`${videoHeight}px`, position:"absolute", left:0, top:0}}
                screenshotQuality={screenshotQuality}
                mirrored={true}
                videoConstraints={{facingMode: "user", width: videoWidth, height: videoHeight,}}
                screenshotFormat="image/jpeg"
            >
            </Webcam>
            <button disabled={isRunning} style={{position:"absolute", zIndex:10}} onClick={() => startDrawing()}>
                Capture photo
            </button>
            <Canvas positions={positions} clearDrawing={clearDrawing} setClearDrawing={setClearDrawing}></Canvas>
            <Button style={{position: "absolute", right:0, top: 0}} color="primary" onClick={stopDrawing}>Stop</Button>
        </div>
    )
}