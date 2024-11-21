import React, { useEffect, useRef, useState } from 'react'
import { motion } from "framer-motion"
import { BsSearch } from "react-icons/bs";
import { TbDotsVertical } from "react-icons/tb";
import { BiSolidMicrophone } from "react-icons/bi";
import { BsEmojiSmile } from "react-icons/bs";
import { GrAdd } from "react-icons/gr";
import { IoDocumentText } from "react-icons/io5";
import { IoMdClose, IoMdPhotos } from "react-icons/io";
import { BsCameraFill } from "react-icons/bs";
import { BsFillPersonFill } from "react-icons/bs";
import { BiPoll } from "react-icons/bi";
import { PiStickerFill } from "react-icons/pi";
import { useSelector, useDispatch } from "react-redux";
import GifPicker from 'gif-picker-react';
import EmojiPicker from 'emoji-picker-react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { useLazyGetMessagesQuery, useSendMessageMutation, useUpdateSeenMutation } from '../redux/apis/chatApi';
import { useUpdateProfileMutation } from '../redux/apis/userApi';
const Messages = ({ toggle, width, socket }) => {
    const imgRef = useRef()
    const audioRef = useRef()
    const videoRef = useRef()
    const modalRef = useRef()
    const messageBoxRef = useRef()
    const [box, setBox] = useState(0)

    const [imgData, setImgData] = useState()
    const [audioData, setAudioData] = useState()
    const [videoData, setVideoData] = useState()
    const [showGifPicker, setShowGifPicker] = useState(false)

    const [allMessages, setAllMessages] = useState([])
    const [updateSeen, { isSuccess: updateSuccess }] = useUpdateSeenMutation()
    const [getMessages, { isLoading, data, isSuccess }] = useLazyGetMessagesQuery()
    const [sendMessage] = useSendMessageMutation()
    const { selectedUser } = useSelector(state => state.chat)
    const [activeUser, setActiveUser] = useState()
    const { user } = useSelector(state => state.auth)
    const [message, setMessage] = useState("")


    const [page, setPage] = useState(0)
    const handleSubmit = e => {
        e.preventDefault()
        const fd = new FormData()
        fd.append("message", message)
        fd.append("reciver", selectedUser._id)
        // sendMessage({ message, reciver: selectedUser._id })
        sendMessage(fd)
        setMessage("")
    }
    const handleKeyDown = e => {
        if (e.key === "Enter") {
            handleSubmit(e)
        }
    }

    useEffect(() => {

        if (selectedUser) {
            if (selectedUser.isGroup) {
                socket.emit("join-chat", selectedUser)
            }
            setPage(pre => 0)
            setAllMessages([])
            getMessages({ id: selectedUser._id, page: 0 })
        }
    }, [selectedUser])

    useEffect(() => {
        if (page > 0) {
            getMessages({ id: selectedUser._id, page })
        }
    }, [page])


    useEffect(() => {
        if (isSuccess || data) {
            setAllMessages([...allMessages, ...data.result])
        }
    }, [isSuccess, data])

    useEffect(() => {
        if (imgData || audioData || videoData) {
            modalRef.current.showModal()
        }
    }, [imgData, audioData, videoData])

    useEffect(() => {
        if (messageBoxRef.current) {
            setBox(messageBoxRef.current.clientHeight)
        }
    }, [])


    useEffect(() => {
        if (selectedUser) {
            socket.on("send-response", (data) => {
                if (selectedUser && (selectedUser._id === data || user._id === data)) {
                    setAllMessages(pre => {
                        getMessages({ id: selectedUser._id, page: 0 })
                        return []
                    })
                }
            })
        }
    }, [selectedUser])

    useEffect(() => {
        if (selectedUser) {
            updateSeen(selectedUser._id)
        }
    }, [selectedUser])

    useEffect(() => {
        socket.on("seen-response", data => {
            if (data === selectedUser._id) {
                updateSeen(selectedUser._id)
            }
        })
    }, [selectedUser, data])
    useEffect(() => {
        if (updateSuccess) {
            getMessages({ id: selectedUser._id, page: 0 })
        }
    }, [selectedUser, data])


    return <>
        {/* <pre> page : {JSON.stringify(page, null, 2)}</pre> */}
        {/* <pre> total : {data && JSON.stringify(data.total, null, 2)}</pre> */}
        {
            selectedUser
                ? isLoading
                    ? <div className='w-full h-screen flex justify-center items-center'>
                        <span className="text-9xl loading loading-spinner loading-md"></span>
                    </div>
                    : <div className='w-full h-screen flex flex-col ' >
                        <div className='flex bg-[#202C33] py-1 justify-between w-full'>
                            <div className='flex  px-4 py-2 border-l-1 items-center gap-4 overflow-hidden'>
                                <motion.img
                                    initial={{ x: "-100%" }}
                                    animate={{ x: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className='h-12 w-12 rounded-full object-cover'
                                    src={`${import.meta.env.VITE_BACKEND_URL}/${selectedUser.photo}`} alt={selectedUser.name} />
                                <div className='space-y-1'>
                                    <span className='text-xl'>{selectedUser.name}</span>
                                    <p className='text-xs'>Click here for contact info</p>


                                </div>
                            </div>
                            <div className='flex gap-4 text-xl px-4 py-2 items-center '>
                                <motion.div
                                    initial={{ y: "-200%", opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.3, delay: 0.6 }}
                                    className="dropdown dropdown-end"
                                >
                                    <div tabIndex={0} role="button" className="">
                                        <BsSearch />
                                    </div>
                                    <div
                                        tabIndex={0}
                                        className="card compact dropdown-content z-[1] shadow bg-slate-500 rounded-box w-64">
                                        <input type="text" placeholder="Search here" className="input input-bordered w-full max-w-xs" />
                                    </div>
                                </motion.div>
                                <motion.div
                                    initial={{ y: "-200%", opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.3, delay: 0.6 }}
                                    className="dropdown dropdown-left"
                                >
                                    <div tabIndex={0} role="button" className="text-2xl">
                                        <TbDotsVertical />
                                    </div>
                                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 text-lg ">
                                        <li><a className='text-purple-700 '>< IoDocumentText /> <span className='text-slate-400 text-sm'>Document</span> </a></li>
                                        <li><a className='text-blue-600 '>< IoMdPhotos /> <span className='text-slate-400 text-sm'>Photos&Videos</span> </a></li>
                                        <li><a className='text-red-700 '>< BsCameraFill /> <span className='text-slate-400 text-sm'>Camera</span> </a></li>
                                        <li><a className='text-blue-600 '>< BsFillPersonFill /> <span className='text-slate-400 text-sm'>Contact</span> </a></li>
                                        <li><a className='text-yellow-600 '>< BiPoll /> <span className='text-slate-400 text-sm'>Poll</span> </a></li>
                                        <li><a className='text-green-800 '>< PiStickerFill /> <span className='text-slate-400 text-sm'>New Sticker</span> </a></li>
                                    </ul>
                                </motion.div>
                                {
                                    width <= 768 && <button className="" onClick={toggle}><IoMdClose /></button>
                                }

                            </div>
                        </div>
                        {/* <h1>{messageBoxRef.current?.clientHeight}</h1> */}
                        <div ref={messageBoxRef} className='w-full h-full flex-grow overflow-y-auto  px-4 '>
                            {
                                allMessages.length > 0 && <InfiniteScroll
                                    inverse={true}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column-reverse',
                                    }}
                                    height={600}
                                    dataLength={allMessages.length}
                                    // hasMore={data ? allMessages.length < data.total : true}
                                    hasMore={true}
                                    next={e => setPage(pre => pre + 1)}
                                >

                                    {
                                        allMessages.map((item, i) => <div className='' key={`chat-${i}`}>
                                            {
                                                item.sender._id !== user._id
                                                    ? <>
                                                        <div className="chat chat-start">
                                                            <div className="chat-image avatar">
                                                                <div className="w-10 rounded-full">
                                                                    <img
                                                                        alt={item.sender.name}
                                                                        src={`${import.meta.env.VITE_BACKEND_URL}/${item.sender.photo}`} />
                                                                </div>
                                                            </div>
                                                            <div className="chat-header">
                                                                {item.sender.name}
                                                                <time className="text-xs opacity-50">{item.createdAt}</time>
                                                            </div>
                                                            <div className="chat-bubble">
                                                                {item.message}
                                                                {item.gif && <img src={item.gif} alt="" />}
                                                                {item.audio && <audio src={`${import.meta.env.VITE_BACKEND_URL}/${item.audio}`} controls />}
                                                                {item.video && <video className='w-full object-cover' src={`${import.meta.env.VITE_BACKEND_URL}/${item.video}`} controls />}
                                                                {item.image && <img className='w-full object-cover' src={`${import.meta.env.VITE_BACKEND_URL}/${item.image}`} />}
                                                            </div>
                                                            {/* <div className="chat-footer opacity-50">
                                                                Delivered
                                                            </div> */}
                                                        </div>
                                                    </>
                                                    : <>
                                                        <div className="chat chat-end">
                                                            <div className="chat-image avatar">
                                                                <div className="w-10 rounded-full">
                                                                    <img
                                                                        alt={user.photo}
                                                                        src={`${import.meta.env.VITE_BACKEND_URL}/${user.photo}`} />
                                                                </div>
                                                            </div>
                                                            <div className="chat-header">
                                                                You
                                                                <time className="text-xs opacity-50">{item.createdAt}</time>
                                                            </div>
                                                            <div className="chat-bubble w-1/2">
                                                                {item.message && item.message}
                                                                {item.gif && <img src={item.gif} alt="" />}
                                                                {item.audio && <audio src={`${import.meta.env.VITE_BACKEND_URL}/${item.audio}`} controls />}
                                                                {item.video && <video className='w-full object-cover' src={`${import.meta.env.VITE_BACKEND_URL}/${item.video}`} controls />}
                                                                {item.image && <img className='w-full object-cover' src={`${import.meta.env.VITE_BACKEND_URL}/${item.image}`} />}

                                                            </div>

                                                            <div className="chat-footer opacity-50">
                                                                {item.seen ? "✔️✔️" : "unseen"}
                                                            </div>
                                                        </div>
                                                    </>
                                            }



                                        </div>)
                                    }

                                </InfiniteScroll >
                            }
                        </div>


                        <div className='flex items-center  gap-2  py-2 px-2 bg-[#202C33]'>

                            <div className="dropdown  dropdown-top">
                                <div tabIndex={0} role="button" className="text-2xl px-2"><BsEmojiSmile /></div>
                                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                    <EmojiPicker open={true} onEmojiClick={e => setMessage(pre => pre + e.emoji)} />
                                </ul>
                            </div>
                            <div className={`dropdown dropdown-top ${showGifPicker ? "dropdown-open" : ""}`}>
                                <div tabIndex={0} role="button" className="text-2xl px-2"
                                    onClick={() => setShowGifPicker(!showGifPicker)}>
                                    <BsEmojiSmile />
                                </div>
                                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                    {showGifPicker && (
                                        <GifPicker
                                            onGifClick={e => {
                                                sendMessage({ gif: e.preview.url, reciver: selectedUser._id });
                                                setShowGifPicker(false);
                                            }}
                                            tenorApiKey={import.meta.env.VITE_TENOR_API_KEY}
                                        />
                                    )}
                                </ul>
                            </div>

                            <motion.div
                                initial={{ y: "-200%", opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.6 }}
                                className="dropdown dropdown-top"
                            >
                                <div tabIndex={0} role="button" className="text-2xl">
                                    <GrAdd />
                                </div>
                                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 text-lg ">
                                    <li onClick={e => audioRef.current.click()}>
                                        <div className='text-purple-700 '>
                                            < IoDocumentText />
                                            <input onChange={e => {

                                                setAudioData({
                                                    audio: e.target.files[0],
                                                    preview: URL.createObjectURL(e.target.files[0])
                                                })
                                            }} type="file" accept='audio/*' ref={audioRef} className='hidden' />
                                            <span className='text-slate-400 text-sm'>Audio</span>
                                        </div>
                                    </li>
                                    <li onClick={e => videoRef.current.click()}>
                                        <div className='text-blue-600 '>
                                            < IoMdPhotos />
                                            <input onChange={e => {
                                                setVideoData({
                                                    video: e.target.files[0],
                                                    preview: URL.createObjectURL(e.target.files[0])
                                                })
                                            }} type="file" accept='video/*' ref={videoRef} className='hidden' />
                                            <span className='text-slate-400 text-sm'>Video</span>
                                        </div>
                                    </li>
                                    <li onClick={e => imgRef.current.click()}>
                                        <div className='text-blue-600 '>
                                            < IoMdPhotos />
                                            <input onChange={e => {
                                                setImgData({
                                                    img: e.target.files[0],
                                                    preview: URL.createObjectURL(e.target.files[0])
                                                })
                                            }} type="file" accept='image/*' ref={imgRef} className='hidden' />
                                            <span className='text-slate-400 text-sm'>Image</span>
                                        </div>
                                    </li>

                                </ul>
                            </motion.div>
                            <form onSubmit={handleSubmit} className='w-full'>
                                <input
                                    value={message}
                                    onKeyDown={handleKeyDown}
                                    onChange={e => setMessage(e.target.value)}
                                    type="text"
                                    placeholder="Type Message"
                                    className="input input-bordered w-full " />
                            </form>
                            <span className='text-2xl px-3'><BiSolidMicrophone /></span>
                        </div>
                    </div >
                : <div className='w-full h-screen flex justify-center items-center'>
                    <p>Please choose contact to start conversation</p>
                </div>
        }

        {/* <button className="btn" onClick={() => window.my_modal_3.showModal()}>open modal</button> */}
        <dialog ref={modalRef} id="my_modal_3" className="modal">
            <form method="dialog" className="modal-box">


                {imgData && <img src={imgData.preview} className='max-w-80 w-full object-cover' alt="" />}
                {audioData && <audio src={audioData.preview} controls />}
                {videoData && <video src={videoData.preview} height={400} controls />}
                <button
                    onClick={e => {
                        const fd = new FormData()
                        if (audioData) {
                            fd.append("audio", audioData.audio)
                        }
                        if (videoData) {
                            fd.append("video", videoData.video)
                        }
                        if (imgData) {
                            fd.append("image", imgData.img)
                        }
                        fd.append("reciver", selectedUser._id)

                        sendMessage(fd)
                        // upload mutation
                    }}
                    className="btn btn-success">Send Media</button>
            </form>
        </dialog>
    </>
}

export default Messages