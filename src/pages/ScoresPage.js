import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Stack,
    Select,
    FormControl,
    InputLabel,
    MenuItem, TablePagination,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import api from '../util/api';

const CustomizedSelect = styled(Select)`
background-color:  rgba(255,255,255,0.14);
border-color: black;

color: black;
`;

export default function ScoreTable() {
    const [scores, setScores] = useState(null);
    const [users, setUsers] = useState(null);
    const [sessions, setSessions] = useState(null);
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedSession, setSelectedSession] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [filteredScores,setFilteredScores] = useState([]);

    const handleChangePage = (newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        api.getAllScores().then((data) => setScores(data));
        api.getAllUsers().then((data) => setUsers(data));
        api.getAllSessions().then((data) => setSessions(data));
    }, []);

    useEffect(() => {
        if (!selectedUser) {
          return
        }
        async function handleSelectUserChange(){
          const userScores = await api.getUserScores(selectedUser)
          setScores(userScores)
        }
        handleSelectUserChange()
        setPage(0);
    }, [selectedUser]);

    useEffect(() =>{
      if(scores){
        const filtered = scores.filter((score) => {
          if (!selectedMonth && !selectedYear && !selectedSession) return true;
          const scoreDate = new Date(score.date);
          if (selectedMonth && scoreDate.getMonth() !== parseInt(selectedMonth)) return false;
          if (selectedYear && scoreDate.getFullYear() !== parseInt(selectedYear)) return false;
          if(selectedSession && score.session !== selectedSession) return false
          return true;
      });
        setFilteredScores(filtered)
      }
    },[scores,selectedMonth,selectedYear,selectedSession])
    

    const columns = [
        { id: 'user', label: 'User'},
        { id: 'session', label: 'Session'},
        { id: 'duration', label: 'Duration (Sec)'},
        { id: 'date', label: 'Date'}
    ];

    return (
        <div style={{ display: "flex", position: "absolute", height: "100%", width: "100%",justifySelf:'center' , alignItems:'center' }}>
          <Stack style={{ alignItems: "center",width:'100%'}} direction="column" spacing={3}>
            <Stack style={{ width:'50%'}} direction="row" spacing={1}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">User</InputLabel>
              <CustomizedSelect
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedUser}
                  label="User"
                  onChange={(e) => setSelectedUser(e.target.value)}
                  displayEmpty

              >
                  {users && users.map((user) => (
                      <MenuItem key={user.name} value={user.email}>
                          {user.name}
                      </MenuItem>
                  ))}
              </CustomizedSelect>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Session</InputLabel>
              <CustomizedSelect
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedSession}
                  label= "Session"
                  onChange={(e) => setSelectedSession(e.target.value)}
                  
              >
                  {sessions && sessions.map((session) => (
                      <MenuItem key={session.name} value={session.name}>
                          {session.name}
                      </MenuItem>
                  ))}
              </CustomizedSelect>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Year</InputLabel>
              <CustomizedSelect
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label = "Year"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
              >
                  {scores && [...new Set(scores.map((score) => new Date(score.date).getFullYear()))].map(
                      (year) => (
                          <MenuItem key={year} value={year}>
                              {year}
                          </MenuItem>
                      )
                  )}
              </CustomizedSelect>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Month</InputLabel>
            <CustomizedSelect
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
            >
                {Array.from({ length: 12 }, (_, i) => (
                    <MenuItem key={i} value={i}>
                        {new Date(0, i).toLocaleString('en-us',{month:'long'})}
                    </MenuItem>
                ))}
            </CustomizedSelect>
            </FormControl>
            </Stack>
            <Stack>
            {filteredScores &&
             <LineChart width={650} height={350} data={filteredScores}>
                <XAxis dataKey="date"
                       stroke='rgba(255,255,255,0.8)'
                       tickFormatter={(date) => new Date(date).toLocaleDateString()}/>
                <YAxis stroke='rgba(255,255,255,0.8)' />
                <CartesianGrid strokeDasharray="3 3" stroke='rgba(255,255,255,0.9)' fill='rgba(255,255,255,0.7)'/>
                <Tooltip wrapperStyle={{color: 'black'}} />
                <Line type="monotone" dataKey="duration" stroke="#CB67D4" strokeWidth={3} dot={{ fill: '#FFFFFF', strokeWidth: 2 }} />
            </LineChart>}
          </Stack>
            </Stack>
        </div>
    );
};
{/* <Paper sx={{ width: '100%' }}>
                <TableContainer component={Paper}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align="center"
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {scores && scores.map((score) => (
                                <TableRow key={score._id}>
                                    <TableCell align="center">{score.user}</TableCell>
                                    <TableCell align="center">{score.session}</TableCell>
                                    <TableCell align="center">{score.duration}</TableCell>
                                    <TableCell align="center">{new Date(score.date).toLocaleDateString()}</TableCell>
                                </TableRow>
                            )).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                        </TableBody>
                    </Table>
                </TableContainer>
                {scores && <TablePagination
                    rowsPerPageOptions={[5, 10]}
                    component="div"
                    count={scores.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />}
            </Paper> */}