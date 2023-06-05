import { useEffect, useRef, useState, useContext } from "react";
import { sampledVideoWidth } from "../util/envVars";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as mpPose from "@mediapipe/pose";
import Webcam from "react-webcam";
import {Backdrop, Button} from "@mui/material";
import getCameraRatio from "../util/getCameraRatio";
import { clearCanvas, drawUserSkeleton } from '../util/canvas'
import api from "../util/api";
import PoseMatchingCanvas from "../components/PoseMatchingCanvas";
import isMatching from "../poseMatching/poseMatching";
import UserContext from "../context/UserContext";
import { calcAngles } from "../util/calc";
import animationData from "../79952-successful.json"
import Lottie, {LottieRefCurrentProps}from 'lottie-react'
import DisplaySessionOptions from "../components/DisplaySessionOptions";


const detectorConfig = {
    runtime: 'mediapipe',
    modelType: 'full',
    solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/pose@${mpPose.VERSION}`
};

export default function AppPage() {
    const successAnimRef = useRef<LottieRefCurrentProps>(null)
    const [isRunning, setIsRunning] = useState(false)
    const [blazePoseModel, setBlazePoseModel] = useState(null)
    const [openSuccessAnim, setOpenSuccessAnim] = useState(false)
    const [cameraRatio, setCameraRatio] = useState(-1)
    const [trainingPoseTimeOut, setTrainingPoseTimeOut] = useState(null)
    const [trainingPoses, setTrainingPoses] = useState(null)
    const [trainingPoseIndex,setTrainingPoseIndex] = useState(0)
    const [displaySessionOptions,setDisplaySessionOptions] = useState(true)
    const [sessions ,setSessions] = useState(null)
    const [startTime ,setStartTime] = useState(null)
    const [chosenSession ,setChosenSession] = useState(null)

    const canvasRef = useRef(null)
    const webcamRef = useRef(null)
    const clientWebcamRef = useRef(null)
    const { getUser } = useContext(UserContext)
    const user = getUser()


    async function getTrainingPoses() {
        const response = await api.getAllSessionsForUser(user.goals)
        if (response.error) {
            return
        }
        console.log("clientsession:", response)
        setSessions(response)
    }

    async function saveScore() {
        if(chosenSession){
            const sessionName = chosenSession.name
            const userEmail = user.email
            const duration = (new Date() - startTime)/1000
            console.log(duration)
            await api.addScore({user: userEmail, session:sessionName, duration: duration.toFixed(2)})
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
        if (!chosenSession) {
            return
        }
        async function loadSessionPoses(){
            const response = await api.getSessionPoses(chosenSession.name)
            if (response.error) {
                return
            }
            const sessionPoses = response.sessionPoses.map((pose) => {return {...pose,poseAngles: calcAngles(pose.keypoints3D).filter((poseAngle)=> poseAngle !== -1)}})
            setTrainingPoses(sessionPoses)
        }
        loadSessionPoses()
    }, [chosenSession])

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
        if (!isRunning || !webcamRef.current || !blazePoseModel || !canvasRef.current || trainingPoseIndex === -1) {
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
            const matchingJoints = trainingPoses[trainingPoseIndex] && poses ? isMatching(trainingPoses[trainingPoseIndex].poseAngles, poses) : []
            drawUserSkeleton(ctx, poses[0], canvasRef, matchingJoints)
            setTimeout(draw, 0)
            if(trainingPoses && matchingJoints.length === trainingPoses[trainingPoseIndex].poseAngles.length){
                if(!trainingPoseTimeOut){
                    setTrainingPoseTimeOut(setTimeout(() => {
                        if (trainingPoses.length > trainingPoseIndex+1) {
                            setOpenSuccessAnim(true)
                            setTrainingPoseIndex(trainingPoseIndex+1)
                            setTrainingPoseTimeOut(null)
                        } else {
                            setTrainingPoseIndex(-1)
                            internallIsRunning = false
                        }} , 2000))
                }
            }
            else if(trainingPoseTimeOut){
                clearTimeout(trainingPoseTimeOut)
                setTrainingPoseTimeOut(null)
            }
        }
        draw()
        return () => {
            internallIsRunning = false
        }
    }, [isRunning, webcamRef.current, blazePoseModel, canvasRef.current, trainingPoseTimeOut])

    useEffect(() => {
        console.log(trainingPoseIndex)
        console.log(trainingPoses)
        if (trainingPoses && trainingPoseIndex === -1) {
            endSession()
        }
    }, [trainingPoseIndex, trainingPoses])

    async function startDrawing() {
        setIsRunning(true)
        setStartTime(new Date())
    }


    function endSession() {
        saveScore()
        stopDrawing()
    }
    function stopDrawing() {
        setIsRunning(false)
        setTimeout(() => {setTrainingPoseIndex(0)}, 100)
    }


    const handleSuccessAnimationComplete = () => {
        console.log("finish")
        setTimeout(() => {
          setOpenSuccessAnim(false);
        }, 1900); // Adjust the delay as needed
      };

    return (
        <div style={{ position: 'absolute', width: '100%', height: '90%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop:55}}>
            <Button variant={'contained'} disabled={isRunning} style={{ position: "absolute", zIndex: 10, left: 15, top: 45 }} onClick={() => startDrawing()}>
                Start Game
            </Button>
            <Button variant={'contained'} style={{ position: "absolute", zIndex: 10, right: 15, top: 45 }} color="primary" onClick={stopDrawing}>Stop</Button>
           
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
                    style={{ borderRadius:'1%',zIndex: 1, width: 650, height: 650 / cameraRatio }}
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
                    style={{ zIndex: 5, width: 650, height: 650 / cameraRatio, marginLeft: -650}}
                />
                : null}
             {sessions && displaySessionOptions?
                <DisplaySessionOptions sessions={sessions} setChosenSession={setChosenSession} setDisplaySessionOptions={setDisplaySessionOptions}/>
            : null}
            {clientWebcamRef.current && trainingPoses && trainingPoses[trainingPoseIndex] && trainingPoseIndex > -1 ? <PoseMatchingCanvas cameraRatio={cameraRatio} targetPose={trainingPoses[trainingPoseIndex].keypoints} /> : null}
            {openSuccessAnim && (
                <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openSuccessAnim}
                >              
                    <Lottie
                    lottieRef={successAnimRef}
                    animationData={animationData}
                    loop={false}
                    onComplete={handleSuccessAnimationComplete}
                    />
                </Backdrop>
            )}        
        </div>
    )
}