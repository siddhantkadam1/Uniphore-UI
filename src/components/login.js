import * as React from "react";
import "../../src/App.css";
import "../../src/styles/login.css";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Switch from "@mui/material/Switch";
import FormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { purple } from '@mui/material/colors';
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { env } from '../environments'
import { useAuth } from "../context/auth";
import useLocalStorage from "./custome-hooks/UseLocalStorage";
import { AES, enc } from 'crypto-js';


const CLIENT_ID = '27a85043626d4575301c';

function Login() {
  const label = { inputProps: { "aria-label": "Color switch demo" } };
  const [rerender, setRerender] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [user, setUser] = React.useState({ user_name: '', token: '' })
  const [error, setError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
  const { user: loggedInUser, login } = useAuth();
  const navigate = useNavigate();

 

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: '#02387A',
    '&:hover': {
      backgroundColor: '#02387A',
    },
  }));

  const isAllDataFilled = () => {
    for (let key in user) {
      if (!user[key].trim()) {
        return false;
      }
    }
    return true;
  }

  const handleChange = (e) => {
    let { name, value } = e.target;
    setUser({ ...user, [name]: value.trim() });
  }


  const handleUserLogin = (e)=>{
    let payload = {}
    payload['username'] = 'superuseradmin'
    payload['password'] = 'uniphore@123'
    axios.post(`${env.BASE_URL}:${env.PORT}/login`, payload)
    .then(res => {
      const access_token = JSON.stringify(res.data?.access); 
      localStorage.setItem('token', access_token); 
      navigate('/dashboard',{replace:true})
    })
    .catch(error => {
      console.error(error);
      setErrorMsg("Something went wrong")
    });
  }



  const handleLogin = (e) => {
    if (!isAllDataFilled()) {
      setError(true);
    } else {
      setError(false);
    }
    setError(false);
    setErrorMsg('');
    let payload = {};
    payload['git_username'] = user.user_name;
    payload['token'] = user.token;
     
    axios.post(`${env.BASE_URL}:${env.PORT}/udops/user/user_status/`, payload)
      .then(res => {
        if (res.data?.User_role.includes('User Not exist')) {
          setErrorMsg("User doesn't exist")
          return;
        }
        if (res.data?.status === undefined) {
          handleUserLogin();
          const dataToEncrypt = JSON.stringify(res.data);
          const encryptedData = AES.encrypt(dataToEncrypt, process.env.REACT_APP_SECRET_KEY).toString();
          localStorage.setItem('encryptedData', encryptedData);
        } else {
          if (res.data?.status.includes('User Not exist')) {
 
            setErrorMsg("User doesn't exist")
            return;
          }
          if (res.data?.status.includes('failed')) {
            setErrorMsg("Something went wrong")
            return;
          }
        }
      })
      .catch(error => {
        console.error(error);
        setErrorMsg("Something went wrong")
      });

  }

  function loginWithGithub() {
    window.location.assign("https://github.com/login/oauth/authorize?client_id=" + process.env.REACT_APP_CLIENT_ID);
  }

  React.useEffect(() => {
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    let codeParam = urlParams.get('code');

    if (codeParam && localStorage.getItem('accessToken') == null) {
      async function getAccessToken() {
        await fetch('http://localhost:4000/getAccessToken?code=' + codeParam)
          .then((response) => response.json())
          .then((data) => {
            if (data.access_token) {
              localStorage.setItem('accessToken', data.access_token);
              setRerender(!rerender);
              navigate('/dashboard')
            }
          })
      }
      getAccessToken();
    }
  }, [])

  return (
    <div className="container">
      <div className="login-page-container">
        <div className="login-image-container">
        </div>
        <div className="login-form-container">
          <div className="login-form-container-heading">
            <h2>UDOps</h2>
          </div>

          <div className="login-form">
            <div className="login-form-heading">
              <h2>Login with your account</h2>
            </div>

            <div className="login-form-inputs">
              <div className="userName">
                <FormControl sx={{ m: 1, width: "30ch", background: "#FFF" }} variant="outlined" required>
                  <InputLabel htmlFor="outlined-adornment-Username">
                    Github Username
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-Username"
                    label="Github Username"
                    name="user_name"
                    onChange={handleChange}
                    value={user.user_name}
                  />
                </FormControl>
              </div>
              <div className="password">
                <FormControl sx={{ m: 1, width: "30ch", background: "#FFF" }} variant="outlined" required>
                  <InputLabel htmlFor="outlined-adornment-password">
                    Github Token
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPassword ? "text" : "password"}
                    onChange={handleChange}
                    value={user.token}
                    name="token"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Github Token"
                  />
                </FormControl>
              </div>
            </div>

            {error ? <div className="required">All fields are required</div> : null}
            {errorMsg.length > 0 ? <div className="required">{errorMsg}</div> : null}
            <div className="login-form-buttons">
              {/* <div className="remember-me">
                <FormControlLabel className="poppins-font" control={<Switch />} label="Remember me" />
              </div> */}
              <div className="login">
                <ColorButton variant="contained" onClick={() => { handleLogin() }}>LOGIN</ColorButton>
              </div>
            </div>

            {/* <div className="login-form-forgot-password">
              <a className="forgotPassword">Forgot Password?</a>
            </div> */}
            {/* <div className="login-with-github" onClick={loginWithGithub}>
              Login with GitHub
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
