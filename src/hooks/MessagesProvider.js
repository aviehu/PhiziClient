import MessagesContext from "../context/MessagesContext"
import { useEffect, useState } from "react";

export default function MessagesProvider({children}){
    const [messages,setMessages] = useState(-1)

    return(
        <MessagesContext.Provider value = {{messages,setMessages}}>
            {children}
        </MessagesContext.Provider>
    )
}