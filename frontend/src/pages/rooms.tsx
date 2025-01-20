import { FC, useEffect, useState } from 'react';
import { RoomCard } from '../components/roomCard';
import axios from 'axios';
import '../styles/rooms.css';
import { useDispatch } from "react-redux";
import { AppDispatch, setReservData } from "../store/store";  


interface Room {
    _id: string,
    description: string;
    images: string[];
    hotel: {
        title: string,
        description: string
    };
}

export const Rooms: FC = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [currentPage, setCurrentPage] = useState(1); // Текущая страница
    const itemsPerPage = 7; // Количество элементов на странице

    const dispatch: AppDispatch = useDispatch();

    useEffect(() => { //получаем все комнаты из базы
        const fetchRooms = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/client/rooms');
                setRooms(response.data);
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        };
        fetchRooms();
    }, []);

     // Функция для обработки отправки формы поиска отелей
     const handleSearchSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = {
            dateStart: new Date(event.currentTarget.dateStart.value).toISOString(),
            dateEnd: new Date(event.currentTarget.dateEnd.value).toISOString(),
        }
        const query = new URLSearchParams(formData as any).toString(); // из переданных данных из формы создает автоматически query объект
    
        try {
            const response = await axios.get(`http://localhost:3000/api/client/find-room?${query}`); //ищем свободные комнаты на дату
            setRooms(response.data); // Сохраняем результат в состояние
            dispatch(setReservData(formData)) // сохраняем даты брони в хранилище
        } catch (error) {
            console.error('Ошибка при поиске отелей:', error);
        }
    };

    // Расчет для пагинации
    const totalPages = Math.ceil(rooms.length / itemsPerPage);
    const currentItems = rooms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Функция для перехода на следующую страницу
    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    // Функция для перехода на предыдущую страницу
    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    // Функция для выбора конкретной страницы
    const handlePageClick = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className='roomsContainer'>

            <div className='search_hotel_bar'>
                    <form className="search_hotel" onSubmit={handleSearchSubmit}>
                        <input
                            type="text"
                            name="destination"
                            placeholder="Направление"
                            className="search_input"
                        />
                        <input
                            type="date"
                            name="dateStart"
                            className="search_date"
                            required
                        />
                        <input
                            type="date"
                            name="dateEnd"
                            className="search_date"
                            required
                        />
                        <button
                            type="submit"
                            className="search_button"
                        >
                            Поиск
                        </button>
                    </form>
                </div>

            <div className='roomCards'>
                {currentItems.map((room, index) => (
                    <RoomCard 
                        key={index} 
                        id={room._id}
                        description={room.description} 
                        images={room.images} 
                        hotel={room.hotel} 
                    />
                ))}
            </div>

            {/* Пагинация */}
            <div className='pagination-container'>
                <div className="pagination-container d-flex justify-content-center">
                    <button 
                        className="btn btn-primary" 
                        onClick={handlePreviousPage} 
                        disabled={currentPage === 1}
                    >
                        &lt; Prev
                    </button>

                    {/* Страница 1, 2, 3 и т.д. */}
                    {[...Array(totalPages)].map((_, index) => (
                        <button 
                            key={index} 
                            className={`btn btn-secondary ${currentPage === index + 1 ? 'active' : ''}`} 
                            onClick={() => handlePageClick(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button 
                        className="btn btn-primary" 
                        onClick={handleNextPage} 
                        disabled={currentPage === totalPages}
                    >
                        Next &gt;
                    </button>
                </div>
            </div>
        </div>
    );
};