import { FC } from "react"
import { Routes, Route } from 'react-router-dom';
import { RegisterForm } from '../pages/registerForm';
import { Rooms } from '../pages/rooms.tsx';
import { CreateHotel } from "../pages/createHotel.tsx";
import { CreateRoom } from "../pages/createRoom.tsx";
import '../styles/main.css'


export const Main: FC = () => {
    return (
        <div className="mainConteiner">
            <Routes>
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/" element={<Rooms />} />
                <Route path="/rooms" element={<Rooms />} />
                <Route path="/create/hotel" element={<CreateHotel />} />
                <Route path="/create/room" element={<CreateRoom />} />

            </Routes>
        </div>
    )
}