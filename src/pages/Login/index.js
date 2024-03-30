import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import NavHeader from "../../components/NavHeader";
import styles from './login.module.css'
import {Toast} from "antd-mobile";
import {Formik, ErrorMessage, useFormik} from "formik";
import {API} from "../../utils/api";
import * as Yup from "yup";

//验证规则
const REG_UNAME = /^[a-zA-Z0-9_-]{5,8}$/
const REG_PWD = /^[a-zA-Z0-9_-]{5,12}$/
const signupSchema = Yup.object().shape({
    username: Yup.string().required('用户名为必填项').matches(REG_UNAME,"长度为5-8位，只能出现数字、字母、下划线"),
    password: Yup.string().required('密码为必填项').matches(REG_PWD,"长度为5-12位，只能出现数字、字母、下划线")
})

const Login = () => {
    const navigate = useNavigate()
    const formik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        initialTouched:{
            username: false,
            password: false
        },
        validationSchema: signupSchema,
        onSubmit: async (values) => {
            const {username, password} = values

            const res = await API.post('http://localhost:8080/user/login', {
                username,
                password
            })
            const {status, body} = res.data
            if (status === 200) { //登录成功
                localStorage.setItem('hkzf_token', body.token)
                navigate('/Home/Index')
            } else {
                Toast.show({
                    content: '登录失败',
                    duration: 1500
                })
            }
        },
    });
    return (
        <div className={styles.root}>
            <NavHeader className={styles.navHeader}>帐号登录</NavHeader>
            <form onSubmit={formik.handleSubmit}>
                <div className={styles.formItem}>
                    <input
                        className={styles.input}
                        type='text'
                        name="username"
                        placeholder="请输入您的用户名"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                    />
                    {formik.touched && formik.touched.username && formik.errors.username ? <span className={styles.error}>{formik.errors.username}</span> : ''}
                </div>
                <div className={styles.formItem}>
                    <input
                        className={styles.input}
                        type="password"
                        name="password"
                        placeholder="请输入您的密码"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                    />
                    {formik.touched && formik.touched.password && formik.errors.password ? <span className={styles.error}>{formik.errors.password}</span> : ''}
                </div>
                <button className={styles.submit} type="submit">
                    登 录
                </button>
                <div className={styles.toRegister}>
                    <Link to="/Register" >还没有账号，去注册</Link>
                </div>
            </form>
        </div>
    )
}
export default Login
