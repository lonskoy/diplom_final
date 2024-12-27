import { FC } from 'react';
import '../styles/roomCard.css'

interface RoomCardProp {
    description: string;
    images: string;
    hotel: {
        title: string;
        description: string;
    };
}

export const RoomCard: FC<RoomCardProp> = ({ description, images, hotel }) => {
    return (
        <div className="roomCardContainer">
            <div className="roomCard_image">
                <img src={images} alt="Room Images" />
            </div>
            <div className="roomCard_description">
                <div className="roomCard_description_name">{hotel.title}</div>
                <div className="roomCard_description_text">{description}</div>
                <button className="roomCard_description_button">Подробнее</button>
            </div>
            
        </div>
    );
};