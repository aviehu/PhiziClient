import { useContext, useState } from "react";
import { Button, Paper, Stack, TextField } from "@mui/material";
import api from "../util/api";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../hooks/UserProvider";

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const {setUser} = useContext(UserContext)
    const navigate = useNavigate()

    async function handleLogin() {
        const response = await api.login({ email, password })
        if (!response.error) {
            setUser(email)
            navigate('/app')
            return
        }
        alert(response.error)
    }

    function handleRegister() {
        navigate('/register')
    }

    return (
        <div style={{ display: "flex", position: "absolute", height: "100%", width: "100%", justifyContent: "center", alignItems: "center" }}>
            <Paper style={{ display: "flex", height: "60%", width: "60%", justifyContent: "center", alignItems: "center" }}>
                <Stack style={{ textAlign: "center" }} direction="column" spacing={3}>
                    <h1 style={{ paddingBottom: 4 }}>Login</h1>
                    <TextField label="Email" value={email} onChange={(event) => setEmail(event.target.value)}></TextField>
                    <TextField type={"password"} label="Password" value={password} onChange={(event) => setPassword(event.target.value)}></TextField>
                    <Stack justifyContent={"space-between"} direction="row" spacing={3}>
                        <Button onClick={handleLogin}>Login</Button>
                        <Button onClick={handleRegister}>Register</Button>
                    </Stack>
                </Stack>
            </Paper>
        </div>
    )
}