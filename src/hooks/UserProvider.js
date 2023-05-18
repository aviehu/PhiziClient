import { useContext } from "react-router-dom";
import { useState, createContext } from "react";

export const UserContext = createContext({user: "", setUser: (user) => {}})
export default function UserProvider({children}){
    const [user,setUser] = useState("hila")
    return(
        <UserContext.Provider value = {{user,setUser}}>
            {children}
        </UserContext.Provider>
    )


}