import { useState, useEffect} from "react";
import { Divider, ListItemText, List,ListItem,ListItemSecondaryAction,Stack, Paper, FormControl, OutlinedInput,MenuItem, Checkbox, InputLabel, Select, Avatar, ListItemAvatar, Button } from "@mui/material";
import api from "../util/api";
import userLogo from "../person.png";


const ITEM_HEIGHT = 48
    const ITEM_PADDING_TOP = 8

    const goalsNames = ['Upper Body', 'Legs', 'Shoulders'];
    const goalsNamesMatch = {'Upper Body': 'UPPER_BODY',
                             'Legs': 'LEGS',
                             'Shoulders': 'Shoulders'  }
    const goalsProps = {
        PaperProps: {
          style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
          },
        },
      }
    //   const handleGoalChange = async (event,email) => {
    //     const values = event.target.value
        
    //     return values
    // }

function DisplayUsers({usersList, handleGoals}) {
        return (
            <Stack direction="column" spacing={3} style={{ justifyContent: "center", alignItems: "center"}}>
                {usersList? usersList.map((user) => { 
                return(
                <Paper key={user.name} spacing={3} direction="column" style={{position: "absolute",display: 'flex', justifyContent: "center", alignItems: "center"}}>
                    <List direction = "column" style={{ justifyItems:"center"}}>
                        <ListItem>
                            <Stack direction="row" spacing={3}>
                                <ListItemAvatar>
                                    <Avatar alt="Remy Sharp" src={userLogo} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary="Name: "
                                    secondary = {user.name}/>
                                <ListItemText
                                    primary="Age: "
                                    secondary = {user.age}/>
                                <ListItemText
                                    primary="Weight: "
                                    secondary = {user.weight}/>
                                <ListItemText
                                    primary="Height: "
                                    secondary = {user.height}/>
                                <ListItemText
                                    primary="BMI: "
                                    secondary = {Number(user.bmi).toFixed(2)}/>
                                </Stack>
                            </ListItem>
                            
                            <ListItem>
                                <FormControl sx={{ m: 1, width: 300 }} >
                                                <InputLabel id="demo-multiple-checkbox-label">Goals</InputLabel>
                                                <Select
                                                labelId="demo-multiple-checkbox-label"
                                                id="demo-multiple-checkbox"
                                                multiple
                                                value={user.goals}
                                                onChange={(event) => handleGoals(event.target.value,user._id) }
                                                input={<OutlinedInput label="Goals" />}
                                                renderValue={(selected) => selected.join(', ')}
                                                MenuProps={goalsProps}
                                                >
                                                console.log("mygoals!",goals)
                                                {goalsNames.map((goal) => (
                                                    <MenuItem key={goal} value={goal}>
                                                        <Checkbox checked={user.goals.indexOf(goal) > -1} />
                                                    <ListItemText primary={goal} />
                                                    </MenuItem>
                                                ))}
                                                </Select>
                                </FormControl>
                            </ListItem>
                    </List>
                </Paper> 
                )}) : null}    
            </Stack> 
        )                                      
};



export default function UsersPage() {
    const [usersList, setUsersList] = useState([])
    // const [goals, setGoals] = useState([]);
    
    async function load() {
        const response = await api.getAllUsers()
        if (!response.error) {
            setUsersList(response)
            console.log(response)
            return
        }
        alert(response.error)

    }

    

    useEffect(() => {
        load()
    }, [])    
    
    async function handleGoals(goals,id) {
        // await api.editUserGoals({email: email , goals: goals})
        // const newgoals = event.target.value
        const req = {id , goals}
        const res = await api.editUserGoals(req)
        if(!res.error){
            console.log("response: ", res)
            load()
        }
    }
    

    return (
        <div style={{ display: "flex", position: "absolute", height: "100%", width: "100%", justifyContent: "center", alignItems: "center" }}>
            {/* <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}> */}
            
                {usersList ? <DisplayUsers usersList={usersList} handleGoals={handleGoals} /> : []}
            {/* </List> */}
        </div>
    )
}