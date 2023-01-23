import "./login.css"
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import CancelIcon from '@mui/icons-material/Cancel';
import {useRef} from "react";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

export default function Login({setShowLogin,setShowRegister, locStorage, setCurrentUser}){
    const nameRef = useRef();
    const passwordRef = useRef();

    const toastOptions ={
        position:"bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
    }

    const handleSubmit =async(event) =>{
        event.preventDefault();
        if(handleValidation()){
            console.log('in validation');
            const user = {
                username: nameRef.current.value,
                password: passwordRef.current.value,
            };
            try{
                const {data} = await axios.post("/users/login",user);
                if(data.status===false){
                    toast.error(data.msg,toastOptions);
                  }
                  locStorage.setItem('user',data.username);
                  setCurrentUser(data.username);
                  setShowLogin(false)
            }
            catch(err){
                toast.error("Check Username and Password", toastOptions);
            }
        }
      };

      const handleValidation = () =>{
        const user = {
            username: nameRef.current.value,
            password: passwordRef.current.value,
        }
        if (user.username===""&&user.password===""){
          toast.error("All fields are required", toastOptions);
          return false;
        }
          else if (user.username===""){
          toast.error("Username is required", toastOptions);
          return false;
        }
          else if (user.password===""){
          toast.error("Password is required", toastOptions);
          return false;
        }
        return true;
      }

      const switchUp = () =>{
        setShowLogin(false)
        setShowRegister(true)
      }
    
    return(
        <div className="loginContainer">
            <div className="logo">
                <LocationSearchingIcon className="logo"/>
                MapU
            </div>
            <form className='loginForm' onSubmit={(event)=>handleSubmit(event)}>
              <input className='textFields' type="text" placeholder="Username" ref={nameRef}/>
              <input className='textFields' type="password" placeholder="Password"ref={passwordRef}/>
              <button className="login-btn">Login</button>
              <span className='switchUser'>Don't have an account? <button className='switchUserLink' onClick={() => switchUp()}>Register</button></span>
            </form>
            <CancelIcon className='loginCancel' onClick={()=>setShowLogin(false)}/>
            <ToastContainer/>
        </div>
    )
}