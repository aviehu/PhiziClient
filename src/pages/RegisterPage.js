import {useContext, useState} from "react";
import {
    Button,
    Paper,
    Stack,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Slide,
    Snackbar,
    Alert
} from "@mui/material";
import api from "../util/api";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

export default function RegisterPage() {
    const delay = ms => new Promise(res => setTimeout(res, ms));
    const [openBMI,setOpenBMI] = useState(false)
    const [openSnackBar, setOpenSnackBar] = useState(false)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [age, setAge] = useState("")
    const [height, setHeight] = useState(null)
    const [weight, setWeight] = useState(null)
    const [role, setRole] = useState()
    const { getUser } = useContext(UserContext)
    const user = getUser()

    const navigate = useNavigate()

    function handleBack() {
        navigate('/')
    }

    function TransitionRight(props) {
        return <Slide {...props} direction="right" />;
    }

    const handleRegister = async () => {
        const bmi = weight / (height / 100)
        const goals = []
        const superior = user.name
        const response = api.register({ name: firstName, lastName, email, password, age, weight, height, goals, bmi, role, superior})
        if (!response.error) {
            setOpenSnackBar(true)
            await delay(2000); 
            navigate('/')
        }
    }

    function valueLabelFormat(value) {
        return `${value} cm`;
    }

    return (
        <div style={{ display: "flex", position: "absolute", height: "80%", width: "100%", justifyContent: "center", alignItems: "center",marginTop:'4%'}}>
            <Snackbar
                autoHideDuration={4000}
                open={openSnackBar}
                onClose={() => {setOpenSnackBar(false)}}
                TransitionComponent={TransitionRight}
                key={'snackBar'}
            >
                <Alert onClose={() => setOpenSnackBar(false)} severity="success" sx={{ width: '100%' }}>
                    User added successfully
                </Alert>
            </Snackbar>
            <Paper variant='elevation' elevation={10} style={{ borderRadius:'5%', display: "flex", height: "80%", width: "50%", backgroundColor:'rgba(255,255,255,0.95)', justifyContent: "center", alignItems: "center"}}>
                <Stack style={{ alignItems:'center'}} direction="column" spacing={3}>
                    <h1 style={{  backgroundColor: "rgba(0,0,0,0.12)", borderRadius:4, width:'45%',textAlign:'center', color:'rgba(0,0,1,0.5)', boxShadow:'1px 2px 4px #999'}}>Register</h1>
                    <Stack direction={'row'} spacing={3}>
                        <TextField key="Email" label="Email" value={email} onChange={(event) => setEmail(event.target.value)} style={{boxShadow:'1px 1px #999', borderRadius:'5%'}}></TextField>
                        <TextField key="password" type={"password"} label="Password" value={password} onChange={(event) => setPassword(event.target.value)} style={{boxShadow:'1px 1px #999', borderRadius:'5%'}}></TextField>
                    </Stack>
                    <Stack direction={'row'} spacing={3}>
                        <TextField key="firstName" label="First Name" value={firstName} onChange={(event) => setFirstName(event.target.value)} style={{boxShadow:'1px 1px #999', borderRadius:'5%'}}></TextField>
                        <TextField key="lastName" label="Last Name" value={lastName} onChange={(event) => setLastName(event.target.value)} style={{boxShadow:'1px 1px #999', borderRadius:'5%'}}></TextField>
                    </Stack>
                    <Stack direction={'row'} spacing={3} style={{width:'100%'}}>
                    <TextField key="age" label="Age" value={age} onChange={(event) => setAge(event.target.value)} fullWidth style={{boxShadow:'1px 1px #999', borderRadius:'5%'}}></TextField>
                    {
                            user && (user.role === 'admin' || user.role === 'therapist') ?
                                <FormControl fullWidth style={{boxShadow:'1px 1px #999', borderRadius:'5%'}}>
                                    <InputLabel id="demo-simple-select-label">Role</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select-role"
                                        value={role}
                                        label="Age"
                                        onChange={(event) => { 
                                            const chosenRole = event.target.value
                                            setRole(chosenRole)
                                            if(chosenRole === 'client'){
                                                setOpenBMI(true)
                                            }
                                            else{
                                                setOpenBMI(false)
                                                setHeight(null)
                                                setWeight(null)
                                            }
                                            }}
                                        >
                                        {user.role === 'admin' ? 
                                        <MenuItem value={'admin'}>Admin</MenuItem>
                                        : null}
                                        <MenuItem value={'therapist'}>Therapist</MenuItem>
                                        <MenuItem value={'client'}>Client</MenuItem>
                                    </Select>
                                </FormControl> :
                                null
                        }
                    </Stack>
                    {openBMI?
                        <Stack direction={'row'} spacing={3}>
                        <TextField key="weight" label="Weight (Kg)" value={weight} onChange={(event) => setWeight(event.target.value)}></TextField>
                        <TextField key="height" label="Height (Cm)" value={height} onChange={(event) => setHeight(event.target.value)}></TextField>
                    </Stack>
                    :null}
                    <Stack justifyContent={"space-between"} direction="row" spacing={3}>
                        <Button disabled={!firstName || !lastName || !email || !password} onClick={handleRegister}>Register</Button>
                        <Button onClick={handleBack}>Back</Button>
                    </Stack>
                </Stack>
            </Paper>
        </div>
    )
}