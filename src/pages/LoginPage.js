import { createContext, useState } from "react";
import { Button, Paper, Stack, TextField } from "@mui/material";
import api from "../util/api";
import { useNavigate } from "react-router-dom";

export const curUser = createContext("batya")

export default function LoginPage() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    async function handleLogin() {
        const response = await api.login({ email, password })
        if (!response.error) {
            console.log(curUser)
            navigate('/app')
            return
        }
        alert(response.error)
    }

    function handleRegister() {
        navigate('/register')
    }
    function handleAdmin() {
        navigate('/admin')
    }

    return (
        <div style={{ display: "flex", position: "absolute", height: "100%", width: "100%", justifyContent: "center", alignItems: "center" }}>
            <Paper style={{ display: "flex", height: "60%", width: "60%", justifyContent: "center", alignItems: "center" }}>
                <Stack style={{ textAlign: "center" }} direction="column" spacing={3}>
                    <h1 style={{ paddingBottom: 4 }}>Login</h1>
                    <curUser.Provider value={email}>
                        <TextField label="Email" value={email} onChange={(event) => setEmail(event.target.value)}></TextField>
                    </curUser.Provider>
                    <TextField type={"password"} label="Password" value={password} onChange={(event) => setPassword(event.target.value)}></TextField>
                    <Stack justifyContent={"space-between"} direction="row" spacing={3}>
                        <Button onClick={handleRegister}>Register</Button>
                        <Button onClick={handleAdmin}>Im admin</Button>
                    </Stack>
                </Stack>
            </Paper>
        </div>
    )
}