import React from "react";
import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from '../firebase/firebase';

export default function ChatRoomPreview({uid}) {
    const [chatRoomData, setChatRoomData] = useState({});
    useEffect(() => {
        const chatRoomRef = ref(db, `chatRooms/${uid}`);
        try {
            onValue(chatRoomRef, (snapshot) => {
                setChatRoomData(snapshot.val());
                console.log(snapshot.val());
            });
        }
        catch (error) {
            console.error('Error fetching chat room data:', error);
        }
    }, [uid]);

    return (
        <button className="flex items-center gap-4 py-4">
            <div className="w-14 h-14 bg-2 rounded-full"></div>
            <div className="font-chatRoomPreview flex items-center">{chatRoomData.name}</div>
        </button>
    );
}