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
                <a href=''><li className='baseListItem'>Найти гостиницу</li></a>
                <Link to='/'><li className='baseListItem'>Найти номер</li></Link>
            </ol>

            {client && (
                <ol className='clientList'>
                    <a href=''><li className='baseListItem'>Мои бронирования</li></a>
                    <a href=''><li className='baseListItem'>Техподдержка</li></a>
                </ol>
            )}

            {admin && (
                <ol className='adminList'>
                    <Link to='/create/hotel'><li className='baseListItem'>Добавить гостиницу</li></Link>
                    <Link to='/create/room'><li className='baseListItem'>Добавить номер</li></Link>
                    <a href=''><li className='baseListItem'>Редактировать гостиницу</li></a>
                    <a href=''><li className='baseListItem'>Редактировать номер</li></a>
                </ol>
            )}

            {manager && (
                <ol className='managerList'>
                    <a href=''><li className='baseListItem'>Все пользователи</li></a>
                    <a href=''><li className='baseListItem'>Удалить бронирование</li></a>
                </ol>
            )}
        </div>
    );
};