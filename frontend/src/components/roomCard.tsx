import { FC } from 'react';
import '../styles/roomCard.css'
import { Link } from 'react-router';

interface RoomCardProp {
    id: string,
    description: string;
    images: string[];
    hotel: {
        title: string;
        description: string;
    };
}

export const RoomCard: FC<RoomCardProp> = ({ id, description, images, hotel }) => {

    return (
        <div className="roomCardContainer">
            <div className="roomCard_image_container">
                <img className='roomCard_image' src={images[0]} alt="Room Images" />
            </div>
            <div className="roomCard_description">
                <div className="roomCard_description_hotel_name">{hotel.title}</div>
                <div className="roomCard_description_hotel_title">{hotel.description}</div>
                <div className="roomCard_description_text">{description}</div>
                <Link to="/room-card" state={{ id, description, images, hotel }}>
                    <button className="roomCard_description_button">Подробнее</button>
                </Link>
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
    );
};