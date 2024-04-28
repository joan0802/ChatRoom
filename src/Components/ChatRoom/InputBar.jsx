import React from "react";
import send from "../../img/send.png";
import gallery from "../../img/gallery.png";
import { useState, useEffect } from "react";
import { db, storage } from "../../firebase/firebase";
import { ref, push } from "firebase/database";
import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";

export default function InputBar({ roomID, uid }) {
    const [msg, setMsg] = useState('');

    const handleFileChange = (e) => {
        console.log(e.target.files[0]);
        uploadPhoto(e.target.files[0]);
    }

    const uploadPhoto = async (file) => {
        console.log(file);
        if (file) {
            try {
                console.log(file);
                const fileRef = storageRef(storage, `send_photos/${file.name}`);
                const uploadTask = await uploadBytes(fileRef, file);
                const newUserPhoto = await getDownloadURL(uploadTask.ref);
                const msgRef = ref(db, `messages/${roomID}`);
                push(msgRef, {
                    sender: uid,
                    message: newUserPhoto,
                    isPhoto: true,
                    roomID: roomID
                });
            }
            catch {
                console.log("Error uploading photo");
            }
        }
    }

    const sendPhoto = () => {
        // console.log("send photo")
        const fileInput = document.getElementById('sendPhoto');
        fileInput.click();
    }

    function sendMessage() {
        if (msg) {
            const msgRef = ref(db, `messages/${roomID}`);
            push(msgRef, {
                sender: uid,
                message: msg,
                roomID: roomID
            });
            console.log(msg);
            setMsg('');
        }
    }

    return (
        <div className="flex items-center w-full rounded-2xl p-2 gap-4">
            <input
                type="text"
                className="flex-grow msg-input"
                placeholder="Type a message..."
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
            />
            <button onClick={() => sendPhoto()} className="btn-input">
                <input type="file" accept="image/*" id="sendPhoto" className="hidden" onChange={handleFileChange} />
                <img src={gallery} alt="send" height={51} width={51} className="send-icon" />
            </button>
            <button onClick={() => sendMessage()} className="btn-input">
                <img src={send} alt="send" height={51} width={51} className="send-icon" />
            </button>
        </div>
    );
}