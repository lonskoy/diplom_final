import React, { FC, useState } from 'react';
import '../styles/header.css';
import '../styles/global.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {
    setClient,
    setAdmin,
    setManager,
    clearAuth,
    setAuth,
    RootState,
} from '../store/store'; // Импортируем действия
import { Link } from 'react-router-dom';

export const Header: FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const body = { email, password };
        let userName = '';
        let userToken = '';

        try {
            const response = await axios.post('http://localhost:3000/api/auth/login', body, { withCredentials: true });
            console.log(response);
            userName = response.data.name; // Устанавливаем имя пользователя из ответа
            userToken = response.data.token;

            // Проверяем роль и устанавливаем флаги
            dispatch(setClient(response.data.role === 'client'));
            dispatch(setAdmin(response.data.role === 'admin'));
            dispatch(setManager(response.data.role === 'manager'));
            // Устанавливаем токен и авторизацию
            dispatch(setAuth({ userName, userToken }));

        } catch (error: any) {
            console.error(error.message);
        }
    };

    const handleLogout = () => {
        dispatch(clearAuth()); // Сбрасываем токен и авторизацию
        dispatch(setClient(false));
        dispatch(setAdmin(false));
        dispatch(setManager(false));
    };

    const { isLoggedIn, userName } = useSelector((state: RootState) => state.auth); // Получаем isLoggedIn и accessToken из состояния

    return (
        <div className="header">
            <div className='header_up'>
                <div className='header_up_link'>
                    <ol className='header_link_list'>
                        <Link to='/'><li className='header_list_elem'>Главная</li></Link>
                        <a href='#'><li className='header_list_elem'>Отели</li></a>
                        <a href='#'><li className='header_list_elem'>Туры</li></a>
                        <a href='#'><li className='header_list_elem'>Избранное</li></a>
                        <a href='#'><li className='header_list_elem'>Контакты</li></a>
                    </ol>
                </div>
                <div className='header_up_auth'>
                    {!isLoggedIn ? (
                        <div className="formContainer">
                            <form className="loginForm" onSubmit={handleSubmit}>
                                <input
                                    type="email"
                                    name="email"
                                    className="inputField"
                                    required
                                    placeholder="Email"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <input
                                    type="password"
                                    name="password"
                                    className="inputField"
                                    required
                                    placeholder="Пароль"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <div className='button_container'>
                                    <button type="submit" className='button_login'>Войти</button>
                                </div>
                            </form>
                            <p>
                                <Link to="/register"><button className='button_register'>Регистрация</button></Link>
                            </p>
                        </div>
                    ) : (
                        <div className="authContainer">
                            <p>Привет, {userName}</p>
                            <a href="/" onClick={handleLogout}>Выйти</a>
                        </div>
                    )}
                </div>
            </div>
            <div className="logo_container">
                <img className="logo" src="slide_1.png" alt="logo" />

                
            </div>
        </div>          
    );
};