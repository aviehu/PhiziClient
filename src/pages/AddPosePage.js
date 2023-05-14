import {useState,input, useEffect,useRef} from "react";
import {Button,Paper, Stack,TextField,InputLabel,Select, FormControl, OutlinedInput, MenuItem, Checkbox, ListItemText, Typography,Slider} from "@mui/material";
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

export default function AddPosePage() {
    const [blazePoseModel, setBlazePoseModel] = useState(null)
    const [fullPose, setFullPose] = useState()
    const [imageUrl, setImageUrl] = useState(null)
    const [image, setImage] = useState(null)
    const [resizedImage, setResizedImage] = useState(null)
    const [estimateTime, setEstimateTime] = useState(5);
    const [goals, setGoals] = useState([]);
    const [name, setName] = useState("");
    const imageRef = useRef()
    const resizedImageRef = useRef()

    const ITEM_HEIGHT = 48
    const ITEM_PADDING_TOP = 8

    const goalsNames = ['Upper Body', 'Legs', 'Shoulders'];
    const goalsNamesMatch = {'Upper Body': 'UPPER_BODY',
                             'Legs': 'LEGS',
                             'Shoulders': 'Shoulders'  }
    const goalsProps = {
        PaperProps: {
          style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
          },
        },
      }

    async function handleAddPose() {
        const dataGoals = goals.map((goal) => goalsNamesMatch[goal])
        console.log("datagoals:",dataGoals)
        await api.sendPose({name: name, goals: dataGoals, keypoints: {...fullPose}})
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
                const estimationConfig = {flipHorizontal: true};
                const poses = await blazePoseModel.estimatePoses(resizedImageRef.current, estimationConfig, timestamp);
                const positions = poses[0]
                if(positions) {
                    const poses3D = get3DPositions(positions)
                    const posAngles = calcAngles(poses3D)
                    const poses2D = get2DPositions(positions)
                    const partsLengths = calcLengths(poses3D)
                    setFullPose({ pose: poses3D, posAngles ,partsLengths})
                }
            }, 500)
        }
        if(imageUrl) {
            runPoseDetection()
        }
    }, [resizedImage])

    useEffect(() => {
        if(!image || !imageUrl || !imageRef.current){
            return
        }
        setTimeout(()=> {
            const ratio = imageRef.current.width / imageRef.current.height
            const h = 250/ratio
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
        },300)
        
    },[imageUrl,imageRef.current,image])

    async function onImageChange(e){
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

    return (
        <div  style={{display: 'flex', position: "absolute", height: "100%", width: "100%", justifyContent: "center", alignItems: "center"}}>
            <Paper style={{padding:100, display: 'flex', justifyContent: "center", alignItems: "center"}}>
                <Stack direction="column" spacing={3}>
                    {/* <Stack style={{textAlign: "center"}} direction="row" spacing={2}>
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
                    </Stack> */}
                    <Stack style={{textAlign: "center"}} direction="column" spacing={2}>
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
                    {imageUrl? 
                        <img  hidden={false} src={imageUrl} style={{width: 250}}></img> : null
                    }
                    <Button disabled={!fullPose || !name || !goals} onClick={handleAddPose}>Add</Button>
                </Stack>
            </Paper>
            {imageUrl? 
                <img ref={imageRef} hidden={false} src={imageUrl} style={{zIndex: -1, position:'absolute', top: 0, left:0, width: 250}}></img> : null
            }
            {resizedImage? 
                <img ref={resizedImageRef} hidden={false} src={resizedImage} style={{zIndex: -1, position:'absolute', top: 0, left:0, width: 250}}></img> : null
            }
        </div>
    )
}