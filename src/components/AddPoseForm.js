import { useState, input, useEffect, useRef } from "react";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { styled } from '@mui/material/styles';

import {
    Button,
    Paper,
    Stack,
    TextField,
    InputLabel,
    Select,
    FormControl,
    OutlinedInput,
    MenuItem,
    Checkbox,
    ListItemText,
    Tooltip,
    Box,
    IconButton,
    Snackbar, Slide, Alert
} from "@mui/material";
import api from "../util/api";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as mpPose from "@mediapipe/pose";
import { calcLengths, calcAngles } from '../util/calc'
import get3DPositions from "../util/get3DPositions";
import get2DPositions from "../util/get2DPositions";
import Resizer from "react-image-file-resizer";

const detectorConfig = {
    runtime: 'mediapipe',
    modelType: 'full',
    solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/pose@${mpPose.VERSION}`
};

export default function AddPoseForm({ setGoals, setName, setKeypoints, name, goals, submitForm, switchView }) {
    const [blazePoseModel, setBlazePoseModel] = useState(null)
    const [imageUrl, setImageUrl] = useState(null)
    const [image, setImage] = useState(null)
    const [resizedImage, setResizedImage] = useState(null)
    const [openSnackBar, setOpenSnackBar] = useState(false)
    const imageRef = useRef()
    const resizedImageRef = useRef()
    const hiddenFileInput = useRef(null);

    const ITEM_HEIGHT = 48
    const ITEM_PADDING_TOP = 8

    const goalsNames = ['Upper Body', 'Legs', 'Shoulders'];
    const goalsNamesMatch = {
        'Upper Body': 'UPPER_BODY',
        'Legs': 'LEGS',
        'Shoulders': 'Shoulders'
    }
    const goalsProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    }

    useEffect(() => {
        async function load() {
            const model = poseDetection.SupportedModels.BlazePose;
            const detector = await poseDetection.createDetector(model, detectorConfig);
            setBlazePoseModel(detector)
        }
        load()
    }, [])

    useEffect(() => {
        async function runPoseDetection() {
            setTimeout(async () => {

                const timestamp = performance.now();
                const estimationConfig = { flipHorizontal: true };
                const poses = await blazePoseModel.estimatePoses(resizedImageRef.current, estimationConfig, timestamp);
                const positions = poses[0]
                if (positions) {
                    const poses3D = get3DPositions(positions)
                    const posAngles = calcAngles(poses3D)
                    const poses2D = get2DPositions(positions)
                    const partsLengths = calcLengths(poses3D)
                    setKeypoints(poses3D)
                }
            }, 500)
        }
        if (imageUrl) {
            runPoseDetection()
        }
    }, [resizedImage])

    useEffect(() => {
        if (!image || !imageUrl || !imageRef.current) {
            return
        }
        setTimeout(() => {
            const ratio = imageRef.current.width / imageRef.current.height
            const h = 250 / ratio
            Resizer.imageFileResizer(
                image,
                250,
                h,
                "PNG",
                100,
                0,
                (uri) => {
                    setResizedImage(URL.createObjectURL(uri))
                },
                "file",
                200,
                200
            )
        }, 300)

    }, [imageUrl, imageRef.current, image])

    async function onImageChange(e) {
        const img = e.target.files[0];
        setImage(img)
        setImageUrl(URL.createObjectURL(img))
    }

    function valueLabelFormat(value) {
        return `${value} sec`;
    }

    const handleGoalChange = (event) => {
        const values = event.target.value
        setGoals(values)
    }

    function TransitionRight(props) {
        return <Slide {...props} direction="right" />;
    }
    
    function handleAddPic(event){
        hiddenFileInput.current.click();
    }

    return (
        <div style={{ display: "flex", position: "absolute", height: "80%", width: "100%", justifyContent: "center", alignItems: "center",marginTop:'6%'}}>
            <Snackbar
                autoHideDuration={4000}
                open={openSnackBar}
                onClose={() => {setOpenSnackBar(false)}}
                TransitionComponent={TransitionRight}
                key={'snackBar'}

            >
                <Alert onClose={() => setOpenSnackBar(false)} severity="success" sx={{ width: '100%' }}>
                    Pose added successfully
                </Alert>
            </Snackbar>
            <Paper variant='elevation' elevation={10} style={{ borderRadius:'5%', backgroundColor:'rgba(255,255,255,0.95)', display: 'flex', justifyContent: "center", alignItems: "center", height: "90%", width: "40%"}}>
                <Stack direction="column" spacing={2} style={{ alignItems:'center',textAlign: "center", width:'100%' }}>
                        <h1 style={{  backgroundColor: "rgba(0,0,0,0.12)", borderRadius:4, width:'45%',textAlign:'center', color:'rgba(0,0,1,0.5)', boxShadow:'1px 2px 4px #999'}}>Add Pose</h1>
                        <Stack direction="column" spacing={3} style={{ alignItems:'center',textAlign: "center" }}>
                        <TextField label="Name" value={name} onChange={(event) => setName(event.target.value)} fullWidth style={{boxShadow:'1px 1px #999', borderRadius:'5%'}} ></TextField>
                        <FormControl sx={{ m: 1 }} fullWidth style={{boxShadow:'1px 1px #999', borderRadius:'5%'}}>
                            <InputLabel id="demo-multiple-checkbox-label">Goals</InputLabel>
                            <Select
                                labelId="demo-multiple-checkbox-label"
                                id="demo-multiple-checkbox"
                                multiple
                                value={goals}
                                onChange={handleGoalChange}
                                input={<OutlinedInput label="Goals" />}
                                renderValue={(selected) => selected.join(', ')}
                                MenuProps={goalsProps}
                            >
                                {goalsNames.map((goal) => (
                                    <MenuItem key={goal} value={goal}>
                                        <Checkbox checked={goals.indexOf(goal) > -1} />
                                        <ListItemText primary={goal} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        </Stack>
                        <Stack direction="row" spacing={3} style={{ alignItems:'center',textAlign: "center" }} >
                        <Tooltip title="upload picture">
                            <IconButton aria-label="upload picture" onClick={handleAddPic} size='large' style={{boxShadow: 'rgba(0, 0, 0, 0.24) 1px 3px 8px,rgba(0, 0, 0, 0.24) 1px 1px 2px', borderRadius:'30%'}} fullWidth>
                                <FileUploadIcon />
                            </IconButton>
                        </Tooltip>
                        
                        <input ref={hiddenFileInput} type="file" multiple accept="image/*" onChange={onImageChange} style={{display:'none'}}  />
                        
                        <Tooltip title="take a picture">
                            <IconButton aria-label="take picture" onClick={switchView} size='large' style={{boxShadow: 'rgba(0, 0, 0, 0.24) 1px 3px 8px,rgba(0, 0, 0, 0.24) 1px 1px 2px', borderRadius:'30%'}}>
                                <AddAPhotoIcon />
                            </IconButton>
                        </Tooltip>
                       
                        </Stack>
                        {imageUrl ?
                            <img hidden={false} src={imageUrl} style={{ width: 100 }}></img> : null
                        }
                    <Button disabled={!name || !goals} onClick={() => {
                        setOpenSnackBar(true)
                        submitForm()
                    }}>Save</Button>
                </Stack>
            </Paper>
            {imageUrl ?
                <img ref={imageRef} hidden={false} src={imageUrl} style={{ zIndex: -1, position: 'absolute', top: 0, left: 0, width: 250 }}></img> : null
            }
            {resizedImage ?
                <img ref={resizedImageRef} hidden={false} src={resizedImage} style={{ zIndex: -1, position: 'absolute', top: 0, left: 0, width: 250 }}></img> : null
            }
        </div>
    )
}