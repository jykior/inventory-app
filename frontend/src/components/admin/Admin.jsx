import { useEffect, useState } from "react";
import { getUsers, updateUserRole } from "../../api/authApi";
import "./Admin.css";

function Admin() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
/**
 * ユーザーの権限を変更する。
 *
 * 権限を更新した後、
 * usersのstateに変更内容を反映する。
 */
  const handleRoleChange = async (id, role) => {
    try {
      await updateUserRole(id, role);

      setUsers((users) =>
        users.map((user) => (user.id === id ? { ...user, role: role } : user)),
      );
      setMessage("権限を変更しました");
    } catch {
      setMessage("権限の変更に失敗しました");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData = await getUsers();
        setUsers(userData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>ユーザー管理</h1>
      <div className="message-area">
        {message && <p className="message">{message}</p>}
      </div>
      <table className="user-table">
        <thead>
          <tr>
            <th>ユーザー名</th>
            <th>権限</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.nickName}</td>

              <td>
                {user.role === "ADMIN" ? (
                  <span>ADMIN</span>
                ) : (
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    <option value="MANAGER">MANAGER</option>
                    <option value="STAFF">STAFF</option>
                  </select>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default Admin;
