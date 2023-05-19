import UserContext from "../context/UserContext";
import { useState } from "react";

export default function UserProvider({children}){
    const [user,setUser] = useState("hila")
    return(
        <UserContext.Provider value = {{user,setUser}}>
            {children}
        </UserContext.Provider>
    )
}