import React from "react";
import { useState } from "react";
import icon from '../../img/favicon.png';
import './LoginSignUp.css';
import { auth } from '../../firebase/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function LoginSignUp() {
    const [userAction, setUserAction] = useState('Login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState('');

    async function SignUp () {
        if(userAction === 'Sign Up') {
            await createUserWithEmailAndPassword(auth, email, password)
            .then((user) => {
                alert('Sign up successfully!');
            })
            .catch((error) => {
                alert(error.message);
            });
        }
        else
            setUserAction('Sign Up');
        setEmail('');
        setPassword('');
        setUserName('');
    }
    async function Login() {
        if(userAction === 'Login') {
            await signInWithEmailAndPassword(auth, email, password)
            .then((user) => {
                alert('Login successfully!');
            })
            .catch((error) => {
                alert(error.message); 
            });
        }
        else
            setUserAction('Login');
        setEmail('');
        setPassword('');
        setUserName('');
    }
    async function LoginWithGoogle() {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider)
        .then((user) => {
            alert('Login with Google successfully!');
        })
        .catch((error) => {
            alert(error.message);
        });
    }

    return (
        <div className='App bg-main'>
            <div className="bg-main flex min-h-screen items-center justify-center">
                <div className='w-2/5 h-full bg-white rounded-lg bg-card px-16 pb-16 pt-14 gap-6'>
                    <div className="flex justify-center">
                        <img src={icon} className="pb-6" alt="logo" width={120} height={120}/>
                    </div>
                    <div className='flex justify-center font-title'>{userAction}</div>
                    {userAction === 'Sign Up' && <div className='gap-3'>
                        <div className='info-format'>User Name: </div>
                        <input type="text" className='info-input' value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="User Name" />
                    </div>}
                    <div>
                        <div className='info-format'>Email Address: </div>
                        <input type="text" className='info-input' value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" />
                    </div>
                    <div>
                        <div className='info-format'>Password: </div>
                        <input type="password" className='info-input' value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                    </div>
                    <div className='flex gap-6 pt-2'>
                        <button 
                            className={"rounded-lg py-1 px-3 mt-2 " + (userAction==='Login'? "font-button-highlight" : "font-button")}
                            onClick={() => Login()} >
                                Login
                        </button>
                        <button className='rounded-lg py-1 px-3 mt-2 font-button' onClick={() => LoginWithGoogle()}>Login with Google</button>
                        <button className={"rounded-lg py-1 px-3 mt-2 " + (userAction==="Sign Up" ? "font-button-highlight" : "font-button")}
                            onClick={() => SignUp()} >
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}