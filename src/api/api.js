const BASE_URL = "https://exito-kitchen.onrender.com";

/* =========================
   PAYMENT
========================= */
export const verifyPayment = async (payload) => {
  const res = await fetch(`${BASE_URL}/verify-payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return res.json();
};

/* =========================
   ADMIN DATA
========================= */
export const getOrders = async () => {
  const res = await fetch(`${BASE_URL}/admin/orders`);
  return res.json();
};

export const getUsers = async () => {
  const res = await fetch(`${BASE_URL}/admin/users`);
  return res.json();
};

/* =========================
   OPTIONAL (DELETE ORDER)
========================= */
export const deleteOrder = async (id) => {
  const res = await fetch(`${BASE_URL}/admin/orders/${id}`, {
    method: "DELETE",
  });

  return res.json();
};
