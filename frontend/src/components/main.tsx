import { FC, useEffect, useState } from "react";
import { Routes, Route } from 'react-router-dom';
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { RootState } from "../store/store.ts";
import jwtDecode from "jwt-decode";

import '../styles/main.css';
import { RegisterForm } from "../pages/registerForm.tsx";
import { Rooms } from "../pages/rooms.tsx";
import { RoomCardDetails } from "./roomCardDetails.tsx";
import { CreateHotel } from "../pages/createHotel.tsx";
import { CreateRoom } from "../pages/createRoom.tsx";
import { SupportRequests } from "../pages/supportRequests.tsx";
import { ClientReservations } from "../pages/clientReservation.tsx";
import { EditRoom } from "../pages/editRoom.tsx";
import { EditHotel } from "../pages/editHotel.tsx";
import { UsersAdmin } from "../pages/usersAdmin.tsx";
import { CreateSupportRequest } from "../pages/createSupportRequest.tsx";
import { AllUsersManager } from "../pages/allUsersManager.tsx";
import { DeleteReservationManager } from "../pages/deleteReservationManager.tsx";

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
    // const [userId, setUserId] = useState<string>('');
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useState<{ senderName: string, message: string }[]>([]);
    
    useEffect(() => {
        if (userToken) {
            const decoded: DecodedData = jwtDecode(userToken);
            setRole(decoded.role);
            setName(decoded.name);
            // setUserId(decoded.id);

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
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/" element={<Rooms />} />
                <Route path="/rooms" element={<Rooms />} />
                <Route path="/room-card" element={<RoomCardDetails />} />
                <Route path="/create/hotel" element={<CreateHotel />} />
                <Route path="/create/room" element={<CreateRoom />} />
                <Route path="/api/client/reservations" element={<ClientReservations />} />
                <Route path="/api/admin/hotel-rooms-edit/:id" element={<EditRoom />} />
                <Route path="/api/admin/hotels-edit/:id" element={<EditHotel />} />
                <Route path="/api/admin/users" element={<UsersAdmin />} />
                <Route path="/api/client/support-requests/" element={<SupportRequests />} />
                <Route path="api/common/support-requests/manager" element={<SupportRequests />} />
                <Route path="/api/client/create-support-request" element={<CreateSupportRequest />} />
                <Route path="api/manager/users" element={<AllUsersManager />} />
                <Route path="api/manager/user-reservations" element={<DeleteReservationManager />} />
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