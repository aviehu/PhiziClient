import React, { useContext,useState, useEffect } from 'react';
import {
    Stack,
    Select,
    FormControl,
    InputLabel,
    MenuItem,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import api from '../util/api';
import UserContext from "../context/UserContext";
import ProgressChart from '../components/ProgressChart';

const CustomizedSelect = styled(Select)`
background-color:  rgba(255,255,255,0.4);
border-color: black;

color: black;
`;

export default function ScoreTable() {
    const { getUser } = useContext(UserContext)
    const user = getUser()
    const [scores, setScores] = useState(null);
    const [users, setUsers] = useState(null);
    const [sessions, setSessions] = useState(null);
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedSession, setSelectedSession] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [filteredScores,setFilteredScores] = useState([]);

    useEffect(() => {
        async function load(){
          if(user.role === 'client'){
            setSelectedUser(user.email)
          }
          else if(user.role === 'admin'){
            const myUsers = await api.getAllUsers()
            setUsers(myUsers)
          }
          else{
            const userName = user.name
            const myUsers = await api.getTherapistUsers({superior: userName})
            setUsers(myUsers)
          }
        }
        load()
    }, []);

    useEffect(() => {
        if (!selectedUser) {
          return
        }
        async function handleSelectUserChange(){
          const userScores = await api.getUserScores(selectedUser)
          setScores(userScores)
          const sessionsSet = new Set()
          userScores.map((score) => sessionsSet.add(score.session))
          setSessions([...sessionsSet])
          console.log("sessions: ", [...sessionsSet])
        }
        handleSelectUserChange()
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
          }).sort((first, second) =>
               new Date(first.date).getTime() - new Date(second.date).getTime()
            )
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
            <Stack style={{width:'50%'}} direction="row" spacing={1}>
            {user && user.role !== 'client'?
              <FormControl fullWidth style={{boxShadow:'1px 1px #999', borderRadius:'5%'}}>
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
            :null}
            
            <FormControl fullWidth style={{boxShadow:'1px 1px #999', borderRadius:'5%'}}>
              <InputLabel id="demo-simple-select-label">Session</InputLabel>
              <CustomizedSelect
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedSession}
                  label= "Session"
                  onChange={(e) => setSelectedSession(e.target.value)}
                  
              >
                  {sessions && sessions.map((session) => (
                      <MenuItem key={session} value={session}>
                          {session}
                      </MenuItem>
                  ))}
              </CustomizedSelect>
            </FormControl>
            <FormControl fullWidth style={{boxShadow:'1px 1px #999', borderRadius:'5%'}}>
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
            <FormControl fullWidth style={{boxShadow:'1px 1px #999', borderRadius:'5%'}}>
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
            <Stack display={'flex'} alignContent={'center'}>
            {filteredScores &&
              <ProgressChart filteredScores={filteredScores}/>
             }
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