import React from "react";
import { useState, useEffect } from "react";
import { db } from '../../firebase/firebase';
import { ref, onValue, set, remove } from "firebase/database";
import trash from "../../img/trash.png";


export default function ChatBox({ roomID, msg, uid, msgUid }) {
    const [user, setUser] = useState(null);
    const [msgText, setMsgText] = useState(msg.message);
    const [isPhoto, setIsPhoto] = useState(false);

    const deleteMessage = async () => {
        try {
            const msgRef = await ref(db, `messages/${roomID}/${msgUid}`);
            // console.log(msgUid);
            await remove(msgRef);
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    };

    useEffect(() => {
        if (msg.isPhoto) {
            // console.log("photo");
            setIsPhoto(true);
        }
    }, [msg]);

    useEffect(() => {
        try {
            const userRef = ref(db, `users/${msg.sender}`);
            onValue(userRef, (snapshot) => {
                setUser(snapshot.val());
            });
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }, [roomID, msg]);

    if (roomID !== msg.roomID) {
        return null;
    }

    return (
        <div className="">
            {!(msg.sender === uid) && <div className="flex gap-3 py-4">
                <div className="w-14 h-14 rounded-full">
                    {user &&
                        <div className="h-14 w-14">
                            <img src={user.photoURL} alt="user" className=" rounded-full object-cover h-full w-full" />
                        </div>
                    }
                </div>
                <div>
                    <div className="flex justify-between gap-4">
                        {user && <div className="">{user.displayName}</div>}
                    </div>
                    <div className="bg-2 rounded-xl p-2">
                        {msg && !isPhoto && <div className="text-[#2e3a3f]">{msg.message}</div>}
                        {msg && isPhoto && <img src={msg.message} className="w-auto h-80"></img>}
                    </div>
                </div>
            </div>}
            {(msg.sender === uid) &&
                <div className="flex justify-end gap-3 py-4">
                    <div>
                        <div className="flex justify-between gap-4">
                            <button onClick={deleteMessage}>
                                <img src={trash} alt="delete" className="w-4 h-4"></img>
                            </button>
                            {user && <div className="flex justify-end">{user.displayName}</div>}
                        </div>
                        <div className="bg-card rounded-xl p-2">
                            {msg && !isPhoto && <div className="text-[#2e3a3f]">{msg.message}</div>}
                            {msg && isPhoto && <img src={msg.message} className="w-auto h-80"></img>}
                        </div>
                    </div>
                    <div className="w-14 h-14 rounded-full">
                        {user &&
                            <div className="h-14 w-14">
                                <img src={user.photoURL} alt="user" className=" rounded-full object-cover h-full w-full" />
                            </div>
                        }
                    </div>
                </div>}
        </div>
    );
}