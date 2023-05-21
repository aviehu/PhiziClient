import {useState} from "react";

let socket = null
export default function useWebsocket() {

    const [msg, setMsg] = useState(null)

    if (!socket) {
        socket = new WebSocket('ws://localhost:8080')
        socket.onopen = (event) => {
            socket.onmessage = (event) => {
                setMsg(event.data)
            }
        }
    }

    function sendMessage(msg) {
        socket.send(msg)
    }

    return [msg, sendMessage]
}