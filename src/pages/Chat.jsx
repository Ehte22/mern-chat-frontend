import React, { useEffect, useMemo, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Messages from '../components/Messages'
import io from "socket.io-client"
import { useSelector } from 'react-redux'

const Chat = () => {
    const socket = useMemo(() => io(import.meta.env.VITE_BACKEND_URL), [])
    const [width, setWidth] = useState(990)
    const [showSidebar, setShowSidebar] = useState(true)
    const toggle = e => setShowSidebar(!showSidebar)
    const { user } = useSelector(state => state.auth)
    const [onlineUsers, setOnlineUsers] = useState([])
    useEffect(() => {
        setWidth(window.innerWidth)
        window.addEventListener("resize", () => {
            setWidth(window.innerWidth)
        })
        return () => window.removeEventListener("resize", () => { })
    }, [])

    useEffect(() => {
        socket.on("connect", () => {
            socket.emit("join-chat", user)
        })
        socket.on("online-response", data => setOnlineUsers(data))
        return () => socket.close()
    }, [])
    return <>
        <div className='flex overflow'>
            {(showSidebar || width >= 768) && <Sidebar socket={socket} onlineUsers={onlineUsers} width={width} toggle={toggle} showSidebar={showSidebar} />}
            {(width >= 768 || !showSidebar) && <Messages socket={socket} toggle={toggle} width={width} />}
        </div>
    </>
}

export default Chat