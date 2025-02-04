import { FC } from 'react';
import '../styles/reservationCard.css'
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import jwtDecode from 'jwt-decode';

interface ReservationCardProps {
    id: string;
    dateStart: Date;
    dateEnd: Date;
    onRemove: (id: string) => void; // Новый проп
}

interface DecodedData  {
    id: string,
    role: string,
    name: string
}

export const ReservationCard: FC<ReservationCardProps> = ({ id, dateStart, dateEnd, onRemove }) => {

    const userToken = useSelector((state: RootState) => state.auth.userToken);



    // const [room, setRoom] = useState({});

    // useEffect(() => {
    //     const dataRoom = async () => {
    //         try {
    //             const response = await fetch(`http://localhost:3000/api/client/find-room/${id}`, {
    //                 method: "GET",
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //                 credentials: 'include',
    //             });

    //             if (!response.ok) {
    //                 throw new Error(`Ошибка загрузки данных о комнате: ${response.status}`);
    //             }

    //             const text = await response.text(); // Читаем ответ в виде текста
    //             if (!text) {
    //                 throw new Error("Сервер вернул пустой ответ");
    //             }

    //             const data = JSON.parse(text); // Преобразуем в JSON
    //             setRoom(data); // Сохраняем данные
    //             console.log("Комната:", data);
    //         } catch (error) {
    //             console.error("Ошибка при загрузке данных о комнате:", error);
    //         }
    //     };
    //     dataRoom();
    // }, [id]);

    const removeReserv = async () => {
        try {
            if (userToken) {
                const decoded: DecodedData = jwtDecode(userToken);

                if (decoded) {
                    if (decoded.role === 'client') {
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
                    }
                    if (decoded.role === 'manager') {
                        const response = await fetch(`http://localhost:3000/api/manager/reservations/${id}`, {
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
                    }
                }
                else console.log('Ошибка получения роли из токена')

            }


        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

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