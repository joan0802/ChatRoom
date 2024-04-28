import React from "react";
import { useState, useEffect } from "react";
import { db } from '../../firebase/firebase';
import { ref, onValue } from "firebase/database";


export default function ChatBox({ roomID, msg, uid }) {
    const [user, setUser] = useState(null);
    const [msgText, setMsgText] = useState(msg.message);
    const [isPhoto, setIsPhoto] = useState(false);

    useEffect(() => {
        if(msg.isPhoto){
            console.log("photo");
            setIsPhoto(true);
        }
    }, [msg]);

    useEffect(() => {
        try {
            const userRef = ref(db, `users/${msg.sender}`);
            onValue(userRef, (snapshot) => {
                setUser(snapshot.val());
                // console.log(msg.sender);
                // console.log(uid);
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
                    {user && <div className="">{user.displayName}</div>}
                    <div className="bg-2 rounded-xl p-2">
                        {msg && !isPhoto && <div className="text-[#2e3a3f]">{msg.message}</div>}
                        {msg && isPhoto && <img src={msg.message} className="w-auto h-80"></img>}
                    </div>
                </div>
            </div>}
            {(msg.sender === uid) &&
                <div className="flex justify-end gap-3 py-4">
                    <div>
                        {user && <div className="flex justify-end">{user.displayName}</div>}
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