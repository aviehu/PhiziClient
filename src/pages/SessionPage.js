import { useState, useEffect } from "react";
import {Button, CircularProgress} from "@mui/material";
import api from "../util/api";
import SessionsTable from "../components/SessionsTable";
import AddSession from "../components/AddSession";

export default function SessionPage() {
    const [sessions, setSessions] = useState(null)
    const [openAddSession, setOpenAddSession] = useState(false)

    async function load() {
        const sessions = await api.getAllSessions()
        console.log(sessions)
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
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding:50}}>
            <Button variant={'contained'} onClick={() => setOpenAddSession(true)}>Add Session</Button>
            {
                openAddSession ?
                    <AddSession loadSessions={load} openAddSession={openAddSession} setOpenAddSession={setOpenAddSession}/> : null
            }
            {
                sessions ?
                    <SessionsTable sessions={sessions} handleDelete={handleDelete}/> :
                    <CircularProgress />
            }
        </div>
    );
}
