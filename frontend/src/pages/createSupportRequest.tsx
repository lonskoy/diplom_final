import axios from "axios";
import { useState } from "react";
import "../styles/createSupportRequest.css";

export const CreateSupportRequest = () => {
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");

    const handlerRequestForm = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !text.trim()) {
            console.error("Заполните все поля!");
            return;
        }

        const dataNewRequest = {
            title,
            text,
        };

        try {
            await axios.post("http://localhost:3000/api/client/support-requests", dataNewRequest, {
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                withCredentials: true,
            });

            console.log("Заявка успешно создана!");
            setTitle("");
            setText(""); // Очищаем форму после успешного создания заявки
        } catch (error: any) {
            console.error("Ошибка при создании обращения:", error.message);
        }
    };

    return (
        <div className="newSupportRequestBox">
            <form className="newSupportRequestForm" onSubmit={handlerRequestForm}>
                <input
                    type="text"
                    className="inputTitle"
                    placeholder="Заголовок"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    placeholder="Текст обращения"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <button type="submit">Создать обращение</button>
            </form>
        </div>
    );
};