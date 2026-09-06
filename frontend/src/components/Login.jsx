import { useState } from "react";
import { login } from "../api/authApi";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("メールアドレスを入力してください");
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setError("正しいメールアドレスを入力してください");
      return;
    }
    if (!password.trim()) {
      setError("パスワードを入力してください");
      return;
    }

    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    if (!passwordPattern.test(password)) {
      setError("パスワードは6文字以上の英数字で入力してください");
      return;
    }
    
    try {
      const user = await login(email, password);
      onLogin(user);
    } catch (error) {
      setError("メールアドレスまたはパスワードが正しくありません");
    }
  };

  return (
    <div className="login-page">
      <div className="login-panel">
        <div className="login-logo">
          <h1>INVENTORY</h1>
          <h2>MANAGER</h2>
        </div>

        <div className="login-line"></div>

        <h3>お店の在庫を一目で把握</h3>

        <p className="login-message">在庫状況をいつでも正確に。</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="login-input">
            <span className="login-icon">✉</span>
            <input
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="login-input">
            <span className="login-icon">♙</span>
            <input
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-button">
            ログイン
          </button>
        </form>

        <div className="login-divider">
          <span></span>
          <p>または</p>
          <span></span>
        </div>

        <div className="login-sub-buttons">
          <button type="button" className="register-button">
            <span>♙</span>
            新規登録
          </button>

          <button type="button" className="guest-button" onClick={onLogin}>
            <span>♙</span>
            ゲストログイン
          </button>
        </div>
      </div>
    </div>
  );
}
export default Login;
