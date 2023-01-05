import Webcam from "react-webcam";
import {useRef, useState, useEffect} from "react";
import {Button} from "@mui/material";
import { scoreThreshold, sampledVideoWidth } from '../util/envVars'
import * as poseDetection from '@tensorflow-models/pose-detection'
import useWebsocket from '../useWebsocket'
import '@tensorflow/tfjs-backend-webgl';
import drawCircles from "../util/drawCircles";
import drawLines from "../util/drawLines";
import clearCanvas from "../util/clearCanvas";
import sendRecording from "../util/sendRecording";
import * as mpPose from '@mediapipe/pose';


export default function WebCam() {

    const [isRunning, setIsRunning] = useState(false)
    const [blazePoseModel, setBlazePoseModel] = useState(null)
    const [cameraRatio, setCameraRation] = useState(-1)
    const [fps, setFps] = useState(0)
    const [counter ,setCounter] = useState(0)
    const [lastFrame, setLastFrame] = useState([])
    const [handSpread, setHandSpread] = useState([])

    const canvasRef = useRef(null)
    const webcamRef = useRef(null)
    const clientWebcamRef = useRef(null)
    const [msg, sendMsg] = useWebsocket()

    async function sampleCameraSize() {
        const features = {
            audio: true,
            video: {
                width: { ideal: 640 },
                height: { ideal: 480 }
            }
        };
        const display = await navigator.mediaDevices.getUserMedia(features);
        const settings = display.getVideoTracks()[0].getSettings();
        console.log(settings)
        setCameraRation(settings.width / settings.height)
    }

    useEffect(() => {
        if(!webcamRef.current) {
            return
        }
        webcamRef.current.video.width = sampledVideoWidth
        webcamRef.current.video.height = sampledVideoWidth / cameraRatio
    }, [webcamRef.current])

    useEffect(() => {
        async function load() {
            const model = poseDetection.SupportedModels.BlazePose;
            const detectorConfig = {
                runtime: 'mediapipe',
                modelType: 'full',
                solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/pose@${mpPose.VERSION}`
            };
            const detector = await poseDetection.createDetector(model, detectorConfig);
            setBlazePoseModel(detector)
            await sampleCameraSize()
            console.log("ready")
        }
        load()
    }, [])

    useEffect(() => {
        if(!isRunning || !webcamRef.current || !blazePoseModel || !canvasRef.current) {
            return
        }
        let internallIsRunning = true
        const recording = []
        const fpsInterval = setInterval(() => {
            setCounter(counter => counter + 1)
            setFps(recording.length)
            recording.length = 0
        }, 1000)

        async function draw() {
            const ctx = canvasRef.current.getContext('2d')
            if (!internallIsRunning) {
                clearCanvas(ctx, canvasRef.current.width, canvasRef.current.height)
                clearInterval(fpsInterval)
                setFps(0)
                await sendRecording(recording)
                return
            }
            const video = webcamRef.current.video;
            const estimationConfig = {flipHorizontal: false};
            const timestamp = performance.now();
            const poses = await blazePoseModel.estimatePoses(video, estimationConfig, timestamp);
            if(poses[0]) {
                const positions = poses[0].keypoints.filter((pos) => pos.score > scoreThreshold)
                const ans = positions.map((pos) => {
                    return {
                        part: pos.name,
                        x: sampledVideoWidth - pos.x,
                        y: pos.y,
                        z: pos.z
                    }
                })
                sendMsg(JSON.stringify({ pose: ans, timestamp}))
                recording.push(ans)
                setLastFrame(ans)
                clearCanvas(ctx, canvasRef.current.width, canvasRef.current.height)
                drawLines(ctx, ans)
                drawCircles(ctx, ans)
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

    useEffect(() => {
        if(counter === 10) {
            setHandSpread(lastFrame)
        }
        if(counter === 15) {
            const leftWristX =  handSpread.find((part) => part.part === 'left_wrist').x
            const leftShoulderX = handSpread.find((part) => part.part === 'left_shoulder').x
            const rightWristX =  handSpread.find((part) => part.part === 'right_wrist').x
            const rightShoulderX = handSpread.find((part) => part.part === 'right_shoulder').x
            const B = (Math.abs(leftWristX - leftShoulderX) + Math.abs(rightWristX - rightShoulderX)) / 2
            const leftWristZ =  lastFrame.find((part) => part.part === 'left_wrist').z
            const leftShoulderZ = lastFrame.find((part) => part.part === 'left_shoulder').z
            const rightWristZ =  lastFrame.find((part) => part.part === 'right_wrist').z
            const rightShoulderZ = lastFrame.find((part) => part.part === 'right_shoulder').z
            const C = (Math.abs(leftWristZ - leftShoulderZ) + Math.abs(rightWristZ - rightShoulderZ)) / 2
            const U = B / C
            sendMsg(JSON.stringify({ pose: [], U: U }))
            console.log('B', B)
            console.log('C', C)
            console.log('U', U)
        }
    }, [counter])

    async function startDrawing() {
        setIsRunning(true)
    }

    function stopDrawing() {
        setIsRunning(false)
    }

    return (
        <div style={{position:"relative"}}>
            { cameraRatio > 0 ?
                <Webcam
                    ref={webcamRef}
                    style={{zIndex:0, position:"absolute", left:0, top:0}}
                    mirrored={true}
                    videoConstraints={{facingMode: "user", width: sampledVideoWidth, height: sampledVideoWidth / cameraRatio,}}
                    width={250}
                    height={250 / cameraRatio}
                >
                </Webcam> :
                null
            }
            <Webcam
                ref={clientWebcamRef}
                style={{zIndex:1, position:"absolute", left:0, top:0, width:'80vw', objectFit: 'contain'}}
                mirrored={true}
            >
            </Webcam>
            <Button variant={'contained'} disabled={isRunning} style={{position:"absolute", zIndex:10}} onClick={() => startDrawing()}>
                Draw Skeleton
            </Button>
            { clientWebcamRef.current ?
                <canvas width={`${sampledVideoWidth}px`} height={`${sampledVideoWidth / cameraRatio}px`} ref={canvasRef} style={{zIndex:5, position: "absolute", left:0, top:0, width:clientWebcamRef.current.video.clientWidth, height:clientWebcamRef.current.video.clientHeight, objectFit: 'contain'}}/>
                : null }
            { clientWebcamRef.current ?
                <Button variant={'contained'} style={{position: "absolute", left: clientWebcamRef.current.video.clientWidth -71.47, top: 0, zIndex:10}} color="primary" onClick={stopDrawing}>Stop</Button>
                : null }
            <h1 style={{position: "absolute", left: 0, top: 50, zIndex:10}}>fps: {fps}</h1>
            <h1 style={{position: "absolute", left: 0, top: 100, zIndex:10}}>{counter}</h1>
        </div>
    )
}