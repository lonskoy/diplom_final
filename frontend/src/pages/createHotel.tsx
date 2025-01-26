import { FC, useState } from 'react';
import axios from 'axios';
import '../styles/createHotel.css'; // Подключаем внешний CSS файл

export const CreateHotel: FC = () => {
    // Состояния для формы
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null); // Для определения успешности

    // Обработчик отправки формы
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (title.length < 2 || description.length < 10) {
            setMessage('Пожалуйста, заполните все поля корректно.');
            setIsSuccess(false);
            return;
        }

        const body = { title, description };

        try {
            // Добавляем заголовок Authorization с accessToken
            await axios.post(
                'http://localhost:3000/api/admin/hotels',
                body,
                {
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8' // Тип контента
                    },
                    withCredentials: true
                }
            );
            setMessage(`Отель "${title}" успешно создан.`);
            setIsSuccess(true);
            setTitle(''); // Очистка поля
            setDescription(''); // Очистка поля

        } catch (error) {
            setMessage('Ошибка при создании отеля. Попробуйте еще раз');
            setIsSuccess(false);
        }
    };

    return (
        <div className="createHotelContainer">
            <form
                onSubmit={handleSubmit}
                className="createHotelForm"
            >
                <h2 className="text-center">Создать гостиницу</h2>

                {/* Поле для названия отеля */}
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Название отеля"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        minLength={2}
                        required
                    />
                </div>

                {/* Поле для описания отеля */}
                <div className="mb-3">
                    <textarea
                        className="form-control"
                        placeholder="Описание отеля"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        minLength={10}
                        required
                        rows={5}
                    ></textarea>
                </div>

                {/* Сообщение об успехе или ошибке */}
                {message && (
                    <div
                        className={`alert ${isSuccess ? 'alert-success' : 'alert-danger'}`}
                        role="alert"
                    >
                        {message}
                    </div>
                )}

                {/* Кнопка создания отеля */}
                <button
                    type="submit"
                    className="btn btn-primary w-100"
                >
                    Создать
                </button>
            </form>
        </div>
    );
};