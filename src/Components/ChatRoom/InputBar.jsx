import React from "react";
import send from "../../img/send.png";
import { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import { ref, push } from "firebase/database";

export default function InputBar({roomID, uid}) {
    const [msg, setMsg] = useState('');

    function sendMessage() {
        const chatRoomRef = ref(db, `chatRooms/${roomID}/messages`);
        const msgRef = push(chatRoomRef);
        push(msgRef, {
            sender: uid,
            message: msg
        });
        console.log(msg);
        setMsg('');
    }
    
    return(
        <div className="flex items-center w-full rounded-2xl p-2 gap-4">
            <input 
                type="text" 
                className="flex-grow msg-input" 
                placeholder="Type a message..." 
                value={msg}
                onChange={(e) => setMsg(e.target.value)}    
            />
            <button onClick={sendMessage}>
                <img src={send} alt="send" height={51} width={51} className="send-icon" />
            </button>
        </div>
    );
}