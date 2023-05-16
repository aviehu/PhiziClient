import { useState, input, useEffect, useRef } from "react";
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
    Typography,
    Slider,
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
                    console.log("postions", positions)
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
        console.log(values)
        setGoals(values)
    }

    function TransitionRight(props) {
        return <Slide {...props} direction="right" />;
    }

    return (
        <div style={{ display: 'flex', position: "absolute", height: "100%", width: "100%", justifyContent: "center", alignItems: "center" }}>
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
            <Paper style={{ padding: 100, display: 'flex', justifyContent: "center", alignItems: "center" }}>
                <Stack direction="column" spacing={3}>
                    <Stack style={{ textAlign: "center" }} direction="column" spacing={2}>
                        <TextField label="Name" value={name} onChange={(event) => setName(event.target.value)}></TextField>
                        <FormControl sx={{ m: 1, width: 300 }}>
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
                    <input type="file" multiple accept="image/*" onChange={onImageChange} />
                    {imageUrl ?
                        <img hidden={false} src={imageUrl} style={{ width: 250 }}></img> : null
                    }
                    <Button onClick={switchView}>Take a Picture</Button>
                    <Button disabled={!name || !goals} onClick={() => {
                        setOpenSnackBar(true)
                        submitForm()
                    }}>Add</Button>
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