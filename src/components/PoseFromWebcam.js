import { useEffect, useRef, useState } from "react";
import { sampledVideoWidth } from "../util/envVars";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as mpPose from "@mediapipe/pose";
import Webcam from "react-webcam";
import {Button, Stack} from "@mui/material";
import getCameraRatio from "../util/getCameraRatio";
import {clearCanvas, drawUserSkeleton} from '../util/canvas'
import AddPoseCanvas from "./AddPoseCanvas";
import Typography from "@mui/material/Typography";
import get3DPositions from "../util/get3DPositions";
import get2DPositions from "../util/get2DPositions";

const detectorConfig = {
    runtime: 'mediapipe',
    modelType: 'full',
    solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/pose@${mpPose.VERSION}`
};

export default function PoseFromWebcam({setKeypoints, switchView}) {
    const [isRunning, setIsRunning] = useState(false)
    const [blazePoseModel, setBlazePoseModel] = useState(null)
    const [cameraRatio, setCameraRatio] = useState(-1)
    const [screenShot, setScreenShot] = useState(null)
    const [timer, setTimer] = useState(null)
    const canvasRef = useRef(null)
    const webcamRef = useRef(null)
    const clientWebcamRef = useRef(null)

    useEffect(() => {
        if (!webcamRef.current || cameraRatio < 0) {
            return
        }
        webcamRef.current.video.width = sampledVideoWidth
        webcamRef.current.video.height = sampledVideoWidth / cameraRatio
    }, [webcamRef.current, cameraRatio])

    useEffect(() => {
        async function load() {
            const model = poseDetection.SupportedModels.BlazePose;
            const detector = await poseDetection.createDetector(model, detectorConfig);
            setBlazePoseModel(detector)
            const cameraRatio = await getCameraRatio()
            setCameraRatio(cameraRatio)
        }
        load()
    }, [])

    useEffect(() => {
        if (!isRunning || !webcamRef.current || !blazePoseModel || !canvasRef.current) {
            return
        }
        let internallIsRunning = true
        setScreenShot(null)
        async function draw() {
            const ctx = canvasRef.current.getContext('2d')
            const video = webcamRef.current.video;
            const estimationConfig = { flipHorizontal: false };
            const timestamp = performance.now();
            if (!internallIsRunning) {
                clearCanvas(ctx, canvasRef.current.width, canvasRef.current.height)
                const poses = await blazePoseModel.estimatePoses(video, estimationConfig, timestamp);
                setScreenShot(poses[0])
                return
            }
            const poses = await blazePoseModel.estimatePoses(video, estimationConfig, timestamp);
            drawUserSkeleton(ctx, poses[0], canvasRef)
            setTimeout(draw, 0)
        }
        draw()
        return () => {
            internallIsRunning = false
        }
    }, [isRunning, webcamRef.current, blazePoseModel, canvasRef.current])

    function startDrawing() {
        setIsRunning(true)
    }

    function takeScreenShot() {
        let internalTime = 5
        const interval = setInterval(() => {
            setTimer(internalTime)
            internalTime --
        }, 1000)
        setTimeout(() => {
            clearInterval(interval)
            setTimer(null)
            setIsRunning(false)
        }, 6000)
    }

    return (
        <div 
            style={{
                position: 'absolute',
                backgroundColor: 'white',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'}}
        >
            <Stack direction='row' justifyContent="space-between" style={{position:"absolute", top: 20, left:20, right: 20}}>
                <Button
                    variant={'contained'}
                    disabled={isRunning}
                    onClick={() => startDrawing()}
                >
                    Draw Skeleton
                </Button>
                { timer ? <Typography> {timer} </Typography> : null }
                <Button
                    disabled={!isRunning || screenShot}
                    variant={'contained'}
                    color="primary"
                    onClick={takeScreenShot}
                >
                    Take Picture
                </Button>
            </Stack>
            <Webcam
                ref={webcamRef}
                style={{ zIndex: -1, position: "absolute", left: 0, top: 0 }}
                mirrored={true}
                videoConstraints={{ facingMode: "user", width: sampledVideoWidth, height: sampledVideoWidth / cameraRatio, }}
                width={250}
                height={250 / cameraRatio}
            >
            </Webcam>
            {cameraRatio > 0 ?
                <Webcam
                    ref={clientWebcamRef}
                    style={{ zIndex: 1, width: 800, height: 800 / cameraRatio}}
                    mirrored={true}
                >
                </Webcam>:
                null
            }
            {clientWebcamRef.current ?
                <canvas
                    width={`${sampledVideoWidth}px`}
                    height={`${sampledVideoWidth / cameraRatio}px`}
                    ref={canvasRef}
                    style={{ zIndex: 5, width: 800, height: 800 / cameraRatio, marginLeft: -800}}
                />
                : null}
            { screenShot ? <AddPoseCanvas cameraRatio={cameraRatio} targetPose={get2DPositions(screenShot)}/> : null }
            { screenShot ?
                <Button variant={'contained'} style={{ position: 'absolute', right: 30, bottom: 80 }} onClick={() => {
                    setKeypoints({keypoints3D: get3DPositions(screenShot), keypoints: get2DPositions(screenShot)})
                    switchView()
                }}>
                    Accept
                </Button> :
                null
            }
        </div>
    )
}