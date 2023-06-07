import {Paper,FormControl,IconButton,InputLabel, Select,TablePagination, OutlinedInput, MenuItem, Checkbox,ListItemText} from "@mui/material"
import { styled} from '@mui/material/styles';
import {useState} from "react";
import { useNavigate } from "react-router-dom";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../util/api";

export default function SessionsTable({ usersList, handleGoals,goalsProps,goalsNames,handleDeleteUser }) {
    const [page, setPage] = useState(0);
    const rowsPerPage = 4
    const navigate = useNavigate()

    function handleEditUser(user){
        navigate(`/users/${user}`)
    }

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
      <Paper sx={{ width: '90%' }}>
        <TableContainer sx={{ maxHeight:450, alignItems:'center', display:'flex'}}>
            <Table  aria-label="customized table" >
                <TableHead>
                <TableRow>
                    <StyledTableCell sx={{ fontWeight: 'bold'}} align="center">First Name</StyledTableCell>
                    <StyledTableCell sx={{ fontWeight: 'bold'}} align="center">Last Name</StyledTableCell>
                    <StyledTableCell sx={{ fontWeight: 'bold'}} align="center">Role</StyledTableCell>
                    <StyledTableCell sx={{ fontWeight: 'bold'}} align="center">Age</StyledTableCell>
                    <StyledTableCell sx={{ fontWeight: 'bold'}} align="center">Weight</StyledTableCell>
                    <StyledTableCell sx={{ fontWeight: 'bold'}} align="center">Height</StyledTableCell>
                    <StyledTableCell sx={{ fontWeight: 'bold'}} align="center">BMI</StyledTableCell>
                    <StyledTableCell sx={{ fontWeight: 'bold'}} align="center">Edit Profile</StyledTableCell>
                    <StyledTableCell sx={{ fontWeight: 'bold'}} align="center">Delete</StyledTableCell>
                    <StyledTableCell sx={{ fontWeight: 'bold'}} align="center">Edit Goals</StyledTableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {usersList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                    <StyledTableRow key={user.email}>
                    <StyledTableCell sx={{ fontSize: 50}} align="center">{user.name}</StyledTableCell>
                    <StyledTableCell sx={{ fontSize: 50}} align="center">{user.lastName}</StyledTableCell>
                    <StyledTableCell sx={{ fontSize: 14}} align="center">{user.role}</StyledTableCell>
                    <StyledTableCell sx={{ fontSize: 14}} align="center">{user.age}</StyledTableCell>
                    <StyledTableCell sx={{ fontSize: 14}} align="center">{user.weight? user.weight : "-"}</StyledTableCell>
                    <StyledTableCell sx={{ fontSize: 14}} align="center">{user.height? user.height : "-"}</StyledTableCell>
                    <StyledTableCell sx={{ fontSize: 14}} align="center">{user.bmi? Number(user.bmi).toFixed(2) : "-"}</StyledTableCell>
                    <StyledTableCell align="center">
                        <IconButton aria-label="edit" onClick={() => {handleEditUser(user.email)}}>
                            <EditIcon/>
                        </IconButton>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                        <IconButton aria-label="delete" onClick={() => {handleDeleteUser(user._id) }}>
                            <DeleteIcon />
                        </IconButton>
                    </StyledTableCell>
                    {user.role === 'client'? 
                      <StyledTableCell align="center">
                          <FormControl sx={{ m: 1, width: 300 }} >
                              <InputLabel id="demo-multiple-checkbox-label">Goals</InputLabel>
                              <Select
                              labelId="demo-multiple-checkbox-label"
                              id="demo-multiple-checkbox"
                              multiple
                              value={user.goals}
                              onChange={(event) => handleGoals(event.target.value,user.email) }
                              input={<OutlinedInput label="Goals" />}
                              renderValue={(selected) => selected.join(', ')}
                              MenuProps={goalsProps}
                              >
                              {goalsNames.map((goal) => (
                                  <MenuItem key={goal} value={goal}>
                                      <Checkbox checked={user.goals.indexOf(goal) > -1} />
                                  <ListItemText primary={goal} />
                                  </MenuItem>
                              ))}
                              </Select>
                          </FormControl>
                      </StyledTableCell>
                      : <StyledTableCell sx={{ fontSize: 14}} align="center">{"-"}</StyledTableCell>}
                        
                    </StyledTableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
        <TablePagination
        sx={{alignItems:'center', justifyItems:'center', justifyContent:'center', backgroundColor:'rgba(1,1,1,0.23)'}}
        component="div"
        count={usersList.length}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={-1}
        page={page}
        onPageChange={(event, newPage) => {setPage(newPage)}}
        />
      </Paper>
    )
}