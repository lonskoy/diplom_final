import { useEffect, useState } from "react";
import '../styles/register.css';
import '../styles/usersAdmin.css';
import axios from "axios";

type User = {
    id: string;
    name: string;
    email: string;
    contactPhone: string;
}

export const UsersAdmin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [role, setRole] = useState('');

    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [findEmail, setFindEmail] = useState('');
    const [findPhone, setFindPhone] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/admin/users', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });
                setAllUsers(response.data);
                setFilteredUsers(response.data); // Изначально показываем всех пользователей
            } catch (error) {
                console.error("Ошибка загрузки пользователей:", error);
            }
        };

        fetchUsers();
    }, []);

    const handlerFindForm = (e: React.FormEvent) => { // Поиск пользователя по почте или телефону
        e.preventDefault();
        
        let filtered = [...allUsers];

        if (findEmail !== '') {
            filtered = filtered.filter((user) => user.email.toLowerCase().includes(findEmail.toLowerCase()));
        }

        if (findPhone !== '') {
            filtered = filtered.filter((user) => user.contactPhone.includes(findPhone));
        }

        setFilteredUsers(filtered); // Обновляем отфильтрованный список
    };

    const handlerCreateUser = async (e: React.FormEvent) => { // Создание нового пользователя
        e.preventDefault();

        const body = { email, password, name, contactPhone, role };

        try {
            console.log(body);
            await axios.post('http://localhost:3000/api/admin/users', body, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
        } catch (error: any) {
            console.error("Ошибка регистрации:", error.message);
        }
    };

    const handlerRemoveUser = async (id: string) => { // Удаление пользователя
        try {
            // Отправляем запрос на удаление
            await axios.delete(`http://localhost:3000/api/admin/users/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            // Обновляем список пользователей после удаления
            const freshUserList = await axios.get('http://localhost:3000/api/admin/users', {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            setAllUsers(freshUserList.data); // Обновляем все пользователи
            setFilteredUsers(freshUserList.data); // Обновляем отфильтрованных пользователей
        } catch (error: any) {
            console.error("Ошибка при удалении пользователя: ", error.message);
        }
    }

    return (
        <div className="usersContainer">

            <div className="registerContainer">
                <form className="registerForm" onSubmit={handlerCreateUser}>

                    <div className="form-group">
                        <div className="label">Введите почту</div>
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="Почта"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <div className="label">Введите имя</div>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="Имя"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <div className="label">Введите пароль</div>
                        <input
                            type="password"
                            name="password"
                            required
                            placeholder="Пароль"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <div className="label">Телефон</div>
                        <input
                            type="text"
                            name="contactPhone"
                            required
                            placeholder="Телефон"
                            onChange={(e) => setContactPhone(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <div className="label">Права доступа</div>
                        <select id="dropdown" className="form-select" name="role" onChange={(e) => setRole(e.target.value)} value={role}>
                            <option value="client">клиент</option>
                            <option value="manager">менеджер</option>
                            <option value="admin">администратор</option>
                        </select>
                    </div>

                    <button type="submit">Регистрация пользователя</button>
                </form>
            </div>

            <div className="findUserContainer">
                <form className="findForm" onSubmit={handlerFindForm}>
                    <input
                        className="findInputEmail"
                        type="text"
                        name="findEmail"
                        placeholder="Найти по email"
                        onChange={(e) => setFindEmail(e.target.value)}
                    />
                    <input
                        className="findInputPhone"
                        type="text"
                        name="findPhone"
                        placeholder="Найти по телефону"
                        onChange={(e) => setFindPhone(e.target.value)}
                    />
                    <button type="submit">Найти</button>
                </form>

                <div className="user-table-container">
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Имя</th>
                                <th>Email</th>
                                <th>Телефон</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user: User) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>
                                        <input type="text" defaultValue={user.name} className="table-input" />
                                    </td>
                                    <td>
                                        <input type="email" defaultValue={user.email} className="table-input" />
                                    </td>
                                    <td>
                                        <input type="text" defaultValue={user.contactPhone} className="table-input" />
                                    </td>
                                    <td>
                                        <button
                                            className="edit-button"
                                            onClick={() => console.log(`Edit user ${user.id}`)}
                                        >
                                            Редактировать
                                        </button>
                                        <button
                                            className="delete-button"
                                            onClick={() => handlerRemoveUser(user.id)}
                                        >
                                            Удалить
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};