import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { Fragment } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {useContext, useState, useEffect} from "react";
import SideBar from "./SideBar";
import {useNavigate} from "react-router-dom";
import UserContext from "../context/UserContext";
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import Divider from '@mui/material/Divider';
import InboxBadge from './InboxBadge';
import MessagesContext from '../context/MessagesContext';
import api from '../util/api';

export default function PhiziAppBar({children}) {
  const { getUser,setUser } = useContext(UserContext)
  const {messages, setMessages} = useContext(MessagesContext)
  const [openSideBar, setOpenSideBar] = useState(false)
  const navigate = useNavigate()
  const user = getUser()

  useEffect(()=>{
    async function load(){
      const loadMess = await api.getUserMessages({user: user.name})
    const unread = loadMess.filter((mess) => !mess.read)
    const unreadCounts = unread.length
    setMessages(unreadCounts)
    }
    load()
  },[])

  function handleLogout() {
    setOpenSideBar(false)
    setUser(null)
    navigate('/')
  }
  function handleLogin() {
    setOpenSideBar(false)
    navigate('/login')
  }

  return (
      <div style={{position: 'absolute',backgroundColor: 'white', width: '100%', height: '100%'}}>
          <AppBar position= "fixed" style={{background: "rgba(16, 16, 16, 0.7)"} }>
              <Toolbar>
                {user?
                <Fragment>
                  <IconButton
                      size="large"
                      edge="start"
                      color="inherit"
                      aria-label="menu"
                      onClick={() => { setOpenSideBar(true) }}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Typography
                      type="title"
                      color="inherit"
                      style={{ borderRight: '0.1em solid rgba(255,255,255,0.4)',padding:'0.1em', paddingRight:'12px', paddingTop:'32px' }}
                  />
                  <PersonIcon sx={{ paddingLeft:1.8 }} />
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1, paddingLeft:1.3 }} >
                      {user.name}
                  </Typography>
                  </Fragment>
                  : 
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1, paddingLeft:1.3 }} >
                  Phizzi App
                 </Typography>}
                        
                    
                  
                 <InboxBadge/>
                  {getUser()?
                   <Button onClick={handleLogout} color="inherit"><LogoutIcon/></Button>
                   
                  : <Button onClick={handleLogin} color="inherit">Login</Button>}
                </Toolbar>
            </AppBar>
            <SideBar openSideBar={openSideBar} setOpenSideBar={setOpenSideBar} />
          {children}
      </div>
  );
}