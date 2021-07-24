import "./login.css";
import { useState, useRef} from "react";
import axios from "axios";
import CancelIcon from '@material-ui/icons/Cancel';



export default function Register({setShowLogin, myStorage, setCurrentUser}) {


const [error, setError] = useState(false);
const nameRef = useRef();

const  passRef = useRef();
const handleSubmit = async (e) => {
    e.preventDefault();
     const User = {
         username : nameRef.current.value,         
         password : passRef.current.value
     }
     try {
         const res = await axios.post('/users/login', User);
         myStorage.setItem("user", res.data.username)
         setShowLogin(false);
         setCurrentUser(res.data.username);
         setError(false);
         }
         catch(err){
             setError(true);
             
         }

}
    return (
        <div className = "loginContainer">
            <div className = "logo">My Favorite Places</div>
             <form onSubmit = {handleSubmit}>
                 <input type = "text" placeholder = "username" ref = {nameRef}/>
            
                 <input type = "password" placeholder = "password" ref = {passRef}/>
                 <button className = "loginBtn">Login</button>
                
                 {error && (
                 <span className = "failure"> Something went wrong</span>
                 )} 
             </form>
         <CancelIcon className = "loginCancel" onClick = {() => setShowLogin(false)}/>
        </div>
    )
}
