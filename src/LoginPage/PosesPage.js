import {useState,input, useEffect,useRef} from "react";
import {Button,Paper, Modal, ImageList, ImageListItem, Stack, TextField,Typography,Slider} from "@mui/material";
import api from "../util/api";
import { useNavigate } from "react-router-dom";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as mpPose from "@mediapipe/pose";
import { calcLengths, calcAngles } from '../components/calc'
import get3DPositions from "../util/get3DPositions";
import {sampledVideoWidth} from "../util/envVars";
import useWebsocket from "../components/useWebsocket";

const detectorConfig = {
    runtime: 'mediapipe',
    modelType: 'full',
    solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/pose@${mpPose.VERSION}`
};

export default function PosesPage() {
    const [blazePoseModel, setBlazePoseModel] = useState(null)
    const [fullPose, setFullPose] = useState()
    const [imageUrl, setImageUrl] = useState(null)
    const [open, setOpen] = useState(false);
    const [estimateTime, setEstimateTime] = useState(5);
    const [minAge, setMinAge] = useState(0);
    const [maxAge, setMaxAge] = useState(0);
    const imageRef = useRef()
    const [msg, sendMsg] = useWebsocket()

    const navigate = useNavigate()

    async function handleAddPose() {
        await api.sendPose({minAge, maxAge, estimateTime, ...fullPose})
        console.log(fullPose)
    }

    function handleOpen() {
        setOpen(true);
    }
    function handleClose(){
        setOpen(false);
    }


    useEffect(() => {
        async function load() {
            const model = poseDetection.SupportedModels.BlazePose;
            const detector = await poseDetection.createDetector(model, detectorConfig);
            setBlazePoseModel(detector)
            console.log("ready for pose")
        }
        load()
    }, [])


    useEffect(() => {
        async function runPoseDetection() {
            imageRef.current.width = 250
            setTimeout(async () => {
                console.log(imageRef.current);
                const timestamp = performance.now();
                const estimationConfig = {flipHorizontal: false};
                const poses = await blazePoseModel.estimatePoses(imageRef.current, estimationConfig, timestamp);
                const positions = poses[0]
                if(positions) {
                    const poses3D = get3DPositions(positions)
                    const posAngles = calcAngles(poses3D)
                    const partsLengths = calcLengths(poses3D)
                    setFullPose({ pose: poses3D, posAngles ,partsLengths})
                }
            }, 500)
        }
        if(imageUrl) {
            runPoseDetection()
        }
    }, [imageUrl])

    async function onImageChange(e){
        const img = e.target.files[0];
        setImageUrl(URL.createObjectURL(img))
    }


    function valueLabelFormat(value) {
        return `${value} sec`;
    }

    
    return (
        <div style={{display:"flex", position: "absolute", height: "100%", width: "100%", justifyContent: "center", alignItems: "center"}}>
            <Button variant="contained" color="secondary" onClick={handleOpen}>
                Add new Pose
            </Button>
            <Modal
                style={{ display: 'flex',alignItems: 'center',justifyContent: 'center', overflow:"scroll"}}
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
            >

                <Paper style={{padding:50, height: "60%", width: "60%", justifyContent: "center", alignItems: "center"}}>
                    <Stack direction="column" spacing={3}>
                        <Stack style={{textAlign: "center"}} direction="row" spacing={2}>
                        <Typography>
                        estimated Time:
                        </Typography>
                        <Slider
                            value={estimateTime}
                            min={5}
                            step={1}
                            max={55}
                            getAriaValueText={valueLabelFormat}
                            valueLabelFormat={valueLabelFormat}
                            onChange={(event) => setEstimateTime(event.target.value)}
                            valueLabelDisplay="auto"

                        />
                        </Stack>
                        <TextField label="min age" value={minAge} onChange={(event) => setMinAge(event.target.value)}></TextField>
                        <TextField label="max age" value={maxAge} onChange={(event) => setMaxAge(event.target.value)}></TextField>
                        <input type="file" multiple accept="image/*" onChange={onImageChange} />
                        <img ref={imageRef} hidden={false} src={imageUrl}></img>
                        <Button disabled={!fullPose || !estimateTime || !minAge || !maxAge} onClick={handleAddPose}>Add</Button>
                    </Stack>
                </Paper>
            </Modal>
        </div>
    )
}