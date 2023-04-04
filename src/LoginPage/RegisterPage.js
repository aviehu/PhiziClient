import {useState} from "react";
import {Button, Paper, Stack, TextField} from "@mui/material";
import api from "../util/api";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    function handleBack() {
        navigate('/')
    }

    function handleRegister() {
        const response = api.register({email, password})
        if (!response.error) {
            navigate('/app')
        }
    }

    return (
        <div style={{display:"flex", position: "absolute", height: "100%", width: "100%", justifyContent: "center", alignItems: "center"}}>
            <Paper style={{display: "flex", height: "60%", width: "80%", justifyContent: "center", alignItems: "center"}}>
                <Stack style={{textAlign: "center"}} direction="column" spacing={3}>
                    <h1 style={{paddingBottom: 4}}>Register</h1>
                    <TextField label="Email" value={email} onChange={(event) => setEmail(event.target.value)}></TextField>
                    <TextField type={"password"} label="Password" value={password} onChange={(event) => setPassword(event.target.value)}></TextField>
                    <Stack justifyContent={"space-between"} direction="row" spacing={3}>
                        <Button disabled={!email || !password} onClick={handleRegister}>Register</Button>
                        <Button onClick={handleBack}>Back</Button>
                    </Stack>
                </Stack>
            </Paper>
        </div>
    )
}