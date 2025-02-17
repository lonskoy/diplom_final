import { FC, useEffect, useState } from "react";
import { Routes, Route } from 'react-router-dom';
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { RootState } from "../store/store.ts";
import jwtDecode from "jwt-decode";

import '../styles/main.css';

interface DecodedData {
    id: string;
    role: string;
    name: string;
}

const socket = io("http://localhost:3000");

export const Main: FC = () => {
    const userToken = useSelector((state: RootState) => state.auth.userToken);
    const [role, setRole] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [userId, setUserId] = useState<string>('');
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useState<{ senderName: string, message: string }[]>([]);
    
    useEffect(() => {
        if (userToken) {
            const decoded: DecodedData = jwtDecode(userToken);
            setRole(decoded.role);
            setName(decoded.name);
            setUserId(decoded.id);

            socket.emit("join", decoded.id);
        }
    }, [userToken]);

    useEffect(() => {
        socket.on("message", (msg: { senderName: string, message: string }) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket.off("message");
        };
    }, []);

    const sendMessage = () => {
        if (message.trim()) {
            socket.emit("message", { senderName: name, message });
            setMessage("");
        }
    };

    return (
        <div className="mainContainer">
            <Routes>
                <Route path="/" element={<h1>Главная страница</h1>} />
            </Routes>

            {(role === "client" || role === "manager") && (
                <>
                    <div className="chatOnline" onClick={() => setIsChatOpen(true)}>
                        <img className="chatOnlineIcon" src="chat-icon2.png" alt="Chat" />
                    </div>
                    {isChatOpen && (
                        <div className="chatContainer">
                            <div className="chatHeader">
                                <span>Чат</span>
                                <button className="chatCloseButton" onClick={() => setIsChatOpen(false)}>✖</button>
                            </div>
                            <div className="chatMessages">
                                {messages.map((msg, index) => (
                                    <div key={index} className="chatMessage">
                                        <strong>{msg.senderName}:</strong> {msg.message}
                                    </div>
                                ))}
                            </div>
                            <div className="chatInputContainer">
                                <input
                                    className="chatInput"
                                    type="text"
                                    placeholder="Введите сообщение..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                <button className="chatSendButton" onClick={sendMessage}>Отправить</button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};