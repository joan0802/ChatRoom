import React from "react";
import { useState, useEffect } from "react";
import icon from '../../img/favicon.png';
import './LoginSignUp.css';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase/firebase';
import { ref, set } from "firebase/database";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import photo from "../../img/user.png"

export default function LoginSignUp() {
    const [userAction, setUserAction] = useState('Login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/home');
        }
    }, [isLoggedIn]);

    async function SignUp() {
        if (userAction === 'Sign Up') {
            try {
                const result = await createUserWithEmailAndPassword(auth, email, password);
                const user = result.user;
                const userRef = ref(db, 'users/' + user.uid);
                await set(userRef, {
                    displayName: userName,
                    email: email,
                    photoURL: photo,
                    rooms: ["-NwUuilzn5hC97QANytz"]
                })
                alert('Sign up successfully!');
                setUserAction('Login');
            }
            catch (error) {
                console.log(error.message);
            }
        }
        else
            setUserAction('Sign Up');
        setEmail('');
        setPassword('');
        setUserName('');
    }
    async function Login() {
        if (userAction === 'Login') {
            await signInWithEmailAndPassword(auth, email, password)
                .then((user) => {
                    // alert('Login successfully!');
                    setIsLoggedIn(true);
                    console.log(user);
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
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const userRef = ref(db, 'users/' + user.uid);
            await set(userRef, {
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                rooms: ["-NwUuilzn5hC97QANytz"]
            })
            setIsLoggedIn(true);
            // console.log(user);
        }
        catch (error) {
            alert(error.message);
        }
    }

    return (
        <div className='App bg-main'>
            <div className="bg-main flex min-h-screen items-center justify-center">
                <div className='lg:w-2/5 w-3/5 h-full bg-white rounded-lg bg-card lg:px-16 lg:pb-16 lg:pt-14 px-6 pt-6 pb-8 gap-6'>
                    <div className="flex justify-center">
                        <img src={icon} className="pb-6" alt="logo" width={120} height={120} />
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
                    <div className='flex gap-6 pt-2 justify-between'>
                        <button
                            className={"rounded-lg lg:py-1 lg:px-3 lg:mt-2 p-1 btn-input " + (userAction === 'Login' ? "font-button-highlight" : "font-button")}
                            onClick={() => Login()} >
                            <div className="font-button-text">Login</div>
                        </button>
                        <button className='rounded-lg lg:py-1 lg:px-3 lg:mt-2 p-1 font-button btn-input' onClick={() => LoginWithGoogle()}>
                            <div className="font-button-text">Login with Google</div>
                        </button>
                        <button className={"rounded-lg lg:py-1 lg:px-3 lg:mt-2 p-1 btn-input " + (userAction === "Sign Up" ? "font-button-highlight" : "font-button")}
                            onClick={() => SignUp()} >
                            <div className="font-button-text">Sign Up</div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}