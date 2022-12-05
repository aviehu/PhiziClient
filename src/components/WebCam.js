import Webcam from "react-webcam";
import {useRef, useState, useEffect} from "react";
import {Button} from "@mui/material";
import { scoreThreshold } from '../util/envVars'
import "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";
import drawCircles from "../util/drawCircles";
import drawLines from "../util/drawLines";
import clearCanvas from "../util/clearCanvas";
import sendRecording from "../util/sendRecording";

export default function WebCam() {

    const [isRunning, setIsRunning] = useState(false)
    const [posenetModel, setPoseNetModel] = useState(null)
    const [sampledWidth, setSampledWidth] = useState(0)
    const [sampledHeight, setSampledHeight] = useState(0)

    const canvasRef = useRef(null)
    const webcamRef = useRef(null)
    const clientWebcamRef = useRef(null)

    useEffect(() => {
        if(!webcamRef.current || sampledWidth !== 0 || sampledHeight !== 0) {
            return
        }
        const { clientWidth, clientHeight } = webcamRef.current.video
        webcamRef.current.video.width = clientWidth
        webcamRef.current.video.height = clientHeight
        setSampledWidth(clientWidth)
        setSampledHeight(clientHeight)
    }, [webcamRef.current])

    useEffect(() => {
        async function load() {
            if(sampledWidth === 0) {
                return
            }
            const posenet_model = await posenet.load({
                inputResolution: { width: sampledWidth, height: sampledHeight },
                scale: 0.8,
            });
            setPoseNetModel(posenet_model)
            console.log("ready")
        }
        load()
    }, [sampledWidth])

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
                    x: sampledWidth - pos.position.x,
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
                style={{zIndex:0, position:"absolute", left:0, top:0}}
                mirrored={true}
                videoConstraints={{facingMode: "user", width: sampledWidth, height: sampledHeight,}}
            >
            </Webcam>
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
                <canvas width={`${sampledWidth}px`} height={`${sampledHeight}px`} ref={canvasRef} style={{zIndex:5, position: "absolute", left:0, top:0, width:clientWebcamRef.current.video.clientWidth, height:clientWebcamRef.current.video.clientHeight, objectFit: 'contain'}}/>
                : null }
            { clientWebcamRef.current ?
                <Button variant={'contained'} style={{position: "absolute", left: clientWebcamRef.current.video.clientWidth -71.47, top: 0, zIndex:10}} color="primary" onClick={stopDrawing}>Stop</Button>
                : null }
        </div>
    )
}