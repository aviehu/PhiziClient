import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {useState} from "react";
import SideBar from "./SideBar";
import {useNavigate} from "react-router-dom";

export default function PhiziAppBar({children}) {

  const [openSideBar, setOpenSideBar] = useState(false)
  const navigate = useNavigate()

  function handleLogout() {
    setOpenSideBar(false)
    navigate('/')
  }

  return (
      <div style={{position: 'absolute',backgroundColor: 'white', width: '100%', height: '100%'}}>
          <AppBar position= "sticky">
              <Toolbar>
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
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                      Phizzi App
                  </Typography>
                  <Button onClick={handleLogout} color="inherit">Logout</Button>
                </Toolbar>
            </AppBar>
            <SideBar openSideBar={openSideBar} setOpenSideBar={setOpenSideBar}/>
          {children}
      </div>
  );
}