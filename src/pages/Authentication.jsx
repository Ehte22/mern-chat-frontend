import React, { useState } from 'react'
import Login from '../components/Login'
import Register from '../components/Register'

const Authentication = () => {
    const [showLogin, setShowLogin] = useState(true)
    const toggle = e => setShowLogin(!showLogin)
    return <>
        <div className='flex '>
            <div className='h-screen hidden md:block'>
                <img className='h-full' src="https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
            </div>
            <div className='flex-grow h-screen flex justify-center items-center'>
                {showLogin ? <Login toggle={toggle} /> : <Register toggle={toggle} />}
            </div>
        </div>
    </>
}

export default Authentication