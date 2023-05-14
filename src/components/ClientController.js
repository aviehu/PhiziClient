import { useContext, useEffect, useRef, useState } from "react";
import useWebsocket from "./useWebsocket";
import { sampledVideoWidth } from "../util/envVars";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as mpPose from "@mediapipe/pose";
import Webcam from "react-webcam";
import { Button } from "@mui/material";
import { calcLengths, calcAngles } from './calc'
import getCameraRatio from "../util/getCameraRatio";
import { clearCanvas, drawLines, drawCircles } from './canvas'
import get2DPositions from "../util/get2DPositions";
import get3DPositions from "../util/get3DPositions";
import { curUser } from "../LoginPage/LoginPage";
import api from "../util/api";

const detectorConfig = {
    runtime: 'mediapipe',
    modelType: 'full',
    solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/pose@${mpPose.VERSION}`
};

export default function ClientController() {
    const [isRunning, setIsRunning] = useState(false)
    const [blazePoseModel, setBlazePoseModel] = useState(null)
    const [cameraRatio, setCameraRatio] = useState(-1)
    const [fps, setFps] = useState(0)
    const [trainingPoses, setTrainingPoses] = useState(null)
    const canvasRef = useRef(null)
    const singlePoseRef = useRef(null)
    const webcamRef = useRef(null)
    const clientWebcamRef = useRef(null)
    const [msg, sendMsg] = useWebsocket()
    const user = useContext(curUser)
    console.log(user)

    async function getTrainingPoses(){
        const response = await api.getTrainingPoses()
            if (!response.error) {
                setTrainingPoses(response)
                return
            }
    }

    useEffect(() => {
        if (!webcamRef.current || cameraRatio < 0) {
            return
        }
        webcamRef.current.video.width = sampledVideoWidth
        webcamRef.current.video.height = sampledVideoWidth / cameraRatio
    }, [webcamRef.current, cameraRatio])

    useEffect(() => {
        if(!trainingPoses || !singlePoseRef || !singlePoseRef.current){
            return
        }

        const ctx = singlePoseRef.current.getContext('2d')
        const pose = get2DPositions(trainingPoses[0])
        console.log(pose)
        clearCanvas(ctx, singlePoseRef.current.width, singlePoseRef.current.height)
        drawLines(ctx, pose)
        drawCircles(ctx, pose)
        
    }, [trainingPoses, singlePoseRef.current])

    useEffect(() => {
        async function load() {
            const model = poseDetection.SupportedModels.BlazePose;
            const detector = await poseDetection.createDetector(model, detectorConfig);
            setBlazePoseModel(detector)
            const cameraRatio = await getCameraRatio()
            setCameraRatio(cameraRatio)
            console.log("ready")
            
        }
        load()
    }, [])

    useEffect(() => {
        if (!isRunning || !webcamRef.current || !blazePoseModel || !canvasRef.current) {
            return
        }
        let internallIsRunning = true
        const recording = []
        const fpsInterval = setInterval(() => {
            setFps(recording.length)
            recording.length = 0
        }, 1000)

        async function draw() {
            const ctx = canvasRef.current.getContext('2d')
            if (!internallIsRunning) {
                clearCanvas(ctx, canvasRef.current.width, canvasRef.current.height)
                clearInterval(fpsInterval)
                setFps(0)
                return
            }
            const video = webcamRef.current.video;
            const estimationConfig = { flipHorizontal: false };
            const timestamp = performance.now();
            const poses = await blazePoseModel.estimatePoses(video, estimationConfig, timestamp);
            const positions = poses[0]
            if (positions) {
                const poses2D = get2DPositions(positions)
                console.log("good", poses2D)
                const poses3D = get3DPositions(positions)
                const posAngles = calcAngles(poses3D)
                const partsLengths = calcLengths(poses3D)
                // sendMsg(JSON.stringify({ pose: poses3D, posAngles, partsLengths, timestamp }))
                // recording.push(1)
                clearCanvas(ctx, canvasRef.current.width, canvasRef.current.height)
                drawLines(ctx, poses2D)
                drawCircles(ctx, poses2D)
            }
            setTimeout(draw, 0)
        }
        draw()
        setTimeout(draw, 20)
        setTimeout(draw, 80)
        return () => {
            internallIsRunning = false
        }
    }, [isRunning, webcamRef.current, blazePoseModel, canvasRef.current])

    async function startDrawing() {
        setIsRunning(true)
        getTrainingPoses()
    }

    function stopDrawing() {
        setIsRunning(false)
    }

    return (
        <div style={{position: 'absolute', backgroundColor: 'white', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Button variant={'contained'} disabled={isRunning} style={{ position: "absolute", zIndex: 10, left: 15, top: 15}} onClick={() => startDrawing()}>
                 Draw Skeleton
            </Button>
            <Button variant={'contained'} style={{ position: "absolute", zIndex: 10, right: 15, top: 15}} color="primary" onClick={stopDrawing}>Stop</Button>
            {cameraRatio > 0 ?
                <Webcam
                    ref={webcamRef}
                    style={{ zIndex: -1, position: "absolute", left: 0, top: 0 }}
                    mirrored={true}
                    videoConstraints={{ facingMode: "user", width: sampledVideoWidth, height: sampledVideoWidth / cameraRatio, }}
                    width={250}
                    height={250 / cameraRatio}
                >
                </Webcam> :
                null
            }
            {cameraRatio > 0 ?
                <Webcam
                    ref={clientWebcamRef}
                    style={{ zIndex: 1, width: 700, height: 700 / cameraRatio}}
                    mirrored={true}
                >
                </Webcam>:
                null
            }
            
            {clientWebcamRef.current ?
                    <canvas width={`${sampledVideoWidth}px`} height={`${sampledVideoWidth / cameraRatio}px`} ref={canvasRef} style={{ zIndex: 5, width: 700, height: 700 / cameraRatio, marginLeft: -700}} />
                    
                : null}
            {clientWebcamRef.current ?
                   <canvas width={`${sampledVideoWidth}px`} height={`${sampledVideoWidth / cameraRatio}px`} ref={singlePoseRef} style={{ zIndex: 6, width: 700, height: 700 / cameraRatio, marginLeft: -700}} />
                    
                : null}

        </div>
    )
}