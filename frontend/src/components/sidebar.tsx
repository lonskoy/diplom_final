import { FC } from 'react';
import '../styles/sidebar.css';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';  // Импортируем тип для состояния
import { Link } from 'react-router-dom';


export const Sidebar: FC = () => {
    
    const { client, admin, manager } = useSelector((state: RootState) => state.roles);

    return (
        <div className='sideBarContainer'>
            <ol className='baseList'>
                <Link to='/'><li className='baseListItem'>Бронировать гостиницу</li></Link>
                {/* <Link to='/'><li className='baseListItem'>Найти номер</li></Link> */}
            </ol>

            {client && (
                <ol className='clientList'>
                    <Link to='/api/client/reservations'><li className='baseListItem'>Мои бронирования</li></Link>
                    <a href='#'><li className='baseListItem'>Техподдержка</li></a>
                </ol>
            )}

            {admin && (
                <ol className='adminList'>
                    <Link to='/create/hotel'><li className='baseListItem'>Добавить гостиницу</li></Link>
                    <Link to='/create/room'><li className='baseListItem'>Добавить номер</li></Link>
                    <Link to='api/admin/hotels-edit/:id'><li className='baseListItem'>Редактировать гостиницу</li></Link>
                    <Link to='api/admin/hotel-rooms-edit/:id'><li className='baseListItem'>Редактировать номер</li></Link>
                    <Link to='api/admin/users'><li className='baseListItem'>Пользователи</li></Link>
                </ol>
            )}

            {manager && (
                <ol className='managerList'>
                    <a href='#'><li className='baseListItem'>Все пользователи</li></a>
                    <a href='#'><li className='baseListItem'>Удалить бронирование</li></a>
                </ol>
            )}
        </div>
    );
};