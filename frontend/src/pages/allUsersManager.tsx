import axios from 'axios';
import { useEffect, useState } from 'react';
import '../styles/allUsersManager.css';

interface UserDocument {
  id: string;
  email: string;
  name: string;
  contactPhone: string;
  role: string; // Добавляем поле для роли
}

export const AllUsersManager = () => {
  const [allUsers, setAllUsers] = useState<UserDocument[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get('http://localhost:3000/api/manager/users', {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      setAllUsers(response.data);
      console.log(response.data);
    };
    fetchUsers();
  }, []);

  return (
    <div className="allUsersContainer">
      <table className="usersTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Имя</th>
            <th>Почта</th>
          </tr>
        </thead>
        <tbody>
          {allUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}