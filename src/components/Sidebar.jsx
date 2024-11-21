import React, { useEffect, useState, useRef } from 'react'
import { GrAdd, GrAnnounce } from "react-icons/gr";
import { MdGroups } from "react-icons/md";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { AiFillMessage } from "react-icons/ai";
import { BiMessageSquareAdd, BiPoll } from "react-icons/bi";
import { TbDotsVertical } from "react-icons/tb";
import { IoDocumentText, IoFilter } from "react-icons/io5";
import { motion } from "framer-motion"
import { IoMdPhotos } from 'react-icons/io';
import { BsCameraFill, BsFillPersonFill } from 'react-icons/bs';
import { PiStickerFill } from 'react-icons/pi';
import { useLogoutMutation } from '../redux/apis/authApi';
import { toast } from 'react-toastify';
import { useCreateContactMutation, useCreateGroupMutation, useGetContactsQuery } from '../redux/apis/chatApi';
import { useSelector, useDispatch } from 'react-redux';

import { CiCamera } from "react-icons/ci";
import { GoPencil } from "react-icons/go";
import { IoMdCheckmark } from "react-icons/io";
import { IoMdArrowBack } from "react-icons/io";
import { useLazySearchProfileQuery, useUpdateProfileMutation } from '../redux/apis/userApi';
import { setSelectedUser } from '../redux/slices/chatSlice';

const Sidebar = ({ width, toggle, showSidebar, onlineUsers, socket }) => {
    console.log(onlineUsers)
    const dispatch = useDispatch()
    const { data, refetch } = useGetContactsQuery()
    useEffect(() => {
        refetch()
    }, [])

    useEffect(() => {
        socket.on("contact-response", () => refetch())
    }, [])

    return <div className={`h-screen  ${width <= 768 ? "w-full" : "w-96"}  flex flex-col`}>

        <SidebarProfile width={width} toggle={toggle} showSidebar={showSidebar} />
        <div className='bg-[#111B21] flex-grow overflow-y-auto flex flex-col justify-cente'>
            {
                data && data.map((item, i) => <div
                    key={`user-${i}`}
                    onClick={e => {
                        dispatch(setSelectedUser(item))
                        toggle()
                        if (item.isGroup) {
                            socket.emit("join-group", item)
                        }
                    }}
                    className='flex justify-between items-center  px-3 py-2 cursor-pointer hover:bg-[#16282f] '>
                    <div className='flex gap-2 items-center'>
                        <div className='relative'>
                            {

                                onlineUsers.some(u => u.uid === item._id) && <div className=" size-2 rounded-full bg-green-400 absolute right-0 top-1"></div>

                            }
                            <img
                                className='h-12 w-12 rounded-full object-cover'
                                src={`${import.meta.env.VITE_BACKEND_URL}/${item.photo}`} alt={item.name} />
                        </div>
                        <div>
                            <strong>{item.name}</strong>
                            <p className='text-xs'>Lorem ipsum dolor sit amet.</p>
                        </div>
                    </div>
                    <div className='text-center flex flex-col items-center gap-1 justify-center mt-4'>
                        <div className=' text-[12px]'>10:30 Am</div>
                        <div className="size-4 bg-green-600 text-xs p-2 flex justify-center items-center text-black rounded-full">2</div>
                    </div>
                </div>)
            }
        </div>

    </div >
}

const SidebarProfile = ({ width, toggle, showSidebar }) => {
    const [showDrawer, setShowDrawer] = useState(false)
    const toggleDrawer = () => setShowDrawer(!showDrawer)
    const { user } = useSelector(state => state.auth)
    const [logout] = useLogoutMutation()
    const PROFILE_ACTIONS = [
        { icon: <GrAnnounce />, to: "" },
        { icon: <MdGroups />, to: "" },
        { icon: <AiFillMessage />, to: "" },
        { icon: <BiMessageSquareAdd />, to: "" },
    ]

    return <>
        <div className='flex justify-between items-center  px-4 py-2 bg-[#202C33]'>
            <div className="drawer">
                <input checked={showDrawer} id="my-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    <label htmlFor="my-drawer" className=" drawer-button" onClick={e => setShowDrawer(true)}>
                        <motion.img
                            initial={{ x: "-200%" }}
                            animate={{ x: 0 }}
                            transition={{ duration: 0.3 }}
                            className='h-12 w-12 rounded-full object-cover cursor-pointer'
                            src={`${import.meta.env.VITE_BACKEND_URL}/${user.photo}`} alt="" />
                    </label>
                </div>
                <div className="drawer-side z-50">
                    <label htmlFor="my-drawer" className="drawer-overlay"></label>
                    <ul className={`menu m-0 p-0 ${width <= 768 ? "w-full" : "w-72"} h-full bg-base-200 text-base-content`}>
                        <UpdateProfile toggleDrawer={toggleDrawer} />
                    </ul>
                </div>
            </div>


            <div className='flex gap-5 text-xl'>

                {
                    PROFILE_ACTIONS.map((item, i) => <motion.span
                        key={`PROFILE_ACTIONS-${i}`}
                        initial={{ y: "-200%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 * i }}>
                        {item.icon}
                    </motion.span>)
                }

                <motion.div
                    initial={{ y: "-200%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                    className={`dropdown ${(width <= 768) ? "dropdown-left" : "dropdown-right"}  `}
                >
                    <div tabIndex={0} role="button" className="text-2xl">
                        <TbDotsVertical />
                    </div>
                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 text-lg ">
                        <li onClick={e => window.createGroup.showModal()}><a className='text-purple-700 '>< IoDocumentText /> <span className='text-slate-400 text-sm'>+ Create Group</span> </a></li>
                        <li onClick={logout}><a className='text-green-800 '>< PiStickerFill /> <span className='text-slate-400 text-sm'>Logout</span> </a></li>

                    </ul>
                </motion.div>

            </div>
        </div>
        <div className='flex items-center gap-2 my-2 px-1 bg-[#111B21] '>
            <input type="text" onClick={e => window.searchModal.showModal()} placeholder="Type here" className="input input-bordered w-full " />
            <span className='text-2xl'><IoFilter /></span>
        </div>
        <CreateGroup />
        <SearchUser />
    </>
}

const UpdateProfile = ({ toggleDrawer }) => {
    const [profile, setProfile] = useState({ name: false, email: false, mobile: false })
    const { user } = useSelector(state => state.auth)
    const [profileData, setProfileData] = useState(user)
    const photoRef = useRef()
    const [profilePhoto, setProfilePhoto] = useState({})
    const [updateProfile, { isSuccess }] = useUpdateProfileMutation()

    useEffect(() => {
        if (isSuccess) toast.success("Profile Update Success")
    }, [isSuccess])

    return <>
        <div className='h-40 bg-[#212B32] '>
            <div className='flex gap-4 mx-3 mt-3'>
                <span onClick={toggleDrawer} className='text-2xl cursor-pointer'><IoMdArrowBack /></span>
                <span className='text-lg'>Profile</span>
            </div>
            <div className='relative flex justify-center h-full group  '>
                <input onChange={e => {
                    setProfilePhoto({ photo: e.target.files[0], preview: URL.createObjectURL(e.target.files[0]) })
                    window.my_modal_4.showModal()
                }} ref={photoRef} type="file" className='hidden' />
                <motion.img
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className='h-24 w-24 rounded-full object-cover absolute -bottom-0  '
                    src={`${import.meta.env.VITE_BACKEND_URL}/${user.photo}`} alt="" />
                <div onClick={e => photoRef.current.click()} className='hidden group-hover:flex absolute bottom-0 bg-gray-500 bg-opacity-65 h-24 w-24 rounded-full justify-center items-center text-white p-2 cursor-pointer text-center text-xs flex-col '>
                    <motion.div
                        initial={{ y: "-50%" }}
                        whileInView={{ y: 0 }}
                        transition={{ duration: 0.3, }}
                        className='text-lg'><CiCamera /></motion.div>
                    <motion.div
                        initial={{ y: "50%" }}
                        whileInView={{ y: 0 }}
                        transition={{ duration: 0.3, }}
                    >Change Profile Photo</motion.div>
                </div>
            </div>
        </div>
        <div className='mt-20'>
            <div className='flex justify-between items-center p-4 group hover:bg-green-400 transition-all duration-300 hover:text-black cursor-pointer'>
                <div>
                    <span className='text-xs text-gray-500'>Your Name</span>
                    {
                        profile.name
                            ? <input
                                value={profileData.name}
                                onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                                type="text"
                                placeholder="Type here"
                                className="input input-bordered w-full max-w-xs group-hover:text-white" />
                            : <div className=' uppercase'>{user.name}</div>
                    }
                </div>
                {
                    profile.name
                        ? <span
                            onClick={e => {
                                const fd = new FormData()
                                fd.append("name", profileData.name)
                                updateProfile(fd)
                                setProfile({ ...profile, name: !profile.name })
                            }} className='text-2xl'>
                            <IoMdCheckmark />
                        </span>
                        : <span
                            className='text-lg'
                            onClick={e => setProfile({ ...profile, name: !profile.name })}>
                            <GoPencil />
                        </span>
                }


            </div>
            <div className='flex justify-between items-center p-4 group hover:bg-green-400 transition-all duration-300 hover:text-black cursor-pointer'>
                <div>
                    <span className='text-xs text-gray-500'>Your Email</span>
                    {
                        profile.email
                            ? <input
                                value={profileData.email}
                                onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                                type="text"
                                placeholder="Type here"
                                className="input input-bordered w-full max-w-xs group-hover:text-white" />
                            : <div className=' uppercase'>{user.email}</div>
                    }
                </div>
                {
                    profile.email
                        ? <span
                            onClick={e => {
                                const fd = new FormData()
                                fd.append("email", profileData.email)
                                updateProfile(fd)
                                setProfile({ ...profile, email: !profile.email })
                            }} className='text-2xl'>
                            <IoMdCheckmark />
                        </span>
                        : <span
                            className='text-lg'
                            onClick={e => setProfile({ ...profile, email: !profile.email })}>
                            <GoPencil />
                        </span>
                }
            </div>

            <div className='flex justify-between items-center p-4 group hover:bg-green-400 transition-all duration-300 hover:text-black cursor-pointer'>
                <div>
                    <span className='text-xs text-gray-500'>Your mobile</span>
                    {
                        profile.mobile
                            ? <input
                                value={profileData.mobile}
                                onChange={e => setProfileData({ ...profileData, mobile: e.target.value })}
                                type="text"
                                placeholder="Type here"
                                className="input input-bordered w-full max-w-xs group-hover:text-white" />
                            : <div className=' uppercase'>{user.mobile}</div>
                    }
                </div>
                {
                    profile.mobile
                        ? <span
                            onClick={e => {
                                const fd = new FormData()
                                fd.append("mobile", profileData.mobile)
                                updateProfile(fd)
                                setProfile({ ...profile, mobile: !profile.mobile })
                            }} className='text-2xl'>
                            <IoMdCheckmark />
                        </span>
                        : <span
                            className='text-lg'
                            onClick={e => setProfile({ ...profile, mobile: !profile.mobile })}>
                            <GoPencil />
                        </span>
                }
            </div>

        </div>


        {/* file upload modal */}
        {/* <button className="btn" onClick={() => window.my_modal_3.showModal()}>open modal</button> */}
        <dialog id="my_modal_4" className="modal">
            <form method="dialog" className="modal-box">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                <img src={profilePhoto.preview} height={200} alt="" />
                <button
                    onClick={e => {
                        const fd = new FormData()
                        fd.append("photo", profilePhoto.photo)
                        // uploadMutaion 
                        updateProfile(fd)
                    }}
                    className="btn btn-success my-2"
                >Update  Profile</button>
            </form>
        </dialog>


    </>
}

const CreateGroup = e => {
    const [groupData, setGroupData] = useState({})
    const { data } = useGetContactsQuery()
    const [addGroup] = useCreateGroupMutation()
    const handleChange = e => {
        const { name, value, type, checked } = e.target
        if (type === "checkbox") {
            groupData[name]
                ? checked
                    ? setGroupData({ ...groupData, [name]: [...groupData[name], value] })
                    : setGroupData({ ...groupData, [name]: groupData[name].filter(item => item !== value) })
                : setGroupData({ ...groupData, [name]: [value] })
        } else {
            setGroupData({ ...groupData, [name]: value })
        }
    }
    return <>
        {/* <button className="btn" onClick={() => window.createGroup.showModal()}>open modal</button> */}
        <dialog id="createGroup" className="modal">
            <form method="dialog" className="modal-box">
                <input name='name' onChange={handleChange} type="text" placeholder="Group Name" className="input input-bordered w-full" />
                {
                    data && data.map(item => <div className='mt-4' key={item._id}>
                        <div className="form-control">
                            <label className="label cursor-pointer">
                                <span className="label-text">{item.name}</span>
                                <input
                                    value={item._id}
                                    name='users'
                                    onChange={handleChange}
                                    type="checkbox" className="checkbox checkbox-success" />
                            </label>
                        </div>
                    </div>)
                }
                <button onClick={e => addGroup(groupData)} className="btn btn-success mt-4 w-full">Create Group</button>
            </form>
        </dialog>
    </>
}

const SearchUser = e => {
    const [createContact, { isSuccess }] = useCreateContactMutation()
    const [searchProfile, { data }] = useLazySearchProfileQuery()
    const { data: contacts } = useGetContactsQuery()
    const [search, setsearch] = useState("")
    useEffect(() => {
        let id
        if (search) {
            id = setTimeout(() => {
                searchProfile(search)
            }, 600)
        }

        return () => clearTimeout(id)
    }, [search])

    return <>
        {/* <button className="btn" onClick={() => window.my_modal_3.showModal()}>open modal</button> */}
        <dialog id="searchModal" className="modal">
            <form method="dialog" className="modal-box">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                <input
                    onChange={e => setsearch(e.target.value)}
                    value={search}
                    type="text"
                    placeholder="Type here"
                    className="my-6 input input-bordered w-full" />
                {
                    data && data.map(item => <div>
                        <div className="form-control">
                            <label className="label cursor-pointer">
                                <span className='label-text flex flex-col'>
                                    <span>{item.name}</span>
                                    <span className='text-xs'>{item.email} | {item.mobile}</span>

                                </span>
                                <button
                                    onClick={e => createContact({ reciver: item._id })}
                                    disabled={contacts.some(c => c._id === item._id)}
                                    className='btn btn-primary btn-sm'>
                                    Chat Now
                                </button>
                            </label>
                        </div>
                    </div>)
                }

            </form>
        </dialog>
    </>
}

export default Sidebar 