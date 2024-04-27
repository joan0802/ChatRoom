import React from "react";
import Navbar from "./Components/Navbar";
import ChatRoom from "./Components/ChatRoom/ChatRoom";

export default function Home() {
    return (
        <div className="bg-main flex">
            {/* <h1>Home</h1> */}
            <Navbar />
            <ChatRoom />
        </div>
    );
}