import React from "react";
import { useState } from "react";
import icon from '../../img/favicon.png';
import './LoginSignUp.css';

export default function LoginSignUp() {
    const [userAction, setUserAction] = useState('Login');

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
                        <input type="text" className='info-input' placeholder="User Name" />
                    </div>}
                    <div>
                        <div className='info-format'>Email Address: </div>
                        <input type="text" className='info-input' placeholder="Email Address" />
                    </div>
                    <div>
                        <div className='info-format'>Password: </div>
                        <input type="password" className='info-input' placeholder="Password" />
                    </div>
                    <div className='flex gap-6 pt-2'>
                        <button 
                            className={"rounded-lg py-1 px-2 mt-2 " + (userAction==='Login'? "font-button-highlight" : "font-button")}
                            onClick={() => setUserAction('Login')} >
                                Login
                        </button>
                        <button className='rounded-lg py-1 px-2 mt-2 font-button'>Login with Google</button>
                        <button className={"rounded-lg py-1 px-2 mt-2 " + (userAction==="Sign Up" ? "font-button-highlight" : "font-button")}
                            onClick={() => setUserAction('Sign Up')} >
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}