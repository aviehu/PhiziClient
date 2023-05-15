import {Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function SessionsTable({ sessions, handleDelete }) {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Difficulty</TableCell>
                        <TableCell>Goals</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sessions ? sessions.map((session) => (
                        <TableRow key={session._id}>
                            <TableCell>{session.name}</TableCell>
                            <TableCell>{session.description}</TableCell>
                            <TableCell>{session.difficulty}</TableCell>
                            <TableCell>{session.goals}</TableCell>
                            <TableCell>
                                <Stack direction={'row'} spacing={4}>
                                    <Button variant={'contained'} endIcon={<EditIcon/>}> Edit </Button>
                                    <Button variant={'contained'} endIcon={<DeleteIcon/>} onClick={() => {
                                        handleDelete(session._id)
                                    }}> Delete </Button>
                                </Stack>
                            </TableCell>
                        </TableRow>
                    )) : []}
                </TableBody>
            </Table>
        </TableContainer>
    )
}