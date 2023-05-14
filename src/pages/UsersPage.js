import { useState, useEffect } from "react";
import { Divider, ListItemText, List, ListItem, Typography, Avatar, ListItemAvatar, Button } from "@mui/material";
import api from "../util/api";
import { useNavigate } from "react-router-dom";
import userLogo from "../person.png";

function handleGoals(user) {
    
}

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
                    <div style={{ display: "flex", position: "absolute", height: "100%", width: "100%", justifyContent: "flex-end", alignItems: "center" }}>
                        <Button onClick={handleGoals(user)}>Add Goals</Button>
                    </div>

                </ListItem>
                <Divider variant="inset" component="li" />
            </div>
        )
    })
};

export default function UsersPage() {

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
        </div>
    )
}