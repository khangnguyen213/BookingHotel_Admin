import { useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import styles from './Login.module.css';
import Global from '../global';
import axios from 'axios';

const Login = () => {
  // localStorage.removeItem("admin");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isSignUp = searchParams.get('signup') === 'true' ? true : false;
  const [usernameValidate, setUsernameValidate] = useState();
  const [passwordValidate, setPasswordValidate] = useState();
  const [err, setErr] = useState();
  const usernameRef = useRef();
  const passwordRef = useRef();
  const fullNameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const buttonClickHandler = (e) => {
    e.preventDefault();
    if (isSignUp) {
      //create admin account
      const userDetail = {
        username: usernameRef.current.value,
        password: passwordRef.current.value,
        fullName: fullNameRef.current.value,
        email: emailRef.current.value,
        phoneNumber: phoneRef.current.value,
        isAdmin: true,
      };

      axios
        .post(`${Global.BASE_BACKEND_API}/register`, userDetail)
        .then((res) => {
          localStorage.admin = JSON.stringify(result);
          navigate('/dashboard');
        })
        .catch((err) => {
          console.log(err);
          setErr(err);
        });
    } else {
      //login admin
      const userDetail = {
        username: usernameRef.current.value,
        password: passwordRef.current.value,
      };
      console.log(userDetail);

      axios
        .post(`${Global.BASE_BACKEND_API}/login`, userDetail)
        .then((res) => {
          console.log(result);
          if (result.isAdmin) {
            localStorage.admin = JSON.stringify(result);
            navigate('/dashboard');
          } else {
            setErr("This account doesn't have permission");
          }
        })
        .catch((err) => {
          console.log(err);
          setErr(err);
        });
    }
  };
  return (
    <div className={styles.container}>
      <NavBar />
      <form onSubmit={buttonClickHandler}>
        <h1>LOGIN</h1>
        <input
          type="text"
          placeholder="Username"
          ref={usernameRef}
          onBlur={(e) => {
            if (e.target.value.trim().length === 0) {
              setUsernameValidate('Please type your username');
            } else {
              setUsernameValidate();
            }
          }}
        />
        {usernameValidate && <div>{usernameValidate}</div>}
        <input
          type="password"
          placeholder="Password"
          ref={passwordRef}
          onBlur={(e) => {
            if (e.target.value.trim().length === 0) {
              setPasswordValidate('Please type your password');
            } else {
              setPasswordValidate();
            }
          }}
        />
        {passwordValidate && <div>{passwordValidate}</div>}
        {isSignUp && (
          <input type="text" placeholder="Fullname" ref={fullNameRef} />
        )}
        {isSignUp && <input type="text" placeholder="Email" ref={emailRef} />}
        {isSignUp && (
          <input type="text" placeholder="Phone number" ref={phoneRef} />
        )}
        <button onClick={buttonClickHandler}>
          {isSignUp ? 'Create new account' : 'Login'}
        </button>
        {err && <div>{err.toString()}</div>}
      </form>
    </div>
  );
};

export default Login;
