import { FC, useEffect, useState } from 'react';
import '../styles/reservationCard.css'
import axios from 'axios';

interface ReservationCardProps {
    id: string;
    dateStart: Date;
    dateEnd: Date;
    token: string | undefined;
    onRemove: (id: string) => void; // Новый проп
}

export const ReservationCard: FC<ReservationCardProps> = ({ id, dateStart, dateEnd, token, onRemove }) => {
    const [room, setRoom] = useState({});

    useEffect(() => {
        const dataRoom = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/client/find-room/${id}`, {
                    withCredentials: true, // Включает отправку cookies
                });
                setRoom(response.data); // Сохраняем данные о комнате
            } catch (error) {
                console.error('Ошибка при загрузке данных о комнате:', error);
            }
        }
        dataRoom();
    }, [id]);

    const removeReserv = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/client/reservations/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Ошибка при удалении резервации');
            }
            console.log('Резервация удалена');
            onRemove(id); // Уведомляем родительский компонент об удалении
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

    console.log(room);

    return (
        <div className="reservCardContainer">
            <div className='date_box'>
                <div className="dateStart">{dateStart.toLocaleDateString()}</div>
                <div className="dateEnd">{dateEnd.toLocaleDateString()}</div>
            </div>
            <button className="removeButton" onClick={removeReserv}>
                Удалить резерв
            </button>
        </div>
    );
};