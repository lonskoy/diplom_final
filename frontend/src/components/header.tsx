import React, { FC, useState } from 'react';
import '../styles/header.css';
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
        let userName = ''

        try {
            const response = await axios.post('http://localhost:3000/api/auth/login', body, { withCredentials: true });
            userName = response.data.name; // Устанавливаем имя пользователя из ответа

            // Проверяем роль и устанавливаем флаги
            dispatch(setClient(response.data.role === 'client'));
            dispatch(setAdmin(response.data.role === 'admin'));
            dispatch(setManager(response.data.role === 'manager'));
            // Устанавливаем токен и авторизацию
            dispatch(setAuth({userName}));

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
            <div className="logo">
                <img src="logo_221x100.png" alt="logo" />
            </div>
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
                        <button type="submit">Войти</button>
                    </form>
                    <p>
                        <Link to="/register">Зарегистрироваться</Link>
                    </p>
                </div>
            ) : (
                <div className="authContainer">
                    <p>Привет, {userName}</p>
                    <a href="/" onClick={handleLogout}>
                        <p>Выйти</p>
                    </a>
                </div>
            )}
        </div>
    );
};