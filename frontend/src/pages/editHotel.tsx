import { FC, useState } from "react";
import '../styles/editHotel.css'

export const EditHotel: FC = () => {
    const [idHotel, setIdHotel] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [text, setText] = useState('');

    const fetchHotel = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/admin/hotels/${idHotel}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const dataHotel = await response.json();
            setTitle(dataHotel.title || '');
            setDescription(dataHotel.description || '');
            setText(dataHotel.text || '');

        } catch (error) {
            console.log(`Ошибка при загрузке гостиницы: ${error}`);
        }
    };

    const handleSave = async () => {
        const dataUpdate = {
            title: title || '',
            description: description || '',
            text: text || ''
        };
        console.log(`Передаваемые данные : ${JSON.stringify(dataUpdate)}`)
        try {
            const response = await fetch(`http://localhost:3000/api/admin/hotels-edit/${idHotel}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(dataUpdate)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setIdHotel('');
            setTitle('');
            setDescription('');
        } catch (error) {
            console.log(`Ошибка при обновлении гостиницы: ${error}`);
        }
    };

    return (
        <div className="editHotelContainer">
            {/* Поиск отеля */}
            <div className="searchContainer">
                <input
                    type="text"
                    className="inputText"
                    placeholder="Введите ID отеля"
                    value={idHotel}
                    onChange={(e) => setIdHotel(e.target.value)}
                />
                <button onClick={fetchHotel} className="btn btn-primary">
                    Найти
                </button>
            </div>

            {/* Форма редактирования */}
            <form className="hotelForm" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                <input
                    type="text"
                    className="inputText"
                    placeholder="Название отеля"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    className="form-control"
                    placeholder="Краткое отеля"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                ></textarea>

                <textarea
                    className="form-control"
                    placeholder="Полное описание отеля"
                    value={description}
                    onChange={(e) => setText(e.target.value)}
                    rows={7}
                ></textarea>

                <button type="submit" className="btn btn-success">
                    Обновить
                </button>
            </form>
        </div>
    );
};