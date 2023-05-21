import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {useContext, useState} from "react";
import SideBar from "./SideBar";
import {useNavigate} from "react-router-dom";
import UserContext from "../context/UserContext";
import LogoutIcon from '@mui/icons-material/Logout';

export default function PhiziAppBar({children}) {
  const { getUser,setUser } = useContext(UserContext)
  const [openSideBar, setOpenSideBar] = useState(false)
  const navigate = useNavigate()

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
          <AppBar position= "sticky" style={{background: "rgba(16, 16, 16, 0.7)"}}>
              <Toolbar>
                {getUser()?
                  <IconButton
                      size="large"
                      edge="start"
                      color="inherit"
                      aria-label="menu"
                      sx={{ mr: 2 }}
                      onClick={() => { setOpenSideBar(true) }}
                  >
                    <MenuIcon />
                  </IconButton>
                  : null}
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                      Phizzi App
                  </Typography>
                  {getUser()? <Button onClick={handleLogout} color="inherit"><LogoutIcon/></Button>
                  : <Button onClick={handleLogin} color="inherit">Login</Button>}
                </Toolbar>
            </AppBar>
            <SideBar openSideBar={openSideBar} setOpenSideBar={setOpenSideBar}/>
          {children}
      </div>
  );
}