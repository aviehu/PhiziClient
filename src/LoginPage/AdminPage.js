import {useState} from "react";
import {Button, Paper, Stack, TextField} from "@mui/material";
import api from "../util/api";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {

    // const [email, setEmail] = useState("")
    // const [password, setPassword] = useState("")

    const navigate = useNavigate()

    function handlePoses() {
            navigate('/poses')
        
    }

    function handleTrainings() {
        navigate('/trainings')
    }
    function handleDisplayUsers() {
        navigate('/users')
    }

    return (
        <div style={{display:"flex", position: "absolute", height: "100%", width: "100%", justifyContent: "center", alignItems: "center"}}>
            <Paper style={{display: "flex", height: "60%", width: "60%", justifyContent: "center", alignItems: "center"}}>
                <Stack style={{textAlign: "center"}} direction="column" spacing={3}>
                    <Button onClick={handlePoses}>Poses</Button>
                    <Button onClick={handleTrainings}>Trainings</Button>
                    <Button onClick={handleDisplayUsers}>Display Users</Button>
                </Stack>
            </Paper>
        </div>
    )
}