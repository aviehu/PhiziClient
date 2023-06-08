import { useState, useEffect } from "react";
import {Button, CircularProgress, Stack, IconButton,Tooltip} from "@mui/material";
import api from "../util/api";
import SessionsTable from "../components/SessionsTable";
import AddSession from "../components/AddSession";
import EditSession from "../components/EditSession";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { styled } from '@mui/material/styles';

const CustomizedButton = styled(Button)`
`;

export default function SessionPage() {
    const [sessions, setSessions] = useState(null)
    const [openAddSession, setOpenAddSession] = useState(false)
    const [editSession, setEditSession] = useState(null)

    async function load() {
        const sessions = await api.getAllSessions()
        setSessions(sessions)
    }

    useEffect(() => {
        load()
    }, [])

    async function handleDelete(id) {
        await api.deleteSession(id)
        await load()
    }

    return (
        <div style={{ display: "flex", position: "absolute", height: "80%", width: "100%", justifyContent: "center", alignItems:'center',marginTop:'7%'}}>
            <Stack spacing={2} style={{height:'100%', width:'75%'}}>
                <Stack style={{alignItems:'flex-end'}}>
                <Tooltip title="add new session">
                    <IconButton variant="contained" aria-label="add session" onClick={()=> setOpenAddSession(true)} size='large' sx={{boxShadow: 'rgba(0, 0, 0, 0.24) 1px 3px 8px', backgroundColor:'rgba(255,255,255,0.8)',borderRadius:'30%'}}>
                                    <AddRoundedIcon />
                    </IconButton>
                </Tooltip>
                </Stack>
                {
                    openAddSession ?
                        <AddSession
                            loadSessions={load}
                            openAddSession={openAddSession}
                            setOpenAddSession={setOpenAddSession}
                        /> :
                        null
                }
                {
                    editSession ?
                        <EditSession
                            loadSessions={load}
                            editSession={editSession}
                            setEditSession={setEditSession}
                        /> :
                        null
                }
                {
                    sessions?
                        <SessionsTable sessions={sessions} handleDelete={handleDelete} setEditSession={setEditSession}/> :
                        <CircularProgress />
                }
            </Stack>
        </div>
    );
}
