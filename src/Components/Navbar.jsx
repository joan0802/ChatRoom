import React, { useState, useEffect } from "react";
import { auth, db } from '../firebase/firebase';
import ChatRoomPreview from "./ChatRoomPreview";
import { useNavigate } from 'react-router-dom';
import { ref, get } from "firebase/database";

export default function Navbar() {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (!user) {
                navigate('/');
            }
            else {
                const userRef = ref(db, 'users/' + user.uid);
                get(userRef).then((snapshot) => {
                    if (snapshot.exists())
                        setUserData(snapshot.val());
                    else
                        console.log('No user data found in database');
                }).catch((error) => {
                    console.error('Error fetching user data:', error);
                });
            }
        });
    }, []);

    function logOut() {
        auth.signOut().then(() => {
            navigate('/');
            alert('Logged out successfully!');
        }).catch((error) => {
            console.error(error);
        });
    }

    return (
        <div className="bg-card min-h-screen w-1/4 p-12">
            {userData && (
                <div className="flex justify-center items-center">
                    <img src={userData.photoURL} alt="user" width={100} height={100} className="rounded-full" />
                    <div className="pt-5 pl-3">
                        <div className="flex justify-between">
                            <p className="info-format">{userData.displayName}</p>
                            <button className="font-logout" onClick={() => logOut()}>Log out</button>
                        </div>
                        <p className="info-format">{userData.email}</p>
                    </div>
                </div>)
            }
            <div className="pt-6">
                <ChatRoomPreview />
            </div>
        </div>
    );
}