import React, { useEffect } from 'react'
import { useFormik } from "formik"
import { useNavigate } from "react-router-dom"
import * as yup from "yup"
import { toast } from "react-toastify"
import { motion } from 'framer-motion'
import { useRegisterMutation } from '../redux/apis/authApi'

const Register = ({ toggle }) => {
    const navigate = useNavigate()
    const [register, { isSuccess }] = useRegisterMutation()
    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            mobile: "",
            password: "",
        },
        validationSchema: yup.object({
            name: yup.string().required("Enter Name"),
            email: yup.string().required("Enter Email"),
            mobile: yup.string().required("Enter Mobile"),
            password: yup.string().required("Enter Password"),
        }),
        onSubmit: (values, { resetForm }) => {
            register(values)
            resetForm()
        }
    })
    useEffect(() => {
        if (isSuccess) {
            toast.success("register Success")
            toggle()
        }
    }, [isSuccess])
    return <>
        <div className="card card-compact w-96 bg-base-100 shadow-xl">
            <form onSubmit={formik.handleSubmit}>
                <div className="card-body overflow-hidden">
                    <h2 className="card-title">Register</h2>
                    <motion.input
                        {...formik.getFieldProps("name")}
                        initial={{ x: "-200%" }}
                        animate={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                        type="text"
                        placeholder="Enter Name"
                        className={`input input-bordered w-full ${(formik.touched.name && formik.errors.name) && "input-error"}`} />
                    {(formik.touched.name && formik.errors.name) && <p className='text-red-500'>{formik.errors.name}</p>}
                    <motion.input
                        {...formik.getFieldProps("mobile")}
                        initial={{ x: "-200%" }}
                        animate={{ x: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        type="number"
                        placeholder="Enter Mobile Number"
                        className={`input input-bordered w-full ${(formik.touched.mobile && formik.errors.mobile) && "input-error"}`} />
                    {(formik.touched.mobile && formik.errors.mobile) && <p className='text-red-500'>{formik.errors.mobile}</p>}
                    <motion.input
                        {...formik.getFieldProps("email")}
                        initial={{ x: "-200%" }}
                        animate={{ x: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                        type="email"
                        placeholder="Enter Email"
                        className={`input input-bordered w-full ${(formik.touched.email && formik.errors.email) && "input-error"}`} />
                    {(formik.touched.email && formik.errors.email) && <p className='text-red-500'>{formik.errors.email}</p>}
                    <motion.input
                        {...formik.getFieldProps("password")}
                        initial={{ x: "-200%" }}
                        animate={{ x: 0 }}
                        transition={{ duration: 0.3, delay: 0.6 }}
                        type="password"
                        placeholder="Enter Password"
                        className={`input input-bordered w-full ${(formik.touched.password && formik.errors.password) && "input-error"}`} />
                    {(formik.touched.password && formik.errors.password) && <p className='text-red-500'>{formik.errors.password}</p>}
                    <motion.button
                        type='submit'
                        initial={{ x: "-200%" }}
                        animate={{ x: 0 }}
                        transition={{ duration: 0.3, delay: 0.8 }}
                        className="p-3 rounded-md bg-green-400 text-black">Register</motion.button>
                    <motion.p
                        initial={{ y: "200%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.3, delay: 1 }}
                    >Already Have Account? <span onClick={toggle} className='cursor-pointer text-blue-400'>Login To Account</span> </motion.p>
                </div>
            </form>
        </div>
    </>
}

export default Register