import {Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import {useNavigate} from "react-router-dom";
import {useContext} from "react";
import UserContext from "../context/UserContext";
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import AddIcon from '@mui/icons-material/Add';
import GroupIcon from '@mui/icons-material/Group';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import HomeIcon from '@mui/icons-material/Home';
import BarChartIcon from '@mui/icons-material/BarChart';

export default function SideBar({ setOpenSideBar, openSideBar }) {
    const {getUser} = useContext(UserContext)
    const navigate = useNavigate()

    function navigateTo(path) {
        setOpenSideBar(false)
        navigate(path)
    }

    return (
        <Drawer
            anchor={'left'}
            open={openSideBar}
            onClose={() => setOpenSideBar(false)}
        >
            <Box
                sx={{ width: 250 }}
                role="presentation"
                
            >
                <List>
                    <ListItem key={'home'} >
                        <ListItemButton  onClick={() => { navigateTo('/')}}>
                            <ListItemIcon>
                                <HomeIcon/>
                            </ListItemIcon>
                            <ListItemText primary='home' />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={'playGame'} >
                        <ListItemButton  onClick={() => { navigateTo('/app')}}>
                            <ListItemIcon>
                                <SportsEsportsIcon/>
                            </ListItemIcon>
                            <ListItemText primary='Play Game' />
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider />
                {getUser() && getUser().role === 'admin' ?
                <List>
                    <ListItem key={'editProfile'} >
                        <ListItemButton onClick={() => { navigateTo('/editUserProfile') }}>
                            <ListItemIcon>
                                <BorderColorIcon/>
                            </ListItemIcon>
                            <ListItemText primary='Edit Profile' />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={'register'} >
                        <ListItemButton onClick={() => { navigateTo('/register') }}>
                            <ListItemIcon>
                                <AppRegistrationIcon/>
                            </ListItemIcon>
                            <ListItemText primary='Register' />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={'addPose'} >
                        <ListItemButton onClick={() => { navigateTo('/poses') }}>
                            <ListItemIcon>
                                <AddIcon/>
                            </ListItemIcon>
                            <ListItemText primary='Add Pose' />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={'sessions'} >
                        <ListItemButton onClick={() => { navigateTo('/sessions') }}>
                            <ListItemIcon>
                                <FitnessCenterIcon/>
                            </ListItemIcon>
                            <ListItemText primary='Sessions' />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={'users'} >
                        <ListItemButton onClick={() => { navigateTo('/users') }}>
                            <ListItemIcon>
                                <GroupIcon/>
                            </ListItemIcon>
                            <ListItemText primary='Users' />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={'scores'} >
                        <ListItemButton onClick={() => { navigateTo('/scores') }}>
                            <ListItemIcon>
                                <BarChartIcon/>
                            </ListItemIcon>
                            <ListItemText primary='Scores' />
                        </ListItemButton>
                    </ListItem>
                </List>
                : getUser()? 
                <List>
                    <ListItem key={'editProfile'} >
                        <ListItemButton onClick={() => { navigateTo('/editUserProfile') }}>
                            <ListItemIcon>
                                <BorderColorIcon/>
                            </ListItemIcon>
                            <ListItemText primary='Edit Profile' />
                        </ListItemButton>
                    </ListItem>
                </List>
                : null}
                
            </Box>
        </Drawer>
    )
}