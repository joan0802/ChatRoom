import React from "react";
import InputBar from "./InputBar";
import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { auth, db } from '../../firebase/firebase';

export default function ChatRoom({roomID, uid}) {

    const chatRoom = ref(db, `chatRoom/${roomID}`);

    return (
        <div className="flex flex-col w-full bg-main h-screen p-5">
            {/* <h1>Chat Room</h1> */}
            <div className="flex-grow"></div>
            <div className="self-end w-full">
                <InputBar uid={uid} roomID={roomID}/>
            </div>
        </div>
    );
}