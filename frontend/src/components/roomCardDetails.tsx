import { FC } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/roomCardDetails.css'
import { RootState } from "../store/store";  // Путь к вашему store файлу
import { useSelector } from "react-redux";  

export const RoomCardDetails: FC = () => {
    const navigate = useNavigate(); // Хук для управления навигацией

    const location = useLocation(); //получаем данные переданные из roomCard
    const { id, description, images, hotel } = location.state; 
    
    const reservData = useSelector((state: RootState) => state.reservData); // получаем сохраненые в хранилище даты резерва

    const dataCookie = document.cookie;
    const token = dataCookie.split(';').find(cookie => cookie.trim().startsWith('token='))?.split('=')[1] || null;

    const hendlerButtonReserv = async () => {
        const dataNewReserv = {
            hotelRoom: id,
            dateStart: reservData.dateStart,
            dateEnd: reservData.dateEnd,
        };
    
        try {
            const response = await fetch('http://localhost:3000/api/client/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Указываем, что передаём JSON
                },
                body: JSON.stringify(dataNewReserv), // Преобразуем объект в строку JSON
                credentials: 'include'
            });
    
            if (!response.ok) {
                throw new Error(`Ошибка: ${response.statusText}`); // Обработка ошибок ответа
            }

            alert('Номер забронирован')
            navigate(-1);

        } catch (error) {
            console.error('Ошибка при создании бронирования:', error); // Логируем ошибку
        }
    };

    return (
        <div className="roomCardContainerDetails">
            <div className="roomCardContainer">
                <div className="roomCard_image_container">
                    <img className='roomCard_image' src={images[0]} alt="Room Images" />
                </div>
                <div className="roomCard_description">
                    <div className="roomCard_description_hotel_name">{hotel.title}</div>
                    <div className="roomCard_description_hotel_title">{hotel.description}</div>
                    <div className="roomCard_description_text">{description}</div>
                    { token ?  <button className="roomCard_description_button" onClick={hendlerButtonReserv}>Бронировать</button> : <div>Войдите в систему что бы бронировать отель</div>}
                   
                </div>
                <div className="roomCard_price_container">
                    <div className='lease_terms'><p>1 комната 2 дня</p></div>
                    <div className='roomCard_price_box'>
                        <div className='roomCard_old_price'>180 $</div>
                        <div className='roomCard_price'>120 $</div>
                    </div>
                    <p>Включая налоги и сборы</p>
                </div>
            </div>
            <div className="fotoGalary">
                {images.map((elem: string, index: number) => (
                    <div className="foto" key={index}>
                        <a href={elem}><img src={elem} alt={`Room foto ${index + 1}`} className="fotoImage" /></a>
                    </div>
                ))}
            </div>
        </div>
    )
}