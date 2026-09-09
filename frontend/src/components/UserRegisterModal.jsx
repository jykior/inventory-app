import { useState } from "react";
import { userRegister } from "../api/authApi";

const UserRegisterModal = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickName, setNickName] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!nickName || !email || !password) {
      setError("未入力の項目があります");
      return;
    }
    try {
      await userRegister(email, password, nickName);
      onClose();
    } catch (error) {
      setError("ユーザー登録に失敗しました");
    }
  };
  return (
    <div className="register-modal-overlay">
      <div className="register-modal">
        <h2>ユーザー登録</h2>
        <div className="register-field">
          <label>
            <span className="label-text">メールアドレス</span>
            <span className="required"> *</span>
          </label>
          <div className="login-input">
            <span className="login-icon">✉</span>
            <input
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="register-field">
          <label>
            <span className="label-text">パスワード</span>
            <span className="required"> *</span>
          </label>
          <div className="login-input">
            <span className="login-icon">🗝</span>
            <input
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="register-field">
          <label>
            <span className="label-text">ニックネーム</span>
            <span className="required"> *</span>
          </label>
          <div className="login-input">
            <span className="login-icon">♙</span>
            <input
              type="text"
              placeholder="ニックネーム"
              value={nickName}
              onChange={(e) => setNickName(e.target.value)}
            />
          </div>
        </div>

        {error && <p className="user-register-error">{error}</p>}
        <button onClick={handleRegister}>登録</button>
        <button onClick={onClose}>閉じる</button>
      </div>
    </div>
  );
};

export default UserRegisterModal;
