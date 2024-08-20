import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginApi } from '../apis/Api';
import '../css/loginstyle.css';

const LoginForm = () => {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const changeUserName = e => {
    setUserName(e.target.value);
  };

  const changePassword = e => {
    setPassword(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();

    const data = {
      username: username,
      password: password,
    };

    loginApi(data)
      .then(res => {
        if (res.data.success === false) {
          toast.error(res.data.message);
        } else {
          console.log(res.data)
          toast.success(res.data.message);
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user_id', res.data.user_id);
          navigate('/');
        }
      })
      .catch(err => {
        console.log(err);
        toast.error('Server Error');
      });
  };

  return (
    <div className="login-form-background">
      <div className="heading">
      </div>
      <div className="form-container">
        <h1>Sign In</h1>
        <p>Welcome Back! Please Sign in to your account</p>
        <div className="input-group">
          <label htmlFor="username">Username </label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={changeUserName}
            required />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={changePassword} required />
        </div>
        <div className="checkbox-container">
        </div>
        <Link to="/sendemail">Forgot password?</Link>
        <button onClick={handleSubmit} type="submit">Log In</button>
        <p>Don't have an account? <Link to="/register">Register now</Link></p>
      </div>
    </div>
  );
};

export default LoginForm;
