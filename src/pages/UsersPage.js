import { useState, useEffect } from "react";
import { Divider, ListItemText, List,Checkbox,MenuItem,OutlinedInput,Select, ListItem,InputLabel,FormControl, Typography, Avatar, ListItemAvatar, Button } from "@mui/material";
import api from "../util/api";
import { useNavigate } from "react-router-dom";
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

// async function handleEditUser() {
//     const dataGoals = goals.map((goal) => goalsNamesMatch[goal])
//     console.log("datagoals:",dataGoals)
//     // await api.sendPose()
// }    
// const handleGoalChange = (event) => {
//     const values = event.target.value
//     setGoals(values)
// }

function DisplayUsers(usersList) {
    return usersList.map((user) => {
        return (
            <div>
                <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                        <Avatar alt="Remy Sharp" src={userLogo} />
                    </ListItemAvatar>
                    <ListItemText
                        primary={
                            <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                            >
                                <b>email:</b> {user.email}<br />
                                <b>age:</b> {user.age}<br />
                                <b>height:</b> {user.height}<br />
                                <b>weight:</b> {user.weight}<br />
                                <b>bmi:</b> {Number(user.bmi).toFixed(2)}<br />
                                <b>goals:</b> {user.goals}<br />
                            </Typography>
                        }
                    />

                </ListItem>
                <Divider variant="inset" component="li" />
            </div>
        )
    })
};

export default function UsersPage() {
    const [goals,setGoals] = useState([])
    const [usersList, setUsersList] = useState([])


    const navigate = useNavigate()

    

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

    function handleRegister() {
        navigate('/register')
    }
    function handleAdmin() {
        navigate('/admin')
    }

    return (
        <div style={{ display: "flex", position: "absolute", height: "100%", width: "100%", justifyContent: "center", alignItems: "center" }}>
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {usersList ? DisplayUsers(usersList) : []}
            </List>
            {/* <div style={{ display: "flex", position: "absolute", height: "100%", width: "100%", justifyContent: "flex-end", alignItems: "center" }}>
                    <FormControl sx={{ m: 1, width: 300 }}>
                            <InputLabel id="demo-multiple-checkbox-label">Goals</InputLabel>
                            <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={goals}
                            onChange={handleGoalChange(user.email)}
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
                    </div> */}
        </div>
    )
}