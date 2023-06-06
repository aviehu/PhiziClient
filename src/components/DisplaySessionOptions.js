import {List,ListItem,ListItemButton,ListItemIcon,ListItemText,Paper} from "@mui/material";
import InboxIcon from '@mui/icons-material/Inbox';
export default function DisplaySessionOptions({sessions,setChosenSession,setDisplaySessionOptions,cameraRatio}) {
    return (
        <div style={{zIndex:10, position: "absolute", height: "auto", width: "auto", justifyContent: "normal", alignItems: "center" /*, marginLeft: 755, marginTop: 85 / cameraRatio*/}}>
            <Paper variant='elevation' elevation={10} style={{borderRadius:'7%', backgroundColor:'rgba(255,255,255,0.95)', display: "flex", height: "auto", width: "auto", justifyContent: "center", alignItems: "center"}}>
                <List >
                    {sessions.map((session)=> (
                        <ListItem key={session.name} disablePadding>
                        <ListItemButton onClick = {() => {
                            setChosenSession(session)
                            setDisplaySessionOptions(false)
                        }}>
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary={session.name}
                                      secondary={`Description: ${session.description} | Difficulty: ${session.difficulty} | Goals: ${session.goals}`}/>
                        </ListItemButton>
                    </ListItem>
                    ))}
                </List>
            </Paper>
        </div>
    )
}