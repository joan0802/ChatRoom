import React from "react";

export default function ChatRoomPreview(uid) {
    return (
        <button className="flex items-center gap-4 py-8">
            <div className="w-14 h-14 bg-2 rounded-full"></div>
            <div className="font-chatRoomPreview flex items-center">Chat Room</div>
        </button>
    );
}