import {Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import {useNavigate} from "react-router-dom";
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import AddIcon from '@mui/icons-material/Add';
import GroupIcon from '@mui/icons-material/Group';

export default function SideBar({ setOpenSideBar, openSideBar }) {

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
                <List>
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
                </List>
            </Box>
        </Drawer>
    )
}