import "./register.css"
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import CancelIcon from '@mui/icons-material/Cancel';
import {useRef} from "react";
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

export default function Register({setShowRegister,locStorage, setCurrentUser}) {
  const nameRef = useRef();
  const emailRef = useRef();
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
          const newUser = {
            username: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
          }
            const {data} = await axios.post("/users/register",newUser)
            if(data.status===false){
              toast.error(data.msg,toastOptions);
            }
            locStorage.setItem('user',data.username);
            setCurrentUser(data.username);
            setShowRegister(false)
        }
      };

      const handleValidation = () =>{
        const newUser = {
          username: nameRef.current.value,
          email: emailRef.current.value,
          password: passwordRef.current.value,
        }
        
        if (newUser.username===""&&newUser.email===""&&newUser.password===""){
          toast.error("All fields are required", toastOptions);
          return false;
        }
        else if (newUser.email===""&&newUser.password===""){
          toast.error("Email and Password are required", toastOptions);
          return false;
        }
        //else if(password!==confirmPassword){
       //   toast.error("Passwords do not match", toastOptions);
        //  return false;
       // } 
          else if (newUser.username===""){
          toast.error("Username is required", toastOptions);
          return false;
        }
          else if (newUser.username.length<3){
          toast.error("Username should be at least 3 characters long", toastOptions); 
          return false;
        } 
          else if (newUser.password===""){
          toast.error("Password is required", toastOptions);
          return false;
        }
          else if (newUser.password.length<8){
          toast.error("Password should be at least 8 characters long", toastOptions);
          return false;
        } 
          else if(newUser.email===""){
          toast.error("Email is required",toastOptions);
          return false;
        }
        return true;
      }

    
    return(
        <div className="registerContainer">
            <div className="logo">
                <LocationSearchingIcon className="logo"/>
                MapU
            </div>
            <form className='registerForm' onSubmit={(event)=>handleSubmit(event)}>
            <input className='textFields' type="text" placeholder="Username" ref={nameRef} />
            <input className='textFields' type="email" placeholder="Email Address" ref={emailRef} />
            <input className='textFields' type="password" placeholder="Password" ref={passwordRef} />
            <button className="register-btn">Register</button>
            
 
            </form>
            <CancelIcon className='registerCancel' onClick={()=>setShowRegister(false)}/>
            <ToastContainer/>
        </div>
    )
}