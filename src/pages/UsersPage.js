import { useContext, useState, useEffect} from "react";
import api from "../util/api";
import UsersTable from "../components/UsersTable"
import UserContext from "../context/UserContext";



const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

    const goalsNames = ['Upper Body', 'Legs', 'Shoulders'];
    const goalsProps = {
        PaperProps: {
          style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
          },
        },
      }

export default function UsersPage() {
    const { getUser } = useContext(UserContext)
    const user = getUser()
    const [usersList, setUsersList] = useState([])
    const roleToNum = {'admin':1, 'therapist':2, 'client':3}

    async function handleDeleteUser(id) {
        await api.deleteUser(id)
        await load()
      }

    async function load() {
        if(user.role === 'admin'){
            let myUsers = await api.getAllUsers()
            myUsers = myUsers.sort((first,second)=> roleToNum[first.role] -  roleToNum[second.role])
            setUsersList(myUsers)
          }
        else{
        const userName = user.name
        let myUsers = await api.getTherapistUsers({superior: userName})
        myUsers = myUsers.sort((first,second)=> roleToNum[first.role] -  roleToNum[second.role])
        setUsersList(myUsers)
        }
    }

    

    useEffect(() => {
        load()
    }, [])    
    
    async function handleGoals(goals,email) {
        const body = {email , goals}
        const res = await api.updateUser(body)
        if(!res.error){
            load()
        }
    }
    

    return (
        <div style={{ display: "flex", position: "absolute", height: "100%", width: "100%", alignContent:'center', justifyContent: "center", alignItems: "center" }}>
                {usersList ? <UsersTable usersList={usersList} handleGoals={handleGoals} goalsProps = {goalsProps} goalsNames={goalsNames} handleDeleteUser={handleDeleteUser} /> : []}
        </div>
    )
}