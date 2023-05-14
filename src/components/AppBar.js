import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export default function ButtonAppBar({children}) {
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
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Phizzi App
          </Typography>
          <Button color="inherit">Logout</Button>
        </Toolbar>
      </AppBar>
      {children}
    </div>
  );
}