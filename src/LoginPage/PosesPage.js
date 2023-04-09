import {useState,input, useEffect} from "react";
import {Button,Paper, Modal, ImageList, ImageListItem, Stack, TextField,Typography,Slider} from "@mui/material";
import api from "../util/api";
import { useNavigate } from "react-router-dom";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as mpPose from "@mediapipe/pose";
import { calcLengths, calcAngles } from '../components/calc'
import get3DPositions from "../util/get3DPositions";

const detectorConfig = {
    runtime: 'mediapipe',
    modelType: 'full',
    solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/pose@${mpPose.VERSION}`
};

export default function PosesPage() {

    const [blazePoseModel, setBlazePoseModel] = useState(null)
    const [fullPose, setFullPose] = useState()

    const [open, setOpen] = useState(false);
    const [estimateTime, setEstimateTime] = useState(5);
    const [minAge, setMinAge] = useState(0);
    const [maxAge, setMaxAge] = useState(0);
    const [img, setImage] = useState([]);

    const navigate = useNavigate()

    function handleAddPose() {
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
        async function onImageChange(e){
            setImage([...e.target.files]);
            console.log(img);
            if(img){
                const estimationConfig = {flipHorizontal: false};
                const timestamp = performance.now();
                const htmlImg = document.createElement('htmlImg');
                img.src = img;
                const poses = await blazePoseModel.estimatePoses(htmlImg);
                console.log(poses);
            const positions = poses[0]
            if(positions) {
                const poses3D = get3DPositions(positions)
                const posAngles = calcAngles(poses3D)
                const partsLengths = calcLengths(poses3D)
                console.log(posAngles);
                setFullPose(JSON.stringify({ pose: poses3D, posAngles,partsLengths}));
        }
    }
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
                style={{display: 'flex',alignItems: 'center',justifyContent: 'center',}}
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
            >

                <Paper style={{display: "flex", height: "60%", width: "60%", justifyContent: "center", alignItems: "center"}}>
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
                        
                        <Button disabled={!fullPose || !estimateTime || !minAge || !maxAge} onClick={handleAddPose}>Add</Button>
                        
                    </Stack>
                </Paper>
            </Modal>
            
            {/* <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
                {itemData.map((item) => (
                    <ImageListItem key={item.img}>
                        <img
                            src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                            srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                            alt={item.title}
                            loading="lazy"
                        />
                    </ImageListItem>
                ))}
            </ImageList> */}
        </div>
    )
}