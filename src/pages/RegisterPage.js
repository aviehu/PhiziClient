import {useContext, useState} from "react";
import {
    Button,
    Paper,
    Stack,
    TextField,
    Slider,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";
import api from "../util/api";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

export default function RegisterPage() {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [age, setAge] = useState()
    const [height, setHeight] = useState()
    const [weight, setWeight] = useState()
    const [role, setRole] = useState()
    const { user } = useContext(UserContext)

    const navigate = useNavigate()

    function handleBack() {
        navigate('/')
    }

    function handleRegister() {
        const bmi = weight / (height / 100)
        const goals = []
        const response = api.register({ name, email, password, age, weight, height, goals, bmi })
        if (!response.error) {
            navigate('/app')
        }
    }

    function valueLabelFormat(value) {
        return `${value} cm`;
    }

    return (
        <div style={{ display: "flex", position: "absolute", height: "100%", width: "100%", justifyContent: "center", alignItems: "center" }}>
            <Paper style={{ display: "flex", height: "80%", width: "60%", justifyContent: "center", alignItems: "center" }}>
                <Stack style={{ textAlign: "center" }} direction="column" spacing={3}>
                    <h1 style={{ paddingBottom: 4 }}>Register</h1>
                    <Stack direction={'row'} spacing={3}>
                        <TextField key="Email" label="Email" value={email} onChange={(event) => setEmail(event.target.value)}></TextField>
                        <TextField key="password" type={"password"} label="Password" value={password} onChange={(event) => setPassword(event.target.value)}></TextField>
                    </Stack>
                    <Stack direction={'row'} spacing={3}>
                        <TextField key="Name" label="Name" value={name} onChange={(event) => setName(event.target.value)}></TextField>
                        <TextField key="age" label="Age" value={age} onChange={(event) => setAge(event.target.value)}></TextField>
                    </Stack>
                    <Stack direction={'row'} spacing={3}>
                        <TextField key="weight" label="Weight" value={weight} onChange={(event) => setWeight(event.target.value)}></TextField>
                        {
                            user.role === 'admin' ?
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Role</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select-role"
                                        value={role}
                                        label="Age"
                                        onChange={(event) => { setRole(event.target.value)}}
                                    >
                                        <MenuItem value={'admin'}>Admin</MenuItem>
                                        <MenuItem value={'therapist'}>Therapist</MenuItem>
                                    </Select>
                                </FormControl> :
                                null
                        }
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
                    <Stack justifyContent={"space-between"} direction="row" spacing={3}>
                        <Button disabled={!name || !email || !password} onClick={handleRegister}>Register</Button>
                        <Button onClick={handleBack}>Back</Button>
                    </Stack>
                </Stack>
            </Paper>
        </div>
    )
}