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
