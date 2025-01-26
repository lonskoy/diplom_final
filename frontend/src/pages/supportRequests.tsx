import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/supportRequests.css";

type Message = {
  author: string | undefined;
  role: string;
  name: string | undefined;
  text: string;
  _id?: string;
};

type Request = {
  _id: string;
  user: string;
  title: string;
  messages: Message[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export const SupportRequests = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [textMessage, setTextMessage] = useState("");

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/client/support-requests/",
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setRequests(response.data);

      // Обновляем выбранный запрос, если он был выбран ранее
      if (selectedRequest) {
        const updatedRequest = response.data.find(
          (req: Request) => req._id === selectedRequest._id
        );
        setSelectedRequest(updatedRequest || null);
      }
    } catch (error: any) {
      console.error(
        "Ошибка загрузки обращений в тех. поддержку пользователя",
        error.message
      );
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handlerMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRequest) {
      console.error("Запрос не выбран");
      return;
    }

    const dataMessage: Message = {
      author: selectedRequest.user,
      role: "client",
      name: selectedRequest.messages[0]?.name,
      text: textMessage,
    };

    try {
      // Отправка сообщения
      await axios.post(
        `http://localhost:3000/api/common/support-requests/${selectedRequest._id}/messages`,
        dataMessage,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      // После успешной отправки обновляем список запросов
      await fetchRequests();
      setTextMessage(""); // Очищаем текстовое поле
    } catch (error: any) {
      console.log("Ошибка при создании сообщения пользователем: ", error.message);
    }
  };

  return (
    <div className="supportRequestContainer">
      {/* Левая часть с таблицей запросов */}
      <div className="requestsBox">
        <table>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Заголовок</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr
                key={request._id}
                onClick={() => setSelectedRequest(request)}
              >
                <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                <td>{request.title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Правая часть с сообщениями */}
      <div className="requestBody">
        {selectedRequest ? (
          <>
            {/* Сообщения */}
            <div className="messageBox">
              {selectedRequest.messages.map((message) => (
                <div
                  key={message._id}
                  className={`message ${
                    message.role === "client" ? "client" : "manager"
                  }`}
                >
                  {message.text}
                </div>
              ))}
            </div>

            {/* Форма ответа */}
            <form className="messageForm" onSubmit={handlerMessage}>
              <textarea
                placeholder="Введите сообщение..."
                value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)}
              />
              <button type="submit">Отправить</button>
            </form>
          </>
        ) : (
          <div>Выберите запрос для отображения сообщений</div>
        )}
      </div>
    </div>
  );
};