import {Button, Paper, Stack} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {

    const navigate = useNavigate()

    function handlePoses() {
            navigate('/poses')
        
    }

    function handleTrainings() {
        navigate('/sessions')
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