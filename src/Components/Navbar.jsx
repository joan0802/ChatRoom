import React, { useState, useEffect } from "react";
import { auth, db } from '../firebase/firebase';
import ChatRoomPreview from "./ChatRoomPreview";
import { useNavigate } from 'react-router-dom';
import { ref, get, set, push } from "firebase/database";
import addition from "../img/addition.png";

export default function Navbar({ uid, roomOnClick }) {
    const [userData, setUserData] = useState(null);
    const [user, setUser] = useState('');
    const navigate = useNavigate();

    async function addChatRoom() {
        const chatRoomName = prompt('Enter the name of the chat room:');
        if (chatRoomName) {
            const chatRoomsRef = ref(db, 'chatRooms/');
            const userRef = ref(db, 'users/' + user.uid);
            try {
                const newChatRoomRef = push(chatRoomsRef);
                await set(newChatRoomRef, {
                    name: chatRoomName,
                    users: [user.uid],
                    messages: []
                });
                await set(userRef, {
                    ...userData,
                    rooms: [...userData.rooms, newChatRoomRef.key]
                })
                alert('Chat room created successfully!');
            } catch (error) {
                console.error(error);
            }
        }
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

    function logOut() {
        auth.signOut().then(() => {
            navigate('/');
            alert('Logged out successfully!');
        }).catch((error) => {
            console.error(error);
        });
    }

    return (
        <div className="relative bg-card min-h-screen w-1/4 px-4 py-8">
            {userData && (
                <div>
                    <div className="flex justify-center items-center">
                        <img src={userData.photoURL} alt="user" width={100} height={100} className="rounded-full" />
                    </div>
                    <div className="pt-5 pl-3">
                        <div className="flex justify-center items-center gap-6">
                            <div className="info-format">{userData.displayName}</div>
                            <button className="font-logout" onClick={() => logOut()}>Log out</button>
                        </div>
                        <p className="flex justify-center items-center info-format">{userData.email}</p>
                    </div>
                </div>
            )}
            <div>
                {userData && userData.rooms && userData.rooms.map((chatRoom) => (
                    <ChatRoomPreview roomID={chatRoom} roomOnClick={roomOnClick}/>
                ))}
            </div>
            <div className="absolute bottom-10 flex justify-center items-center">
                <button className="flex justify-center items-center gap-4 h-1/6" onClick={addChatRoom}>
                    <img src={addition} width={25} height={25}></img>
                    <div className="font-chatRoomPreview flex items-center justify-center">Create Chat Room</div>
                </button>
            </div>
        </div>
    );
}