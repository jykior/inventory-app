import { useState } from "react";
import { userRegister } from "../../api/authApi";

const UserRegisterModal = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickName, setNickName] = useState("");
  const [error, setError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
/**
 * ユーザー登録を行う。
 *
 * 入力内容をチェックし、
 * ユーザーを登録した後にモーダルを閉じる。
 */
  const handleRegister = async () => {
    if (!nickName || !email || !password || !confirmPassword) {
      setError("未入力の項目があります");
      return;
    }
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setError("正しいメールアドレスを入力してください");
      return;
    }
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#]{6,}$/;
    if (!passwordPattern.test(password)) {
      setError("パスワードは6文字以上の英数字で入力してください");
      return;
    }
    if (password !== confirmPassword) {
      setError("パスワードが一致しません");
      return;
    }
    try {
      await userRegister(email, password, confirmPassword, nickName);
      onClose();
    } catch (error) {
      if (error.message === "EMAIL_ALREADY_EXISTS") {
        setError("このメールアドレスはすでに登録されています");
      } else if (error.message === "PASSWORD_MISMATCH") {
        setError("パスワードが一致しません");
      } else {
        setError("ユーザー登録に失敗しました");
      }
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
              placeholder="6文字以上の英数字で入力"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="password-note">
          <div>
            ※
            英字（大文字・小文字どちらでも）・数字を必ず含む、英数字・記号の6文字以上で入力してください。
          </div>
          <div>使用できる記号：! @ #</div>
        </div>
        <div className="register-field">
          <label>
            <span className="label-text">確認用パスワード</span>
            <span className="required"> *</span>
          </label>
          <div className="login-input">
            <span className="login-icon">🗝</span>
            <input
              type="password"
              placeholder="もう一度パスワードを入力"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
