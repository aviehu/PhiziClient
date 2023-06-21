import React,{ useContext,useState, useEffect }  from 'react';
import MailIcon from '@mui/icons-material/Mail';
import UserContext from "../context/UserContext";
import api from '../util/api';
import IconButton from '@mui/material/IconButton';
import {useNavigate} from "react-router-dom";
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import MessagesContext from '../context/MessagesContext';

export default function InboxBadge() {
    const { getUser } = useContext(UserContext)
    const user = getUser()
    const [unreadCount, setUnreadCount] = useState(-1)
    const navigate = useNavigate()
    const {messages, setMessages} = useContext(MessagesContext)


    async function load(){
        console.log(messages)
      }

    useEffect(() => {
        load()
    }, []);


  return (
         <IconButton aria-label="inbox" onClick={()=> navigate('/inbox')}>
        {messages > -1?
         <Badge badgeContent={messages} color="secondary">
            <MailIcon sx={{ color: 'white' }} />
         </Badge>
         :null}
       </IconButton>
    
    
  );
}