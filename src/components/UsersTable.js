import {Paper,FormControl,InputLabel, Select, OutlinedInput, MenuItem, Checkbox,ListItemText} from "@mui/material"
import { styled} from '@mui/material/styles';
import { useState} from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
export default function SessionsTable({ usersList, handleGoals,goalsProps,goalsNames }) {

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
        <TableContainer component={Paper} sx={{ width: '90%'}}>
            <Table  aria-label="customized table" height='100%' width='80%'>
                <TableHead>
                <TableRow>
                    <StyledTableCell sx={{ fontWeight: 'bold'}} align="center">Name</StyledTableCell>
                    <StyledTableCell sx={{ fontWeight: 'bold'}} align="center">Age</StyledTableCell>
                    <StyledTableCell sx={{ fontWeight: 'bold'}} align="center">Weight</StyledTableCell>
                    <StyledTableCell sx={{ fontWeight: 'bold'}} align="center">Height</StyledTableCell>
                    <StyledTableCell sx={{ fontWeight: 'bold'}} align="center">BMI</StyledTableCell>
                    <StyledTableCell sx={{ fontWeight: 'bold'}} align="center">Edit goals</StyledTableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {usersList.map((user) => (
                    <StyledTableRow key={user.email}>
                    <StyledTableCell sx={{ fontSize: 50}} align="center">{user.name}</StyledTableCell>
                    <StyledTableCell sx={{ fontSize: 14}} align="center">{user.age}</StyledTableCell>
                    <StyledTableCell sx={{ fontSize: 14}} align="center">{user.weight}</StyledTableCell>
                    <StyledTableCell sx={{ fontSize: 14}} align="center">{user.height}</StyledTableCell>
                    <StyledTableCell sx={{ fontSize: 14}} align="center">{Number(user.bmi).toFixed(2)}</StyledTableCell>
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
                        
                    </StyledTableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}