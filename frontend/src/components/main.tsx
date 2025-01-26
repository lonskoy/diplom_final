import { FC } from "react"
import { Routes, Route } from 'react-router-dom';
import { RegisterForm } from '../pages/registerForm';
import { Rooms } from '../pages/rooms.tsx';
import { CreateHotel } from "../pages/createHotel.tsx";
import { CreateRoom } from "../pages/createRoom.tsx";
import { ClientReservations } from "../pages/clientReservation.tsx";
import '../styles/main.css'
import { RoomCardDetails } from "./roomCardDetails.tsx";
import { EditRoom } from "../pages/editRoom.tsx";
import { EditHotel } from "../pages/editHotel.tsx";
import { UsersAdmin } from "../pages/usersAdmin.tsx";


export const Main: FC = () => {
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

            </Routes>
        </div>
    )
}