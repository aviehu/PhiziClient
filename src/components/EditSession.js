import {
    Button, Paper,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControl, InputLabel, ListItemText, MenuItem, Select, Stack,
    TextField
} from "@mui/material";
import {useEffect, useState} from "react";
import api from "../util/api";
import goalsNames from '../util/goals'

export default function EditSession({editSession, setEditSession, loadSessions}) {

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [difficulty, setDifficulty] = useState(0)
    const [goals, setGoals] = useState([])
    const [poses, setPoses] = useState([])
    const [selectedPoses, setSelectedPoses] = useState([])

    async function editSessionHandler() {
        await api.updateSession({name, goals, description, difficulty, poses: selectedPoses })
        await loadSessions()
        setEditSession(null)
    }

    useEffect(() => {
        async function load() {
            const poses = await api.getPosesByGoals({ goals })
            setPoses(poses)
        }
        load()
    }, [goals])

    useEffect(() => {
        setName(editSession.name)
        setDescription(editSession.description)
        setDifficulty(editSession.difficulty)
        setGoals(editSession.goals)
        setSelectedPoses(editSession.poses)
    }, [])

    function posesOnChangeHandler(event) {
        const { value } = event.target
        setSelectedPoses(value)
    }

    function goalsOnChangeHandler(event) {
        const { value } = event.target
        setGoals(value)
        setSelectedPoses([])
    }

    return (
        <Dialog
            open={!!editSession}
            onClose={() => setEditSession(null)}
            height
            maxWidth="md"
        >
            <Stack  spacing={1.5} style={{alignItems:'center', padding:'3%',marginTop:'4%'}}>
            <DialogTitle style={{  backgroundColor: "rgba(0,0,0,0.12)", borderRadius:6, width:'55%', textAlign:'center', color:'rgba(0,0,1,0.5)', boxShadow:'1px 2px 4px #999'}}>Edit Session {name}</DialogTitle>
            <DialogContent>
                <Stack paddingTop={2} direction={'column'} spacing={2}>
                    <Stack direction={'row'} spacing={2}>
                        <TextField disabled={true} value={name} onChange={(event) => setName(event.target.value)} label='Name' style={{boxShadow:'1px 1px #999', borderRadius:'5%'}}></TextField>
                        <TextField type={'number'} value={difficulty} onChange={(event) => setDifficulty(event.target.value)} label='Difficulty' style={{boxShadow:'1px 1px #999', borderRadius:'5%'}}></TextField>
                    </Stack>
                    <Stack direction={'row'} spacing={2}>
                        <TextField value={description} onChange={(event) => setDescription(event.target.value)} fullWidth={true} label='description' style={{boxShadow:'1px 1px #999', borderRadius:'5%'}}></TextField>
                    </Stack>
                    <Stack direction={'row'} spacing={2}>
                        <FormControl fullWidth style={{boxShadow:'1px 1px #999', borderRadius:'5%'}}>
                            <InputLabel id="demo-simple-select-label">Goals</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Age"
                                multiple
                                value={goals}
                                onChange={goalsOnChangeHandler}
                            >
                                {
                                    goalsNames.map((goal) => {
                                        return (
                                            <MenuItem key={goal} value={goal}>
                                                <ListItemText primary={goal} />
                                            </MenuItem>
                                        )
                                    })
                                }
                            </Select>
                        </FormControl>
                    </Stack>
                    <Stack direction={'row'} spacing={2}>
                        <FormControl fullWidth style={{boxShadow:'1px 1px #999', borderRadius:'5%'}}>
                            <InputLabel id="demo-simple-select-label">Poses</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Age"
                                multiple
                                value={selectedPoses}
                                onChange={posesOnChangeHandler}
                            >
                                {
                                    poses.map((pose, index) => {
                                        return (
                                            <MenuItem  key={`${pose.name}${index}`} value={pose.name}>
                                                <ListItemText primary={pose.name} />
                                            </MenuItem>
                                        )
                                    })
                                }
                            </Select>
                        </FormControl>
                    </Stack>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={editSessionHandler}>Save</Button>
                <Button onClick={() => setEditSession(null)}>Cancel</Button>
            </DialogActions>
            </Stack>
            
        </Dialog>
    )
}