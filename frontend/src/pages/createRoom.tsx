import { FC, useState } from 'react';
import axios from 'axios';
import '../styles/createRoom.css'; // Подключаем внешний CSS файл

export const CreateRoom: FC = () => {
    // Состояния для формы
    const [description, setDescription] = useState('');
    const [hotel, setHotel] = useState('');
    const [files, setFiles] = useState<FileList | null>(null);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null); // Для определения успешности

    // Обработчик изменения файлов
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 10) {
            setMessage('Максимум можно загрузить 10 файлов.');
            setIsSuccess(false);
            return;
        }
        setFiles(e.target.files);
    };

    // Обработчик отправки формы
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (description.length < 10 || hotel.length < 2) {
            setMessage('Пожалуйста, заполните все поля корректно.');
            setIsSuccess(false);
            return;
        }

        const formData = new FormData();
        formData.append('description', description);
        formData.append('hotel', hotel);
        if (files) {
            Array.from(files).forEach((file) => {
                formData.append('images', file);
            });
        }

        try {
            await axios.post('http://localhost:3000/api/admin/hotel-rooms', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });
            setMessage('Номер успешно создан.');
            setIsSuccess(true);
            setDescription(''); // Очистка поля
            setHotel(''); // Очистка поля
            setFiles(null); // Очистка файлов
        } catch (error) {
            setMessage('Ошибка при создании номера. Попробуйте еще раз.');
            setIsSuccess(false);
        }
    };

    return (
        <div className="createRoomContainer">
            <form
                onSubmit={handleSubmit}
                className="createRoomForm"
            >
                <h2 className="text-center">Новый номер</h2>

                {/* Поле для описания комнаты */}
                <div className="mb-3">
                    <textarea
                        className="form-control"
                        placeholder="Описание номера"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        minLength={10}
                        required
                        rows={5}
                    ></textarea>
                </div>

                {/* Поле для названия отеля */}
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="id отеля"
                        value={hotel}
                        onChange={(e) => setHotel(e.target.value)}
                        minLength={2}
                        required
                    />
                </div>

                {/* Поле для загрузки файлов */}
                <div className="mb-3">
                    <input
                        type="file"
                        className="form-control"
                        onChange={handleFileChange}
                        multiple
                    />
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

                {/* Кнопка создания комнаты */}
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