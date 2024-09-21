import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer , toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css'; // Make sure to create and import a CSS file for styling

const Login = () => {
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [error, setError] = useState('');

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (email !== process.env.ADMIN_ID) {
  //     setError('The email is incorrect');
  //   } else if (password !== process.env.ADMIN_PASSWORD) {
  //     setError('The password is incorrect');
  //   } else {
  //       sessionStorage.setItem("mamaLovelyToyToken",true)
  //       window.location.href="/dashboard";
  //   }
  // };

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    email: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }
  const handleSubmit = async (event) => {
    setLoading(true)
    event.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/admin-login`, formData);
      setLoading(false)
      console.log(response.data);
      if (response.data.user.Role === "User") {
        toast.error("You have not authorised person")
        console.error("You have not authorised person")
      }
      else {
        toast.success('Login SuccessFull')
        sessionStorage.setItem('mamaLovelyToyToken', response.data.token);
        sessionStorage.setItem('mamaLovelyToyUser', JSON.stringify(response.data.user));
        window.location.href = ('/dashboard')
      }

    } catch (error) {
      console.log("Error While Login", error)
      if (error.response && error.response.data) {
        console.log("error.response", error)
        console.log(error.response.data);
        toast.error(error.response.data.msg);
      } else {
        console.log(error.response.data.msg);  // Fallback to the error's message if no response
        toast.error('An unexpected error occurred');
      }

      setLoading(false);
    }
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }, [])

  return (
    <>
    <ToastContainer/>
      <div className="main-login">
        <div className="login-container">
          <h2 className="login-title">Admin Login</h2>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                name='email'
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
                name='password'
              />
            </div>
            <button type="submit" disabled={loading} className={`login-button ${loading ? 'not-allowed' : 'allowed'}`} >{loading ? "Please Wait ..." : "Login"}</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
