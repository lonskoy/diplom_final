import { FC, useEffect, useState } from 'react';
import { RoomCard } from '../components/roomCard';
import axios from 'axios';
import '../styles/rooms.css';

interface Room {
    description: string;
    images: string;
    hotel: {
        title: string;
        description: string;
    };
}

export const Rooms: FC = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [currentPage, setCurrentPage] = useState(1); // Текущая страница
    const itemsPerPage = 7; // Количество элементов на странице

    useEffect(() => {
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
            <div className='roomCards'>
                {currentItems.map((room, index) => (
                    <RoomCard 
                        key={index} 
                        description={room.description} 
                        images={room.images[0]} 
                        hotel={room.hotel} 
                    />
                ))}
            </div>

            {/* Пагинация */}
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
    );
};