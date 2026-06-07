const BASE_URL = "http://localhost:5000";

/* =========================
   LOGIN USER
========================= */
export const loginUser = async (email, password) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    console.log("LOGIN RESPONSE:", data);

    return data;
  } catch (err) {
    console.error("Login error:", err);
    return { success: false, message: "Server error" };
  }
};

/* =========================
   REGISTER USER (🔥 FIXED)
========================= */
export const registerUser = async (email, password) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    console.log("REGISTER RESPONSE:", data);

    return data;
  } catch (err) {
    console.error("Register error:", err);
    return { success: false, message: "Server error" };
  }
};
