import {List,ListItem,ListItemButton,ListItemIcon,ListItemText,Paper} from "@mui/material";
import InboxIcon from '@mui/icons-material/Inbox';
export default function DisplaySessionOptions({sessions,setChosenSession,setDisplaySessionOptions,cameraRatio}) {
    return (
        <div style={{zIndex:10, position: "absolute", height: "100%", width: "100%", justifyContent: "center", alignItems: "center" , marginLeft: 755, marginTop: 85 / cameraRatio}}>
            <Paper variant='elevation' elevation={10} style={{borderRadius:'7%', backgroundColor:'rgba(255,255,255,0.95)', display: "flex", height: "25%", width: "15%", justifyContent: "center", alignItems: "center"}}>
                <List>
                    {sessions.map((session)=>(
                        <ListItem key={session.name} disablePadding>
                        <ListItemButton onClick = {() => {
                            setChosenSession(session)
                            setDisplaySessionOptions(false)
                        }}>
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary={session.name} />
                        </ListItemButton>
                    </ListItem>
                    ))}
                </List>
            </Paper>
        </div>
    )
}