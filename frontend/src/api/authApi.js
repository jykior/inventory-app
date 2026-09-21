export const login = async (email, password) => {
  const response = await fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("LOGIN_FAILED");
    }
    throw new Error("LOGIN_REQUEST_FAILED");
  }

  return await response.json();
};

export const guestLogin = async () => {
  const response = await fetch("http://localhost:8080/api/guest/login", {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("GUEST_LOGIN_FAILED");
  }

  return await response.json();
};

export const guestLogout = async () => {
  const response = await fetch("http://localhost:8080/api/guest/logout", {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("GUEST_LOGOUT_FAILED");
  }
};

export const userRegister = async (
  email,
  password,
  confirmPassword,
  nickName,
) => {
  const response = await fetch("http://localhost:8080/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password, confirmPassword, nickName }),
  });

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }
    if (response.status === 400) {
      throw new Error("PASSWORD_MISMATCH");
    }
    throw new Error("REGISTER_FAILED");
  }
};

export const getUsers = async () => {
  const response = await fetch("http://localhost:8080/api/auth/users", {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("ユーザー一覧の取得に失敗しました");
  }
  return await response.json();
};

export const updateUserRole = async (id, role) => {
  const response = await fetch(`http://localhost:8080/api/auth/${id}/role`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ role }),
  });

  if (!response.ok) {
    throw new Error("権限の変更に失敗しました");
  }
};
