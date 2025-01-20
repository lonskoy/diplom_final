import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { ReservationCard } from './reservationCard';
import '../styles/reservationCard.css'

export const ClientReservations: FC = () => {
    const userToken = useSelector((state: RootState) => state.auth.userToken);
    const [reservations, setReservations] = useState<any[]>([]);

    useEffect(() => {
        if (userToken) {
            document.cookie = `access_token=${userToken}; path=/; secure; HttpOnly`;
        }
    }, [userToken]);

    const fetchReservations = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/client/reservations', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Ошибка при получении данных');
            }
            const data = await response.json();
            setReservations(data);
        } catch (error) {
            console.error('Ошибка при загрузке резерваций:', error);
        }
    };

    const handleRemove = (id: string) => {
        setReservations((prev) => prev.filter((reservation) => reservation._id !== id));
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    return (
        <div className="reservationsContainer">
            {reservations.length === 0 ? ( // Проверяем, пуст ли массив
                <div className="reservEmpty">У вас нет бронирований</div>
            ) : (
                reservations.map((reservation) => (
                    <ReservationCard
                        key={reservation._id}
                        id={reservation._id}
                        dateStart={new Date(reservation.dateStart)}
                        dateEnd={new Date(reservation.dateEnd)}
                        token={userToken}
                        onRemove={handleRemove}
                    />
                ))
            )}
        </div>
    );
};