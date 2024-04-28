import React, { useState, useEffect } from "react";
import { auth, db } from '../firebase/firebase';
import ChatRoomPreview from "./ChatRoomPreview";
import { useNavigate } from 'react-router-dom';
import { ref, get, set, push, onValue } from "firebase/database";
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
                // setUserData(prevUserData => ({
                //     ...prevUserData,
                //     rooms: [...prevUserData.rooms, newChatRoomRef.key]
                // }));
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
                onValue(userRef, (snapshot) => {
                    setUserData(snapshot.val());
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
        <div className="flex flex-col bg-card h-screen w-1/4 md:px-12 md:py-8 px-6 py-4 overflow-hidden">

            {userData && (
                <div>
                    <div className="flex justify-center items-center">
                        <img src={userData.photoURL} alt="user" width={100} height={100} className="rounded-full" />
                    </div>
                    <div className="pt-5 pl-3">
                        <div className="flex justify-center items-center gap-6">
                            <div className="info-format">{userData.displayName}</div>
                            <button className="font-logout hidden md:flex" onClick={() => logOut()}>Log out</button>
                        </div>
                        <button className="flex justify-center items-center w-full font-logout md:hidden" onClick={() => logOut()}>Log out</button>
                        <p className="flex justify-center items-center info-format overflow-hidden hidden sm:flex">{userData.email}</p>
                    </div>
                </div>
            )}

            <div className="flex-grow overflow-auto">
                {userData && userData.rooms && userData.rooms.map((chatRoom) => (
                    <ChatRoomPreview roomID={chatRoom} roomOnClick={roomOnClick} />
                ))}
            </div>

            {/* <div className="flex-grow"></div> */}

            <div className="self-end w-full py-4 flex justify-center items-center btn-chatRoomPreview">
                <div className="">
                    <button className="flex justify-center items-center gap-4 h-1/6 " onClick={addChatRoom}>
                        <img src={addition} width={25} height={25} className=""></img>
                        <div className="font-chatRoomPreview flex items-center justify-center hidden lg:flex">Create Chat Room</div>
                    </button>
                </div>
            </div>
        </div>
    );
}