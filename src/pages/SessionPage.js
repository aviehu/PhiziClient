import { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import api from "../util/api";
import SessionsTable from "../components/SessionsTable";

export default function SessionPage() {
    const [sessions, setSessions] = useState(null)

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
            {
                sessions ?
                    <SessionsTable sessions={sessions} handleDelete={handleDelete}/> :
                    <CircularProgress />
            }
        </div>
    );
}
