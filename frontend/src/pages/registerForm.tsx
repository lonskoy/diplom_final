import { FC, useState } from "react";
import '../styles/register.css';
import axios from "axios";
import { useDispatch } from "react-redux";
import { setClient, setAdmin, setManager, setAuth } from '../store/store'; // Импортируем действия

export const RegisterForm: FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [contactPhone, setContactPhone] = useState('');

    const dispatch = useDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const body = { email, password, name, contactPhone };
        let userName ='';

        try {
            const response = await axios.post('http://localhost:3000/api/client/register', body);
            userName = response.data.userName

            // Устанавливаем роль клиента
            dispatch(setClient(true));
            dispatch(setAdmin(false));
            dispatch(setManager(false));

            // Сохраняем токен и авторизуем пользователя
            dispatch(setAuth({userName}));
        } catch (error: any) {
            console.error("Ошибка регистрации:", error.message);
        }
    };

    

    return (
        <div className="registerContainer">
            <form className="registerForm" onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    required
                    placeholder="Почта"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    name="password"
                    required
                    placeholder="Пароль"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="text"
                    name="name"
                    required
                    placeholder="Имя"
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="text"
                    name="contactPhone"
                    required
                    placeholder="Телефон"
                    onChange={(e) => setContactPhone(e.target.value)}
                />
                <button type="submit">Регистрация</button>
            </form>
        </div>
    );
};