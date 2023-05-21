import { useEffect, useRef, useState, useContext } from "react";
import { sampledVideoWidth } from "../util/envVars";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as mpPose from "@mediapipe/pose";
import Webcam from "react-webcam";
import { Button} from "@mui/material";
import getCameraRatio from "../util/getCameraRatio";
import { clearCanvas, drawUserSkeleton } from '../util/canvas'
import api from "../util/api";
import PoseMatchingCanvas from "../components/PoseMatchingCanvas";
import isMatching from "../poseMatching/poseMatching";
import UserContext from "../context/UserContext";

const detectorConfig = {
    runtime: 'mediapipe',
    modelType: 'full',
    solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/pose@${mpPose.VERSION}`
};

export default function AppPage() {
    const [isRunning, setIsRunning] = useState(false)
    const [blazePoseModel, setBlazePoseModel] = useState(null)
    const [cameraRatio, setCameraRatio] = useState(-1)
    const [trainingPoses, setTrainingPoses] = useState(null)
    const canvasRef = useRef(null)
    const webcamRef = useRef(null)
    const clientWebcamRef = useRef(null)
    const { getUser } = useContext(UserContext)
    const user = getUser()


    async function getTrainingPoses() {
        const response = await api.getSessionForUser(['Legs', 'Upper Body', 'Shoulders'])
        if (response.error) {
            return
        }
        setTrainingPoses(response.sessionPoses[0])
    }

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
            getTrainingPoses()
        }
        load()
    }, [])

    useEffect(() => {
        if (!isRunning || !webcamRef.current || !blazePoseModel || !canvasRef.current) {
            return
        }
        let internallIsRunning = true
        async function draw() {
            const ctx = canvasRef.current.getContext('2d')
            if (!internallIsRunning) {
                clearCanvas(ctx, canvasRef.current.width, canvasRef.current.height)
                return
            }
            const video = webcamRef.current.video;
            const estimationConfig = { flipHorizontal: false };
            const timestamp = performance.now();
            const poses = await blazePoseModel.estimatePoses(video, estimationConfig, timestamp);
            const matchingJoints = trainingPoses && poses ? isMatching(trainingPoses, poses) : []
            drawUserSkeleton(ctx, poses[0], canvasRef, matchingJoints)

            setTimeout(draw, 0)
        }
        draw()
        return () => {
            internallIsRunning = false
        }
    }, [isRunning, webcamRef.current, blazePoseModel, canvasRef.current])

    async function startDrawing() {
        setIsRunning(true)
    }

    function stopDrawing() {
        setIsRunning(false)
    }

    return (
        <div style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Button variant={'contained'} disabled={isRunning} style={{ position: "absolute", zIndex: 10, left: 15, top: 15 }} onClick={() => startDrawing()}>
                Draw Skeleton
            </Button>
            <Button variant={'contained'} style={{ position: "absolute", zIndex: 10, right: 15, top: 15 }} color="primary" onClick={stopDrawing}>Stop</Button>
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
                // <Paper variant='elevation' elevation={10} style={{borderRadius:'5%', opacity:'90%', display: "flex", height: "60%", width: "50%", justifyContent: "center", alignItems: "center" }}>
                <Webcam
                    ref={clientWebcamRef}
                    style={{ borderRadius:'1%',zIndex: 1, width: 800, height: 800 / cameraRatio }}
                    mirrored={true}
                >
                </Webcam>
                : null
            }
            {clientWebcamRef.current ?
                <canvas
                    width={`${sampledVideoWidth}px`}
                    height={`${sampledVideoWidth / cameraRatio}px`}
                    ref={canvasRef}
                    style={{ zIndex: 5, width: 800, height: 800 / cameraRatio, marginLeft: -800 }}
                />
                : null}
            {clientWebcamRef.current && trainingPoses ? <PoseMatchingCanvas cameraRatio={cameraRatio} targetPose={trainingPoses.keypoints} /> : null}
        </div>
    )
}