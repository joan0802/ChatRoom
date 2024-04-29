import React from "react";
import InputBar from "./InputBar";
import { useState, useEffect, useRef } from "react";
import { ref, onValue, onChildAdded, onChildRemoved, get, set } from "firebase/database";
import { auth, db } from '../../firebase/firebase';
import ChatRoomNav from "./ChatRoomNav";
import ChatBox from "./ChatBox";

export default function ChatRoom({ roomID, uid }) {

    const [msgList, setMsgList] = useState({});
    const [senderData, setSenderData] = useState({});
    const chatContainerRef = useRef(null);

    useEffect(() => {
        try {
            // console.log("room = " + roomID);
            const msgRef = ref(db, `messages/${roomID}`);
            const unsubscribe = onValue(msgRef, (snapshot) => {
                if (snapshot.exists()) {
                    const msgData = (snapshot.val());
                    setMsgList(msgData);
                    // console.log(msgData);
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

    useEffect(() => {
        const user = auth.currentUser;
        const messagesRef = ref(db, `messages/${roomID}`);

        const notify = async (msg, senderData) => {
            if (Notification.permission === 'granted') {
                const notification = new Notification('New message from ' + senderData.displayName + ": " + msg);
                setTimeout(() => {
                    notification.close();
                }, 10000);
            }
        }

        const unsubscribe = async () => {
            const snapshot = await get(messagesRef);
            const messages = snapshot.val();
            if (messages) {
                const keys = Object.keys(messages);
                const lastKey = keys[keys.length - 1];
                const lastMessage = messages[lastKey];
                if (user && lastMessage && lastMessage.sender !== user.uid) {
                    const senderSnapshot = await get(ref(db, `users/${lastMessage.sender}`));
                    setSenderData(senderSnapshot.val());
                    notify(lastMessage.message, senderData);
                }
            }
        };
        return () => unsubscribe();
    }, [msgList]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [msgList]);

    return (
        <div className="flex flex-col w-3/4 bg-main h-screen">
            <ChatRoomNav roomID={roomID} />
            <div ref={chatContainerRef} className="flex-grow p-5 overflow-auto">
                {msgList && Object.entries(msgList).map(([msgUid, msg]) => (
                    <ChatBox key={msgUid} roomID={roomID} msg={msg} uid={uid} msgUid={msgUid} />
                ))
                }
            </div>
            <div className="self-end w-full p-5">
                <InputBar uid={uid} roomID={roomID} />
            </div>
        </div>
    );
}