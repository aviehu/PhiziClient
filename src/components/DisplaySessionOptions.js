import {ToggleButtonGroup,Paper,ToggleButton,Stack} from "@mui/material";

export default function DisplaySessionOptions({sessions,setChosenSession,setDisplaySessionOptions}) {
    return (
        <div style={{zIndex:10, display: "flex", position: "absolute", height: "100%", width: "100%", justifyContent: "center", alignItems: "center" }}>
            <Paper variant='elevation' elevation={10} style={{borderRadius:'5%', backgroundColor:'rgba(255,255,255,0.95)', display: "flex", height: "55%", width: "45%", justifyContent: "center", alignItems: "center"}}>
                <Stack style={{ alignItems: "center" , heigt:'100%', width:'100%'}} direction="column" spacing={3}>
                    <h1>Choose session:</h1>
                    <ToggleButtonGroup
                    color="primary"
                    exclusive
                    aria-label="Platform"
                    orientation="vertical"
                    spacing={3}
                    >
                    {sessions.map((session) => (<ToggleButton key={session.name} value={session.name} onClick={() => 
                    {setChosenSession(session)
                    setDisplaySessionOptions(false)}
                    }>{session.name+" "+session.difficulty}</ToggleButton> ))}
                    </ToggleButtonGroup>
                </Stack>
            </Paper>
        </div>
    )
}