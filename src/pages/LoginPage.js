import { useContext, useState } from "react";
import { Button, Paper, Stack, TextField } from "@mui/material";
import api from "../util/api";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import MessagesContext from '../context/MessagesContext';

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { getUser, setUser } = useContext(UserContext)
    const navigate = useNavigate()
    const user = getUser()
    const {messages, setMessages} = useContext(MessagesContext)

    async function handleLogin() {
        const response = await api.login({ email, password })
        if (!response.error) {
            setUser(response)
            const loadMess = await api.getUserMessages({user: response.name})
            const unread = loadMess.filter((mess) => !mess.read)
            const unreadCounts = unread.length
            setMessages(unreadCounts)
            navigate('/')
            return
        }
        alert(response.error)
    }

    function handleRegister() {
        navigate('/register')
    }

    return (
        <div style={{ display: "flex", position: "absolute", height: "100%", width: "100%", justifyContent: "center", alignItems: "center" }}>
            <Paper variant='elevation' elevation={10} style={{borderRadius:'5%', backgroundColor:'rgba(255,255,255,0.95)', display: "flex", height: "60%", width: "46%", justifyContent: "center", alignItems: "center" }}>
                <Stack style={{  alignItems:'center',textAlign: "center", width: '80%'}} direction="column" spacing={3}>
                    <h1 style={{  backgroundColor: "rgba(0,0,0,0.12)", borderRadius:4, width:'30%',textAlign:'center', color:'rgba(0,0,1,0.5)', boxShadow:'1px 2px 4px #999'}}>Login</h1>
                    <TextField label="Email" value={email} onChange={(event) => setEmail(event.target.value)} style={{boxShadow:'1px 1px #999', borderRadius:'5%', width:'60%'}}></TextField>
                    <TextField type={"password"} label="Password" value={password} onChange={(event) => setPassword(event.target.value)} style={{boxShadow:'1px 1px #999', borderRadius:'5%', width:'60%'}}></TextField>
                    
                        
                        
                        {user && user.role === 'admin'? 
                        <Stack justifyContent={"space-between"} direction="row" spacing={3}>
                            <Button onClick={handleLogin}>Login</Button>
                            <Button onClick={handleRegister}>Register</Button>
                        </Stack>
                        :
                        <Stack alignItems={'center'}>
                            <Button onClick={handleLogin} >Login</Button>
                        </Stack> }
                    
                </Stack>
            </Paper>
        </div>
    )
}