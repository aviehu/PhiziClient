import Webcam from "react-webcam";
import {useRef, useState, useEffect} from "react";
import {Button} from "@mui/material";
import {screenshotQuality, videoWidth, videoHeight, sampleInterval, scoreThreshold } from '../util/envVars'
import "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";
import drawCircles from "../util/drawCircles";
import drawLines from "../util/drawLines";
import clearCanvas from "../util/clearCanvas";
import sendRecording from "../util/sendRecording";

export default function WebCam() {

    const [isRunning, setIsRunning] = useState(false)
    const [posenetModel, setPoseNetModel] = useState(null)

    const canvasRef = useRef(null)
    const webcamRef = useRef(null)

    useEffect(() => {
        if(!webcamRef.current) {
            return
        }
        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight;
    }, [webcamRef.current])

    useEffect(() => {
        async function load() {
            const posenet_model = await posenet.load({
                inputResolution: { width: videoWidth, height: videoHeight },
                scale: 0.8,
            });
            setPoseNetModel(posenet_model)
            console.log("ready")
        }
        load()
    }, [])

    useEffect(() => {
        if(!isRunning || !webcamRef.current || !posenetModel || !canvasRef.current) {
            return
        }
        let internallIsRunning = true
        const recording = []
        async function draw() {
            const ctx = canvasRef.current.getContext('2d')
            if (!internallIsRunning) {
                clearCanvas(ctx, canvasRef.current.width, canvasRef.current.height)
                await sendRecording(recording)
                return
            }
            const video = webcamRef.current.video;
            const allPositions = await posenetModel.estimateSinglePose(video);
            recording.push(allPositions)
            const positions = allPositions.keypoints.filter((pos) => pos.score > scoreThreshold)
            const ans = positions.map((pos) => {
                return {
                    part: pos.part,
                    x: videoWidth - pos.position.x,
                    y: pos.position.y
                }
            })
            clearCanvas(ctx, canvasRef.current.width, canvasRef.current.height)
            drawLines(ctx, ans)
            drawCircles(ctx, ans)
            setTimeout(draw, 0)
        }
        draw()
        return () => {
            internallIsRunning = false
        }
    }, [isRunning, webcamRef.current, posenetModel, canvasRef.current])

    async function startDrawing() {
        setIsRunning(true)
    }

    function stopDrawing() {
        setIsRunning(false)
    }

    return (
        <div style={{position:"relative"}}>
            <Webcam
                ref={webcamRef}
                style={{zIndex:0, width:`${videoWidth}px`, height:`${videoHeight}px`, position:"absolute", left:0, top:0}}
                screenshotQuality={screenshotQuality}
                mirrored={true}
                videoConstraints={{facingMode: "user", width: videoWidth, height: videoHeight,}}
            >
            </Webcam>
            <Button variant={'contained'} disabled={isRunning} style={{position:"absolute", zIndex:10}} onClick={() => startDrawing()}>
                Draw Skeleton
            </Button>
            <canvas width={`${videoWidth}px`} height={`${videoHeight}px`} ref={canvasRef} style={{zIndex:5, position: "absolute", left:0, top:0}}/>
            <Button variant={'contained'} style={{position: "absolute", left: videoWidth -71.47, top: 0, zIndex:10}} color="primary" onClick={stopDrawing}>Stop</Button>
        </div>
    )
}