import React, { useState, useEffect } from "react";
import { auth, db, storage } from '../firebase/firebase';
import ChatRoomPreview from "./ChatRoomPreview";
import { useNavigate } from 'react-router-dom';
import { ref, get, set, push, onValue } from "firebase/database";
import addition from "../img/addition.png";
import bell from "../img/bell.png";
import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";


export default function Navbar({ uid, roomOnClick }) {
    const [userData, setUserData] = useState(null);
    const [user, setUser] = useState('');
    const [userPhoto, setUserPhoto] = useState('');
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

    const changeUserPhoto = () => {
        const fileInput = document.getElementById('file');
        fileInput.click();
    }

    const handleFileChange = (e) => {
        setUserPhoto(e.target.files[0]);
        uploadPhoto(e.target.files[0]);
    }

    const uploadPhoto = async (file) => {
        if (file) {
            const fileRef = storageRef(storage, `user_photos/${file.name}`);
            const uploadTask = await uploadBytes(fileRef, file);
            const newUserPhoto = await getDownloadURL(uploadTask.ref);
            const userRef = ref(db, 'users/' + user.uid);
            await set(userRef, {
                ...userData,
                photoURL: newUserPhoto
            });
        }
    }

    const showNotification = () => {
        console.log(Notification.permission)
        if(Notification.permission === "denied" || Notification.permission === "default") {
            Notification.requestPermission();
            console.log("not permitted");
        }
        else {
            new Notification('Notification has been enabled!');
        }
    }

    function logOut() {
        auth.signOut().then(() => {
            navigate('/');
            alert('Logged out successfully!');
        }).catch((error) => {
            console.error(error);
        });
    }

    return (
        <div className="flex flex-col bg-card h-screen w-1/4 overflow-hidden">

            {userData && (
                <div className="md:px-4 md:py-4 px-4 py-4">
                    <div className="relative flex justify-center items-center">
                        <input type="file" accept="image/*" id="file" className="hidden" onChange={handleFileChange} />
                        <button onClick={() => changeUserPhoto()}>
                            <div className="h-24 w-24">
                                <img src={userData.photoURL} alt="user" className=" rounded-full object-cover h-full w-full" />
                            </div>
                        </button>
                        <button className="absolute left-2 top-2 btn-input hidden lg:flex" onClick={() => showNotification()}>
                            <img src={bell} alt="notification" width={30} height={30} className="ml-1 my-1" />
                        </button>
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

            <div className="self-end w-full py-8 flex justify-center items-center btn-chatRoomPreview">
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