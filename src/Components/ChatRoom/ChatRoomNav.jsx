import React from "react";
import addUser from "../../img/addUser.png";
import { useState, useEffect } from "react";
import { ref, onValue, set, get } from "firebase/database";
import { db } from "../../firebase/firebase";

export default function ChatRoomNav({ roomID }) {
    const [room, setRoom] = useState(null);
    const [userData, setUserData] = useState(null);
    const [roomData, setRoomData] = useState(null);

    function addMember() {
        const email = prompt('Enter the email of the user you want to add:');
        if (email) {
            try {
                const userRef = ref(db, 'users/');
                const roomRef = ref(db, `chatRooms/${roomID}`);
                get(userRef).then((snapshot) => {
                    const allUser = snapshot.val();
                    for (const user in allUser) {
                        if (allUser[user].email === email) {
                            const updateUserRef = ref(db, `users/${user}`);
                            set(updateUserRef, {
                                ...allUser[user],
                                rooms: [...allUser[user].rooms, roomID]
                            });
                            get(roomRef).then((snapshot) => {
                                const roomData = snapshot.val();
                                set(roomRef, {
                                    ...roomData,
                                    users: [...roomData.users, user]
                                })
                            });
                            alert('User added successfully!');
                            break;
                        }
                    }
                }
                );
            }
            catch (error) {
                alert('Error adding user:', error);
            }
        }
    }

    useEffect(() => {
        const roomRef = ref(db, `chatRooms/${roomID}`);
        try {
            onValue(roomRef, (snapshot) => {
                setRoom(snapshot.val());
            });
        }
        catch (error) {
            console.error(error);
        }
    }, [roomID]);

    return (
        <div>
            <nav className="bg-2 p-5 flex justify-between items-center">
                {room && <div className="font-title">{room.name}</div>}
                <div className="flex items-center gap-4">
                    <button className="bg-2 text-white p-2 rounded-lg" onClick={() => addMember()}>
                        <img src={addUser} width={35} height={35}></img>
                    </button>
                </div>
            </nav>
        </div>
    );
}