import React from "react";
import Navbar from "./Components/Navbar";
import ChatRoom from "./Components/ChatRoom/ChatRoom";
import { useState, useEffect } from "react";
import { auth, db } from './firebase/firebase';
import { ref, get, set } from "firebase/database";
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const [userData, setUserData] = useState(null);
    const [user, setUser] = useState(null);
    const [room, setRoom] = useState(null);
    const navigate = useNavigate();

    const roomOnClick = (roomID) => {
        setRoom(roomID);
        console.log(roomID);
    }

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (!user) {
                navigate('/');
            }
            else {
                setUser(user);
                const userRef = ref(db, 'users/' + user.uid);
                get(userRef).then((snapshot) => {
                    if (snapshot.exists())
                        setUserData(snapshot.val());
                    else
                        console.log('data not found');
                }).catch((error) => {
                    console.error(error);
                });
            }
        });
    }, []);

    return (
        <div className="bg-main flex">
            {/* <h1>Home</h1> */}
            {user && <Navbar roomOnClick={roomOnClick}/>}
            {room && <ChatRoom uid={user.uid} roomID={room}/>}
        </div>
    );
}