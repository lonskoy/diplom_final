import { useState } from "react";
import { ReservationCard } from "./reservationCard";
import '../styles/deleteReservationManager.css';

type Reservation = {
    _id: string;
    dateStart: string; // JSON приходит строкой
    dateEnd: string;
};

export const DeleteReservationManager = () => {
    const [idClient, setIdClient] = useState('');
    const [reservations, setReservations] = useState<Reservation[]>([]);

    const handleSearch = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/manager/reservations/${idClient}`, {
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`Ошибка загрузки: ${response.status}`);
            }

            const data: Reservation[] = await response.json();
            setReservations(data);
            console.log(data);
        } catch (error) {
            console.error("Ошибка при получении бронирований:", error);
        }
    };

    const handleRemove = (id: string) => {
        setReservations((prev) => prev.filter((reservation) => reservation._id !== id));
    };

    return (
        <div className="deleteReservationManager_box">
            <div className="searchContainer">
                <input 
                    type="text" 
                    className="textIdClient" 
                    onChange={(e) => setIdClient(e.target.value)} 
                    value={idClient}
                    placeholder="Введите ID клиента"
                />
                <button type="button" onClick={handleSearch}>Найти</button>
            </div>
            <div className="reservationsBox">
                {reservations.length === 0 ? (
                    <div className="reservEmpty">У клиента нет бронирований</div>
                ) : (
                    reservations.map((reservation) => (
                        <ReservationCard
                            key={reservation._id}
                            id={reservation._id}
                            dateStart={new Date(reservation.dateStart)}
                            dateEnd={new Date(reservation.dateEnd)}
                            onRemove={() => handleRemove(reservation._id)} 
                        />
                    ))
                )}
            </div>
        </div>
    );
};