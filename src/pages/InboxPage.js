import React, { useState, useEffect, useContext} from "react";
import {Button,Slide, Accordion,AccordionDetails,AccordionSummary,TextField,List,ListItemIcon,Alert, ListItem,Collapse,Divider, ListItemButton, FormControl,MenuItem,ListItemText, Snackbar, Stack, IconButton,Tooltip, Paper, Typography,InputLabel,Select,Dialog,DialogActions,DialogContent} from "@mui/material";
import api from "../util/api";
import DraftsIcon from '@mui/icons-material/Drafts';
import UserContext from "../context/UserContext";
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CreateIcon from '@mui/icons-material/Create';
import MessagesContext from "../context/MessagesContext";

export default function InboxPage(){
    const [myMessages,setMyMessages] = useState(null)
    const [myClients, setMyClients] = useState(null)
    const [curMessage, setCurMessage] = useState("")
    const [curSubject, setCurSubject] = useState("")
    const [openSnackBar, setOpenSnackBar] = useState(false)
    const [openAddMessage, setOpenAddMessage] = useState(false)
    const [chosenClientToSent, setChosenClientToSent] = useState(" ")
    const { getUser } = useContext(UserContext)
    const user = getUser()
    const { messages, setMessages } = useContext(MessagesContext)
    const delay = ms => new Promise(res => setTimeout(res, ms));

    async function load() {
        if(user.role === 'client'){
            setMyClients([user.superior])
        }
        else{
        const userName = user.name
        const myUsers = await api.getTherapistUsers({superior: userName})
        setMyClients(myUsers)
        }
        
    }

    useEffect(() => {
        load()
        loadMessages()
    }, [])

    async function loadMessages() {
        const loadMess = await api.getUserMessages({user: user.name})
        setMyMessages(loadMess)
        
    }

    function TransitionRight(props) {
        return <Slide {...props} direction="right" />;
    }

    function handleChosenSentTo(event){
        const client = event.target.value
        console.log(client)
        setChosenClientToSent(client)
    }
    async function handleSendMessage(){
        const response = await api.addMessage({from: user.name, to: chosenClientToSent,subject: curSubject, content: curMessage, read:false})
        if(!response.error){
            setOpenSnackBar(true)
            await delay(500); 
            setOpenAddMessage(false)
            setCurSubject("")
            setCurMessage("")
            setChosenClientToSent(" ")
        }
    }

    async function handleOpenMess(mess){
        console.log("handleopenmess")
        if(mess.read){
            return
        }
        const response = await api.markedAsRead({id: mess._id})
        setMessages(messages-1)
        mess.read = true
    }

    function handleRepley(to){

    }


    return (
        <div style={{ display: "flex", position: "absolute", height: "80%", width: "100%", justifyContent: "center", alignItems:'flex-start',marginTop:'7%'}}>
            {openSnackBar?
            <Snackbar
                    autoHideDuration={4000}
                    open={openSnackBar}
                    onClose={() => {setOpenSnackBar(false)}}
                    TransitionComponent={TransitionRight}
                    key={'snackBar'}

                >
                    <Alert onClose={() => setOpenSnackBar(false)}
                         severity="success"
                         sx={{ width: '100%' }}>
                        SENT!
                    </Alert>
                </Snackbar>
                :null}
                <Stack spacing={3} direction='column' style={{alignItems:'center', width:'100%', height:'90%'}}>
                <Stack spacing={3} style={{alignItems:'center', width:'50%'}}>
                    <Tooltip title="New Message">
                        <IconButton variant="contained" aria-label="add message" onClick={()=> setOpenAddMessage(true)} size='large' sx={{position: 'relative',boxShadow: 'rgba(0, 0, 0, 0.24) 1px 3px 8px', backgroundColor:'rgba(255,255,255,0.8)',borderRadius:'30%',alignSelf:'flex-end'}}>
                                        <CreateIcon />
                        </IconButton>
                    </Tooltip>
                    <div>
                    {myMessages?
                        myMessages.map((mess) =>(
                            <Accordion onChange={()=> handleOpenMess(mess)}>
                                <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                >
                                    {mess.read?
                                    <ListItemIcon>
                                        <DraftsIcon />
                                    </ListItemIcon>:
                                    <ListItemIcon>
                                        <MarkEmailUnreadIcon />
                                    </ListItemIcon>}
                                    <Typography>From: {mess.from}  |  {mess.subject}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography style={{marginLeft:'3%'}}>
                                        {mess.content}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>))                       
                    :null}
                    </div> 
                </Stack>
                <Stack spacing={3} direction='column' style={{alignItems:'center', width:'100%', height:'90%'}}>
                    <Dialog
                    open={openAddMessage}
                    onClose={() => setOpenAddMessage(false)}
                    sx={{ m: 0, p: 2 }}
                    fullWidth
                >
                    {/* <DialogTitle style={{  backgroundColor: "rgba(0,0,0,0.12)", borderRadius:7, width:'55%', textAlign:'center', color:'rgba(0,0,1,0.5)', boxShadow:'1px 2px 4px #999'}}>Add New Session</DialogTitle> */}
                    <DialogContent>
                            <Stack paddingTop={2} direction='column' spacing={2} style={{alignItems:'center'}}>
                                <Stack direction={'column'} spacing={2}>
                                <TextField label="Subject" value={curSubject} onChange={(event) => setCurSubject(event.target.value)} fullWidth style={{boxShadow:'1px 1px #999', borderRadius:'5%'}} ></TextField>
                                    <TextField id="outlined-multiline-static" value={curMessage} onChange={(event) => setCurMessage(event.target.value)} label='Message' multiline rows={4} style={{boxShadow:'1px 1px #999', borderRadius:'5%'}}></TextField>
                                    <FormControl fullWidth style={{boxShadow:'1px 1px #999', borderRadius:'5%'}}>
                                        <InputLabel id="demo-simple-select-label">To</InputLabel>
                                        <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="to"
                                        value={chosenClientToSent}
                                        onChange={handleChosenSentTo}
                                    >
                                       {user.role === 'client' ?
                                        <MenuItem  key={user.superior} value={user.superior}>
                                            <ListItemText primary={user.superior} />
                                        </MenuItem>
                                        : user.role !== 'client' && myClients ?
                                        myClients.map((client) => {
                                            return (
                                                <MenuItem  key={client.name} value={client.name}>
                                                    <ListItemText primary={client.name} />
                                                </MenuItem>
                                                )
                                        })
                                    :null} 
                                    </Select>                                        
                                    </FormControl>
                                </Stack>
                            </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button disabled={!chosenClientToSent || !curMessage} onClick={handleSendMessage}>Send</Button>
                        <Button onClick={() => setOpenAddMessage(false)}>Cancel</Button>
                    </DialogActions>
                </Dialog>
            </Stack>
            </Stack>
        </div>
    );
}