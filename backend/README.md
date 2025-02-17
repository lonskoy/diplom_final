# 📌 Бэкенд структура

```
src
├── auth
│   ├── guards
│   ├── strategy
├── chat
├── chatOnline
├── core
│   ├── environment
├── hotel
├── hotel-room
├── reservation
└── users
```

---

## 🔹 Назначение модулей

### 🔸 Модуль `auth`

**Общее описание:**  
Данный модуль отвечает за политику разделения прав доступа по 3 типам пользователей: **клиент**, **менеджер**, **администратор**, а также за логирование и разлогирование пользователя.

#### 🔹 Стратегии (`src/auth/strategy`)
Все стратегии работают одинаково:
1. Получаем токен из **cookie**.
2. Ищем пользователя по `id` в базе данных.
3. Определяем его `role`.
4. Если `role` подходит – запрос выполняется, иначе отклоняется.

#### 🔹 Сервисы
- **`validateUser(email: string, password: string)`** – передает данные в `usersService.checkUser` и проверяет корректность введённых данных.
- **`login({user})`** – формирует объект с `id`, `role`, `name`, шифрует его в токен и возвращает токен.
- **`logout()`** – очищает токен в **cookie** и перенаправляет на стартовую страницу.

#### 🔹 Роуты
- `POST /api/auth/login` – авторизация
- `POST /api/auth/logout` – выход

---

### 🔸 Модуль `Chat`

**Общее описание:**  
Реализует функционал написания обращений в техподдержку и работы с ними.

#### 🔹 Сервисы
##### **`supportRequest.service`** (для менеджера)
- **`getSupportRequests(user?: string, isActive: boolean)`** – ищет обращения пользователя или всех пользователей. `isActive` указывает, открыто (`true`) или закрыто (`false`) обращение.
- **`sendMessage({author, role, name, text}, id)`** – отправка сообщения в существующее обращение.
- **`getMessages(id: string)`** – получение всех сообщений в обращении.

##### **`supportRequestClient.service`** (для клиента)
- **`createSupportRequest({title, text}, access_token: string)`** – создание нового обращения в техподдержку.
- **`findSupportRequestsClient(access_token: string)`** – поиск всех обращений пользователя.
- **`markMessagesAsRead(id: string)`** – отметка сообщений техподдержки как прочитанных.
- **`getUnreadCount(id: string)`** – количество непрочитанных сообщений.

##### **`supportRequestEmployee.service`** (для сотрудников)
- **`markMessagesAsRead(id: string)`** – отметка клиентских сообщений как прочитанных.
- **`getUnreadCount(id: string)`** – количество непрочитанных сообщений от клиента.
- **`closeRequest(id: string)`** – закрытие обращения.

---

### 🔸 Модуль `Chat-Online`

**Общее описание:**  
Реализует онлайн-чат между пользователем и техподдержкой через **Socket.IO** без использования комнат. Имя отправителя отображается перед сообщением.

---

### 🔸 Модуль `Hotel`

**Общее описание:**  
Позволяет управлять отелями (**создание, поиск, редактирование**).

🚨 **Доступ: только для администратора!**

#### 🔹 Роуты
- `POST /api/admin/hotels` – создание отеля
- `GET /api/admin/hotels` – список всех отелей
- `GET /api/admin/hotels/:id` – поиск отеля по `id`
- `PATCH /api/admin/hotels/:id` – редактирование отеля

#### 🔹 Сервисы
- **`create({title, description, text})`** – создание нового отеля.
- **`findAll({limit, offset, title})`** – вывод списка отелей с фильтрацией.
- **`update(id: string, {title, description, text})`** – обновление данных отеля.

---

### 🔸 Модуль `Hotel-room`

**Общее описание:**  
Позволяет управлять комнатами отеля.

🚨 **Доступ: только для администратора!**

#### 🔹 Роуты
- `POST /api/admin/hotel-room` – создание комнаты
- `GET /api/admin/hotel-rooms` – список комнат
- `GET /api/admin/hotel-rooms/:id` – поиск комнаты по `id`
- `PATCH /api/admin/hotel-rooms/:id` – редактирование комнаты

#### 🔹 Сервисы
- **`create({description, images, isEnable, hotel})`** – создание комнаты.
- **`findAll({limit, offset, hotel, isEnabled})`** – список комнат с фильтрацией.
- **`findById(id: string)`** – поиск комнаты по `id`.
- **`updateById(id: string, {description, images}, files)`** – обновление комнаты.

---

### 🔸 Модуль `Reservation`

**Общее описание:**  
Позволяет клиентам и менеджерам управлять бронированием комнат.

#### 🔹 Роуты
##### `reservation.client.controller` (для клиентов)
- `POST /api/client/reservations` – создание бронирования
- `GET /api/client/reservations` – список бронирований
- `DELETE /api/client/reservations/:id` – отмена бронирования

##### `reservation.manager.controller` (для менеджеров)
- `GET /api/manager/reservations/:id` – поиск бронирований клиента
- `DELETE /api/manager/reservations/:id` – удаление бронирования

#### 🔹 Сервисы
- **`create({hotelRoom, dateStart, dateEnd}, access_token)`** – создание бронирования.
- **`allReservationsClient(access_token)`** – список бронирований клиента.
- **`allReservationsManager(userId)`** – бронирования конкретного пользователя.
- **`removeReservationClient(access_token, idReservation)`** – отмена бронирования клиентом.
- **`removeReservationManager(idReservation)`** – отмена бронирования менеджером.

---

### 🔸 Модуль `Users`

**Общее описание:**  
Функционал управления пользователями (`client`, `manager`, `admin`).

#### 🔹 Роуты
##### `client.controller`
- `POST /api/client/register` – регистрация клиента
- `GET /api/client/rooms` – список комнат
- `GET /api/client/find-room` – поиск свободных комнат
- `POST /api/client/support-requests` – создание обращения в поддержку

##### `manager.controller` (только для `manager`)
- `GET /api/manager/users` – список пользователей

##### `users.controller` (только для `admin`)
- `POST /api/admin/users` – создание пользователя
- `GET /api/admin/users` – список пользователей
- `DELETE /api/admin/users/:id` – удаление пользователя

#### 🔹 Сервисы
- **`create({email, name, password, contactPhone, role})`** – создание пользователя.
- **`findById(id)`** – поиск пользователя по `id`.
- **`findAll({limit, offset, email, name, contactPhone})`** – поиск пользователей.
- **`removeUser(id)`** – удаление пользователя.

---

📌 Теперь документ выглядит более читаемым и удобным для восприятия! 🚀


