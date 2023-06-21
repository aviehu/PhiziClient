import React, { useContext,useState, useEffect } from 'react';
import {
    Stack,
    Select,
    FormControl,
    InputLabel,
    MenuItem,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,CartesianGrid} from 'recharts';
import api from '../util/api';
import UserContext from "../context/UserContext";
import ProgressChart from '../components/ProgressChart';


const CustomizedSelect = styled(Select)`
background-color:  rgba(255,255,255,0.4);
border-color: black;

color: black;
`;

export default function ScoreTable() {
    const allGoals = ["Shoulders", "Legs", "Upper Body"]
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
    const [goalsData, setGoalsData] = useState(null)

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
          userScores.map((score) =>{
              if(score.session && score.session.name) {
                  sessionsSet.add(score.session.name)
              }
            })
          setSessions([...sessionsSet])
          const myGoalsData = allGoals.map((goal)=>{
            const cur = userScores.reduce((acc,curSession)=>{
                console.log("curSess",curSession)
                console.log("goal", goal)
                if(curSession.session && curSession.session.goals && curSession.session.goals.includes(goal)){
                    acc.count += 1
                }
                return {subject: goal, count: acc.count}
            
            },{subject: goal, count: 0})

            return cur
          })
          setGoalsData(myGoalsData)
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
          if(selectedSession && score.session && score.session.name !== selectedSession) return false
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
            <Stack direction='row' display={'flex'} alignContent={'center'}>
            {filteredScores &&
              <ProgressChart filteredScores={filteredScores}/>
              
             }
             {goalsData &&
                <RadarChart  width={180} height={150} data={goalsData} >
                    <PolarGrid stroke="#853b8c" fill='rgba(255,255,255,0.7)' />
                    <CartesianGrid strokeDasharray="3 3" stroke='rgba(255,255,255,0.9)' fill='rgba(255,255,255,0.7)'/>
                    <PolarAngleAxis dataKey="subject" stroke="#853b8c" />
                    <PolarRadiusAxis angle={30} domain={[0, 20]} stroke="#853b8c"  />
                    <Radar name={selectedUser} dataKey="count" stroke="#963e9e" fill="#CB67D4" fillOpacity={0.7} />
                    <Legend />
                </RadarChart>
             
             }
             
            </Stack>
        </Stack>
        </div>
    );
};
