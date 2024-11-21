import React, { useEffect } from 'react'
import { motion } from "framer-motion"
import { useFormik } from "formik"
import { useNavigate } from "react-router-dom"
import * as yup from "yup"
import { toast } from "react-toastify"
import { useLoginMutation } from '../redux/apis/authApi'
import { useSelector } from 'react-redux'

const Login = ({ toggle }) => {
    const { user, logout } = useSelector(state => state.auth)
    const navigate = useNavigate()
    const [login, { isSuccess }] = useLoginMutation()
    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: yup.object({
            username: yup.string().required("Enter Mobile Or Email"),
            password: yup.string().required("Enter Password"),
        }),
        onSubmit: (values, { resetForm }) => {
            login(values)
            resetForm()
        }
    })
    useEffect(() => {
        if (isSuccess) toast.success("Login Success")
    }, [isSuccess])

    useEffect(() => {
        if (user) {
            navigate("/chat")
        } else if (logout) {
            toast.success("Logout Success")
        }
    }, [user, isSuccess])
    return <>
        <div className="card card-compact w-96 bg-base-100 shadow-xl">
            <form onSubmit={formik.handleSubmit}>
                <div className="card-body overflow-hidden">
                    <h2 className="card-title">Login</h2>
                    <motion.input
                        {...formik.getFieldProps("username")}
                        initial={{ x: "-200%" }}
                        animate={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                        type="text"
                        placeholder="Enter Mobile or Email"
                        className={`input input-bordered w-full ${(formik.touched.username && formik.errors.username) && "input-error"}`} />
                    <motion.input
                        {...formik.getFieldProps("password")}
                        initial={{ x: "-200%" }}
                        animate={{ x: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        type="password"
                        placeholder="Enter Password"
                        className={`input input-bordered w-full ${(formik.touched.password && formik.errors.password) && "input-error"}`} />
                    <motion.button
                        initial={{ x: "-200%" }}
                        animate={{ x: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                        type='submit'
                        className="p-3 rounded-md bg-green-400 text-black">Login</motion.button>
                    <motion.p
                        initial={{ y: "200%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.3, delay: 0.6 }}
                    >Don't Have Account? <span onClick={toggle} className='cursor-pointer text-blue-400'>Create Account</span> </motion.p>
                </div>
            </form>
        </div>
    </>
}

export default Login