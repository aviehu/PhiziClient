import { useState, useEffect} from "react";
import { Divider, ListItemText, List, ListItem,Stack, Paper, FormControl, OutlinedInput,MenuItem, Checkbox, InputLabel, Select, Avatar, ListItemAvatar, Button } from "@mui/material";
import api from "../util/api";
import userLogo from "../person.png";





export default function UsersPage() {

    const [usersList, setUsersList] = useState([])
    const [goals, setGoals] = useState([]);
    
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

      const handleGoalChange = (event) => {
        const values = event.target.value
        console.log(values)
        setGoals(values)
       }

    function DisplayUsers(usersList) {
        return usersList.map((user) => {
            return (
                <div  style={{display: 'flex', position: "absolute", height: "100%", width: "100%", justifyContent: "center", alignItems: "center"}}>
                    <Paper style={{padding:10, display: 'flex', justifyContent: "center", alignItems: "center"}}>
                        <Stack style={{textAlign: "center"}} direction="column" spacing={3}>
                            <Stack style={{textAlign: "center"}} direction="row" >
                                <ListItem alignItems="center">
                                    <ListItemAvatar>
                                        <Avatar alt="Remy Sharp" src={userLogo} />
                                    </ListItemAvatar>
                                </ListItem>
                                <ListItem alignItems="flex-start">
                                    <ListItemText
                                        primary="Name: "
                                        secondary = {user.name}/>
                                </ListItem>
                                <ListItem alignItems="flex-start">
                                    <ListItemText
                                        primary="Age: "
                                        secondary = {user.age}/>
                                </ListItem>
                                <ListItem alignItems="flex-start">
                                    <ListItemText
                                        primary="Weight: "
                                        secondary = {user.weight}/>
                                </ListItem>
                                <ListItem alignItems="flex-start">
                                    <ListItemText
                                        primary="Height: "
                                        secondary = {user.height}/>
                                </ListItem>
                                <ListItem alignItems="flex-start">
                                    <ListItemText
                                        primary="BMI: "
                                        secondary = {Number(user.bmi).toFixed(2)}/>
                                </ListItem>
                            </Stack>
                            
                            <Stack style={{alignItems: "center", justifyContent:"center"}} direction="row" >
                                <FormControl sx={{ m: 1, width: 300 }}>
                                                <InputLabel id="demo-multiple-checkbox-label">Goals</InputLabel>
                                                <Select
                                                labelId="demo-multiple-checkbox-label"
                                                id="demo-multiple-checkbox"
                                                multiple
                                                value={goals}
                                                onChange={handleGoalChange}
                                                input={<OutlinedInput label="Goals" />}
                                                renderValue={(selected) => selected.join(', ')}
                                                MenuProps={goalsProps}
                                                >
                                                {goalsNames.map((goal) => (
                                                    <MenuItem key={goal} value={goal}>
                                                        <Checkbox checked={goals.indexOf(goal) > -1} />
                                                    <ListItemText primary={goal} />
                                                    </MenuItem>
                                                ))}
                                                </Select>
                                </FormControl>
                                
                            </Stack>
                            <Button disabled = {!goals} onClick={handleGoals(user.email)}>Add Goals</Button>
                        </Stack>
                        <Divider variant="inset" component="li" />
                    </Paper>
                </div>
            )
        })
    };

    useEffect(() => {
        async function load() {
            const response = await api.getAllUsers()
            if (!response.error) {
                setUsersList(response)
                console.log(response)
                return
            }
            alert(response.error)

        }
        load()
    }, [])

    
    
    function handleGoals(email) {
        console.log("email, goals", [email,goals])
        // await api.editUserGoals({email: email , goals: goals})
    }
    

    return (
        <div style={{ display: "flex", position: "absolute", height: "100%", width: "100%", justifyContent: "center", alignItems: "center" }}>
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {usersList ? DisplayUsers(usersList) : []}
            </List>
        </div>
    )
}