import React from "react";
import InputBar from "./InputBar";
import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { auth, db } from '../../firebase/firebase';
import ChatRoomNav from "./ChatRoomNav";
import ChatBox from "./ChatBox";

export default function ChatRoom({ roomID, uid }) {

    const [msgList, setMsgList] = useState([]);

    useEffect(() => {
        try {
            console.log("room = " + roomID);
            const msgRef = ref(db, `messages/${roomID}`);
            const unsubscribe = onValue(msgRef, (snapshot) => {
                if (snapshot.exists()) {
                    const msgData = Object.values(snapshot.val()); // Convert object to array
                    setMsgList(msgData);
                } else {
                    console.log("No data found at messages/" + roomID);
                }
            });
            return () => {
                unsubscribe();
            };
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }, [roomID]);

    return (
        <div className="flex flex-col w-3/4 bg-main h-screen">
            <ChatRoomNav roomID={roomID} />
            <div className="flex-grow p-5 overflow-auto">
                {msgList && msgList.map((value) => (
                    // console.log(value), 
                    <ChatBox roomID={roomID} msg={value} uid={uid} />
                )
                )}
            </div>
            <div className="self-end w-full p-5">
                <InputBar uid={uid} roomID={roomID} />
            </div>
        </div>
    );
}