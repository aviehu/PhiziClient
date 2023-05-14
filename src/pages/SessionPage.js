import { useState, useEffect } from "react";
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../util/api";

export default function SessionPage() {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const response = await api.getAllSessions();
            if (response.error) {
                alert(response.error);
                return;
            }
            setSessions(response.data);
        }
        fetchData();
    }, []);

    async function handleDelete(id) {
        const response = await api.deleteSession(id);
        if (response.error) {
            alert(response.error);
            return;
        }
        setSessions((prevSessions) =>
            prevSessions.filter((session) => session._id !== id)
        );
    }

    function handleEdit(id) {
        navigate(`/edit-session/${id}`);
    }

    function handleAdd() {
        navigate("/add-session");
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h1 style={{ paddingBottom: 16 }}>Sessions</h1>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Difficulty</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sessions ? sessions.map((session) => (
                            <TableRow key={session._id}>
                                <TableCell>{session.name}</TableCell>
                                <TableCell>{session.description}</TableCell>
                                <TableCell>{session.difficulty}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleEdit(session._id)}>
                                        Edit
                                    </Button>
                                    <Button onClick={() => handleDelete(session._id)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )) : []}
                    </TableBody>
                </Table>
            </TableContainer>
            <Button onClick={handleAdd}>Add Session</Button>
        </div>
    );
}
