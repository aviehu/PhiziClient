import UserContext from "../context/UserContext";
import { useEffect, useState } from "react";

export default function UserProvider({children}){

    function getUser(){
        return JSON.parse(localStorage.getItem("user"))
    }

    function setUser(user){
        localStorage.setItem("user", JSON.stringify(user))
    }

    return(
        <UserContext.Provider value = {{getUser,setUser}}>
            {children}
        </UserContext.Provider>
    )
}