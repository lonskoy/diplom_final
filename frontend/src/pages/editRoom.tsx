import { FC, useState } from 'react';
import '../styles/editRoom.css'; // Подключаем внешний CSS файл
import axios from 'axios';


export const EditRoom: FC = () => {
    const [roomId, setRoomId] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<FileList | null>(null);

    // Получение данных комнаты
    const fetchRoom = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/admin/hotel-rooms/${roomId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            const dataRoom = await response.json();
            console.log(dataRoom);
            setDescription(dataRoom.description || '');
            setImages(dataRoom.images || []);
            console.log(dataRoom.images);
            console.log(images);
        } catch (error) {
            console.error('Ошибка при загрузке данных комнаты:', error);
        }
    };

    // Обработчик добавления новых изображений
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewImages(e.target.files);
    };
    
// Сохранение обновленных данных
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('description', description);
    
        // Добавляем новые изображения (если они есть)
        if (newImages) {
            Array.from(newImages).forEach((file) => {
                formData.append('images', file); // Новые изображения, отправляем как файлы
            });
        }
    
        try {
            console.log(formData);
            await axios.put(`http://localhost:3000/api/admin/hotel-rooms-edit/${roomId}`,formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true
            });
    
            // Очистка после успешного сохранения (опционально)
            setRoomId('');
            setDescription('');
            setImages([]);
            setNewImages(null);
    
        } catch (error) {
            console.error('Ошибка при обновлении данных комнаты:', error);
        }
    };

    // Удаление картинки из профиля номера
    const handleRemoveImage = async (index: number, image: string) => {
        const formData = new FormData();
        formData.append("imageUrl", image);

        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
        await axios.put(`http://localhost:3000/api/admin/hotel-rooms-edit/${roomId}`, formData)
    };

    return (
        <div className="editRoomContainer">
            {/* Поиск комнаты */}
            <div className="searchContainer">
                <input
                    type="text"
                    className="inputText"
                    placeholder="Введите ID комнаты"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                />
                <button onClick={fetchRoom} className="btn btn-primary">
                    Найти
                </button>
            </div>

            {/* Форма редактирования */}
            <form className="roomForm" onSubmit={handleSave}>
                <textarea
                    className="form-control"
                    placeholder="Описание номера"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                ></textarea>
                <input
                    type="file"
                    className="formFile"
                    onChange={handleFileChange}
                    multiple
                />
                <button type="submit" className="btn btn-success">
                    Обновить
                </button>
            </form>

            {/* Галерея изображений */}
            <div className="fotoGalary">
                {images.map((image, index) => (
                    <div key={index} className="image_container">
                        <img
                            src={image}
                            className="image"
                            alt={`Room ${index}`}
                        />
                        <div className='imageRemove' onClick={()=>handleRemoveImage(index, image)}>Х</div>
                    </div>
                ))}
            </div>
        </div>
    );
};