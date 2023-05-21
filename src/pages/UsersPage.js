import { useState, useEffect} from "react";
import api from "../util/api";
import UsersTable from "../components/UsersTable"


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
    const [usersList, setUsersList] = useState([])
    
    async function load() {
        const response = await api.getAllUsers()
        if (!response.error) {
            setUsersList(response)
            return
        }
        alert(response.error)

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
                {usersList ? <UsersTable usersList={usersList} handleGoals={handleGoals} goalsProps = {goalsProps} goalsNames={goalsNames} /> : []}
        </div>
    )
}