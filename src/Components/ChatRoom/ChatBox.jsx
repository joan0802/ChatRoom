import React from "react";
import { useState, useEffect } from "react";
import { db } from '../../firebase/firebase';
import { ref, onValue } from "firebase/database";


export default function ChatBox({ roomID, msg, uid }) {
    const [user, setUser] = useState(null);
    const [msgText, setMsgText] = useState(msg.message);
    const [isSame, setIsSame] = useState(false);

    useEffect(() => {
        try {
            const userRef = ref(db, `users/${msg.sender}`);
            onValue(userRef, (snapshot) => {
                setUser(snapshot.val());
                if (msg.sender == uid) {
                    setIsSame(true);
                }
                // console.log(msg.sender);
                // console.log(uid);
            });
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }, [roomID]);

    if (roomID !== msg.roomID) {
        return null;
    }

    return (
        <div className="">
            {!isSame && <div className="flex gap-3 py-4">
                <div className="w-14 h-14 rounded-full">
                    {user &&
                        <img className="flex justify-center items-center rounded-full" src={user.photoURL}></img>
                    }
                </div>
                <div>
                    {user && <div className="">{user.displayName}</div>}
                    <div className="bg-2 rounded-xl p-2">
                        {msg && <div className="text-[#2e3a3f]">{msg.message}</div>}
                    </div>
                </div>
            </div>}
            {isSame &&
                <div className="flex justify-end gap-3 py-4">
                    <div>
                        {user && <div className="">{user.displayName}</div>}
                        <div className="bg-card rounded-xl p-2">
                            {msg && <div className="text-[#2e3a3f]">{msg.message}</div>}
                        </div>
                    </div>
                    <div className="w-14 h-14 rounded-full">
                        {user &&
                            <img className="flex justify-center items-center rounded-full" src={user.photoURL}></img>
                        }
                    </div>
                </div>}
        </div>
    );
}