import {IconButton, Paper, Stack} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export default function SessionsTable({ sessions, handleDelete, setEditSession }) {

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: theme.palette.common.black,
          color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
          fontSize: 14,
        },
      }));

      const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
          border: 0,
        },
      }));

    return (
        <TableContainer component={Paper} style={{width:'100%',overflow:'auto'}}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">Name</StyledTableCell>
                            <StyledTableCell align="center">Description</StyledTableCell>
                            <StyledTableCell align="center">Difficulty</StyledTableCell>
                            <StyledTableCell align="center">Goals</StyledTableCell>
                            <StyledTableCell align="center">Edit</StyledTableCell>
                            <StyledTableCell align="center">Delete</StyledTableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {sessions.map((session) => (
                            <StyledTableRow key={session.name}>
                            <StyledTableCell align="center">{session.name}</StyledTableCell>
                            <StyledTableCell align="center">{session.description}</StyledTableCell>
                            <StyledTableCell align="center">{session.difficulty}</StyledTableCell>
                            <StyledTableCell align="center">{session.goals}</StyledTableCell>
                            {/* <StyledTableCell align="right"><Button variant={'contained'} endIcon={<EditIcon/>} onClick={() => {setEditSession(session)}}> </Button></StyledTableCell>
                            <StyledTableCell align="right"><Button variant={'contained'} endIcon={<DeleteIcon/>} onClick={() => {handleDelete(session._id) }}></Button></StyledTableCell> */}
                            <StyledTableCell align="center">
                                <IconButton aria-label="edit" onClick={() => {setEditSession(session)}}>
                                    <EditIcon/>
                                </IconButton>
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                <IconButton aria-label="delete" onClick={() => {handleDelete(session._id) }}>
                                    <DeleteIcon />
                                </IconButton>
                            </StyledTableCell>
                                
                            </StyledTableRow>
                        ))}
                        </TableBody>
                        
                    </Table>
                </TableContainer>
    )
}