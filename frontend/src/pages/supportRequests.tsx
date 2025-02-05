import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/supportRequests.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import jwtDecode from "jwt-decode";

type Message = {
  author: string | undefined;
  role: string;
  name: string | undefined;
  text: string;
  readAt: Date;
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

interface DecodedData {
  id: string;
  role: string;
  name: string;
}

export const SupportRequests = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [textMessage, setTextMessage] = useState("");
  const [role, setRole] = useState<string>("");
  const [nameManager, setNameManager] = useState<string>("");
  const [activeStatusRequests, setActiveStatusRequests] = useState<string>('true');

  const userToken = useSelector((state: RootState) => state.auth.userToken);

  useEffect(() => {
    if (userToken) {
      const decoded: DecodedData = jwtDecode(userToken);
      setRole(decoded.role);
      setNameManager(decoded.name);
    }
  }, [userToken]);

  useEffect(() => {
    if (role) {
      fetchRequests();
    }
  }, [role]);

  const fetchRequests = async () => {
    try {
      let url = role === "client"
        ? "http://localhost:3000/api/client/support-requests/"
        : "http://localhost:3000/api/common/support-requests/manager";

      const response = await axios.get(url, {
        params: role === "manager" ? { isActive: 'true' } : {},
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      setRequests(response.data);
      console.log(response.data);
    } catch (error: any) {
      console.error("Ошибка загрузки обращений", error.message);
    }
  };

  useEffect(() => {
    if (requests.length > 0 && selectedRequest) {
      const updatedRequest = requests.find((req) => req._id === selectedRequest._id);
      setSelectedRequest(updatedRequest || null);
    }
  }, [requests]);

  const handlerMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRequest) {
      console.error("Запрос не выбран");
      return;
    }

    if (!textMessage.trim()) {
      console.warn("Нельзя отправить пустое сообщение!");
      return;
    }

    const dataMessage: Message = {
      author: selectedRequest.user,
      role: role === "client" ? "client" : "manager",
      name: role === "client" ? selectedRequest.messages[0]?.name : nameManager,
      text: textMessage,
    };

    try {
      await axios.post(
        `http://localhost:3000/api/common/support-requests/${selectedRequest._id}/messages`,
        dataMessage,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      await fetchRequests();
      setTextMessage("");
    } catch (error: any) {
      console.log("Ошибка при создании сообщения:", error.message);
    }
  };

  const handleCloseRequest = async () => {
    if (!selectedRequest) return;

    try {
      await axios.get(
        `http://localhost:3000/api/common/support-requests/close/${selectedRequest._id}`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      // После закрытия обновляем список обращений
      await fetchRequests();
      setSelectedRequest(null); // Сбрасываем выбранное обращение
    } catch (error: any) {
      console.error("Ошибка при закрытии обращения:", error.message);
    }
  };

  return (
    <div className="suportRequestBox">
      <div className="newRequest_button_box">
        <Link to="/api/client/create-support-request">
          <button type="button" className="newRequest_button">Новое обращение</button>
        </Link>
      </div>
      <div className="supportRequestContainer">
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
                <tr key={request._id} onClick={() => setSelectedRequest(request)}>
                  <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                  <td>{request.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="requestBody">
          {selectedRequest ? (
            <>
              <div className="messageBox">
                {selectedRequest.messages.map((message) => (

                  <div className="messageContainer">
                    <div
                      className="readStatus"
                      style={{ backgroundColor: message.readAt === null ? 'grey' : 'green' }}
                    >
                      Х
                    </div>

                    <div key={message._id} className={`message ${message.readAt}`}>
                      {message.text}
                    </div>

                  </div>
                ))}
              </div>
              <form className="messageForm" onSubmit={handlerMessage}>
                <textarea placeholder="Введите сообщение..." value={textMessage} onChange={(e) => setTextMessage(e.target.value)} />
                <button type="submit" className="buttonSend">Отправить</button>
                {role === 'manager'
                  ? <button type="button" className="buttonClosed" onClick={handleCloseRequest}>Закрыть обращение</button>
                  : <></>}
              </form>
            </>
          ) : (
            <div>Выберите запрос для отображения сообщений</div>
          )}
        </div>
      </div>
    </div>
  );
};