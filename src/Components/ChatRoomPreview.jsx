import React from "react";
import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from '../firebase/firebase';

export default function ChatRoomPreview({ roomID, roomOnClick }) {
    const [chatRoomData, setChatRoomData] = useState({});
    useEffect(() => {
        const chatRoomRef = ref(db, `chatRooms/${roomID}`);
        try {
            onValue(chatRoomRef, (snapshot) => {
                setChatRoomData(snapshot.val());
                // console.log(snapshot.val());
            });
        }
        catch (error) {
            console.error('Error fetching chat room data:', error);
        }
    }, [roomID]);

    return (
        <div>
            <div className="flex justify-between overflow-hidden btn-chatRoomPreview p-2 hidden lg:flex">
                <button className="flex items-center gap-4 py-4" onClick={() => roomOnClick(roomID)}>
                    <div className="w-14 h-14 bg-2 p-2 rounded-full"></div>
                    {chatRoomData && <div className="font-chatRoomPreview flex items-center">{chatRoomData.name}</div>}
                </button>
            </div>
            <div className="flex justify-center items-center overflow-hidden btn-chatRoomPreview p-2 lg:hidden">
                <button className="flex items-center gap-4 py-4" onClick={() => roomOnClick(roomID)}>
                    {chatRoomData && <div className="font-chatRoomPreview flex justify-center items-center">{chatRoomData.name}</div>}
                </button>
            </div>
        </div>

    );
}