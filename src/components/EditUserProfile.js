import {useContext, useState, useEffect} from "react";
import {Button,Paper,Stack,TextField,MenuItem,FormControl,InputLabel,Select,Typography,Slide,Snackbar,Alert} from "@mui/material";
import api from "../util/api";
import { useNavigate, useParams } from "react-router-dom";
import UserContext from "../context/UserContext";

export default function EditUserProfile() {
    const {userEmail} = useParams()
    const delay = ms => new Promise(res => setTimeout(res, ms));
    const [name, setName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [age, setAge] = useState("")
    const [role, setRole] = useState("")
    const [openBMI, setOpenBMI] = useState(false)
    const [height, setHeight] = useState(0)
    const [weight, setWeight] = useState(0)
    const [openSnackBar, setOpenSnackBar] = useState(false)
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    const handleEditProfile = async () => {
        const bmi = weight / (height / 100)
        const response = api.updateUser({ name, lastName, email, age, weight, height, bmi })
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
            const user = await api.getUser(userEmail)
            setUser(user)
            setName(user.name)
            setLastName(user.lastName)
            setAge(user.age)
            setEmail(user.email)
            setHeight(user.height)
            setWeight(user.weight)
            setRole(user.role)
            if(user.role === 'client'){
                setOpenBMI(true)
            }
        }
        load()
    }, [])

    return (
        <div style={{ display: "flex", position: "absolute", height: "80%", width: "100%", justifyContent: "center", alignItems: "center", marginTop:'4%' }}>
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
            <Paper variant='elevation' elevation={10} style={{borderRadius:'5%', backgroundColor:'rgba(255,255,255)', display: "flex", height: "80%", width: "47%", justifyContent: "center", alignItems: "center"}}>
                <Stack direction="column" spacing={4}>
                    <Stack style={{alignItems:'center'}}>
                    <h1 style={{  backgroundColor: "rgba(0,0,0,0.12)", borderRadius:4, width:'40%',textAlign:'center', color:'rgba(0,0,1,0.5)', boxShadow:'1px 2px 4px #999'}}>Edit Profile</h1>
                    </Stack>
                    
                    <Stack direction={'row'} spacing={3}>
                        <TextField key="firstName" label="First Name" value={name} onChange={(event) => setName(event.target.value)} style={{boxShadow:'1px 1px #999', borderRadius:'5%'}}></TextField>
                        <TextField key="lastName" label="Last Name" value={lastName} onChange={(event) => setLastName(event.target.value)} style={{boxShadow:'1px 1px #999', borderRadius:'5%'}}></TextField>
                    </Stack>
                    {openBMI && 
                    <Stack direction={'row'} spacing={3}>
                        <TextField key="weight" label="Weight (Kg)" value={weight} onChange={(event) => setWeight(event.target.value)} style={{boxShadow:'1px 1px #999', borderRadius:'5%'}}></TextField>
                        <TextField key="height" label="Height (Cm)" value={height} onChange={(event) => setHeight(event.target.value)} style={{boxShadow:'1px 1px #999', borderRadius:'5%'}}></TextField>
                    </Stack>
                    }
                    <Stack  direction={'row'} spacing={3}>
                        <TextField fullWidth key="age" label="Age" value={age} onChange={(event) => setAge(event.target.value)} style={{boxShadow:'1px 1px #999', borderRadius:'5%'}}></TextField>
                        <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Role</InputLabel>
                                    <Select
                                        style={{boxShadow:'1px 1px #999', borderRadius:'5%'}}
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
                                        {user && user.role === 'admin' ? 
                                        <MenuItem value={'admin'}>Admin</MenuItem>
                                        : null}
                                        <MenuItem value={'therapist'}>Therapist</MenuItem>
                                        <MenuItem value={'client'}>Client</MenuItem>
                                    </Select>
                                </FormControl>
                    </Stack>
                    
                    <Stack alignItems={'center'}>
                        <Button disabled={!name} onClick={() => {
                        handleEditProfile()
                        }}>Save</Button>
                    </Stack>
                </Stack>
            </Paper>
        </div>
    )
}