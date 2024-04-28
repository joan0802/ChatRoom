import React from "react";
import addUser from "../../img/addUser.png";
import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebase/firebase";

export default function ChatRoomNav({roomID}) {
    const [room, setRoom] = useState(null);

    useEffect(() => {
        // fetch room data
    
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

    return(
        <div>
            <nav className="bg-2 p-5 flex justify-between items-center">
                {room && <div className="font-title">{room.name}</div>}
                <div className="flex items-center gap-4">
                    <button className="bg-2 text-white p-2 rounded-lg">
                        <img src={addUser} width={35} height={35}></img>
                    </button>
                </div>
            </nav>
        </div>
    );
}