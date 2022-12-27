import {useState} from "react";

let socket = null
export default function useWebsocket() {

    const [msg, setMsg] = useState(null)

    if (!socket) {
        socket = new WebSocket('ws://localhost:8080')
        socket.onopen = (event) => {
            console.log('socket open')
            socket.onmessage = (event) => {
                console.log('webSocket message', event.data)
                setMsg(event.data)
            }
        }
    }

    function sendMessage(msg) {
        socket.send(msg)
    }

    return [msg, sendMessage]
}