//仿照登录页面自己写一个！
import React from "react";
import {Formik, useFormik, withFormik} from "formik";
import styles from './register.module.css'
import {Link, useNavigate} from "react-router-dom";
import {object, string} from "yup";
import {API} from "../../utils/api";
import {Toast} from "antd-mobile";
import NavHeader from "../../components/NavHeader";
import * as Yup from "yup";

const REG_UNAME = /^[a-zA-Z0-9_-]{5,8}$/
const REG_PWD = /^[a-zA-Z0-9_-]{5,12}$/
const loginSchema = Yup.object().shape({
    username: Yup.string().required('用户名为必填项').matches(REG_UNAME,"长度为5-8位，只能出现数字、字母、下划线"),
    password: Yup.string().required('密码为必填项').matches(REG_PWD,"长度为5-12位，只能出现数字、字母、下划线")
})

const Register = () => {
    const navigate = useNavigate()
    const formik = useFormik({
        initialValues:{
            username:'',
            password:''
        },
        validationSchema:loginSchema,
        onSubmit: async (values) => {
            const { username, password } = values
            const res = await API.post('/user/registered',{
                username,
                password
            })
            const { status, description } = res.data
            console.log(res.data)
            if(status === 201 || status === 200){ //创建用户成功
                Toast.show({
                    content:description,
                    duration:3000
                })
                localStorage.setItem('hkzf_token', res.data.body.toke)
                navigate('/Home/Index')
            }else{
                Toast.show({
                    content:description,
                    duration:1500
                })
            }
        }
    });
    return(
        <div className={styles.root}>
            <NavHeader className={styles.navHeader}>账号注册</NavHeader>
            <form onSubmit={formik.handleSubmit}>
                <div className={styles.formItem}>
                    <input
                        className={styles.input}
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                        name="username"
                        placeholder='请输入您的用户名'
                    />
                    {formik.touched && formik.touched.username && formik.errors.username ? <span className={styles.error}>{formik.errors.username}</span> : ''}
                </div>
                <div className={styles.formItem}>
                    <input
                        className={styles.input}
                        type="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        name="password"
                        placeholder='请输入您的密码'
                    />
                    {formik.touched && formik.touched.password && formik.errors.password ? <span className={styles.error}>{formik.errors.password}</span> : ''}
                </div>
                <button className={styles.submit} type="submit">
                    注  册
                </button>
                <div className={styles.toLogin}>
                    <Link to="/Login" >已有账号，去登录</Link>
                </div>
            </form>
        </div>
    )
}
export default Register
