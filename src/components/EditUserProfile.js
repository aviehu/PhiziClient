import {useContext, useState, useEffect} from "react";
import {Button,Paper,Stack,TextField,Slider,Typography,Slide,Snackbar,Alert} from "@mui/material";
import api from "../util/api";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

export default function EditUserProfile() {
    const delay = ms => new Promise(res => setTimeout(res, ms));
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [age, setAge] = useState("")
    const [height, setHeight] = useState(0)
    const [weight, setWeight] = useState(0)
    const [openSnackBar, setOpenSnackBar] = useState(false)
    const { user } = useContext(UserContext)

    const navigate = useNavigate()

    const handleEditProfile = async () => {
        const bmi = weight / (height / 100)
        const response = api.updateUser({ name, email, age, weight, height, bmi })
        if (!response.error) {
            setOpenSnackBar(true)
            await delay(2000); 
            navigate('/')
        }
    }

    function valueLabelFormat(value) {
        return `${value} cm`;
    }

    function TransitionRight(props) {
        return <Slide {...props} direction="right" />;
    }

    useEffect(() => {
        async function load() {
            setName(user.name)
            setAge(user.age)
            setEmail(user.email)
            setHeight(user.height)
            setWeight(user.weight)
        }
        load()
    }, [])

    return (
        <div style={{ display: "flex", position: "absolute", height: "100%", width: "100%", justifyContent: "center", alignItems: "center" }}>
            <Snackbar
                autoHideDuration={4000}
                open={openSnackBar}
                onClose={() => {setOpenSnackBar(false)}}
                TransitionComponent={TransitionRight}
                key={'snackBar'}
            >
                <Alert onClose={() => setOpenSnackBar(false)} severity="success" sx={{ width: '100%' }}>
                    Profile saved successfully
                </Alert>
            </Snackbar>
            <Paper variant='elevation' elevation={10} style={{borderRadius:'5%', backgroundColor:'rgba(255,255,255,0.95)', display: "flex", height: "80%", width: "60%", justifyContent: "center", alignItems: "center" }}>
                <Stack style={{ textAlign: "center" }} direction="column" spacing={3}>
                    <h1 style={{ paddingBottom: 4 }}>Edit Profile</h1>
                    <Stack direction={'row'} spacing={3}>
                        <TextField key="Name" label="Name" value={name} onChange={(event) => setName(event.target.value)}></TextField>
                        <TextField key="age" label="Age" value={age} onChange={(event) => setAge(event.target.value)}></TextField>
                    </Stack>
                    <Stack direction={'row'} spacing={3}>
                        <TextField key="weight" label="Weight" value={weight} onChange={(event) => setWeight(event.target.value)}></TextField>
                    </Stack>
                    <Stack style={{ textAlign: "center" }} direction="row" spacing={2}>
                        <Typography>
                            Height:
                        </Typography>
                        <Slider
                            value={height}
                            min={30}
                            step={1}
                            max={250}
                            getAriaValueText={valueLabelFormat}
                            valueLabelFormat={valueLabelFormat}
                            onChange={(event) => setHeight(event.target.value)}
                            valueLabelDisplay="auto"
                        />
                    </Stack>
                    <Stack alignItems={'center'}>
                        <Button disabled={!name || !height || !weight} onClick={() => {
                        handleEditProfile()
                        }}>Save</Button>
                    </Stack>
                </Stack>
            </Paper>
        </div>
    )
}