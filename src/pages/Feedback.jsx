import { useState } from "react";

function Feedback() {
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!message.trim()) {
      alert("Message is required");
      return;
    }

    const token = localStorage.getItem("token");

    console.log("TOKEN CHECK:", token);

    if (!token) {
      alert("No token found. Please login again.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message,
          rating: Number(rating),
        }),
      });

      // ✅ SAFE SINGLE PARSE
      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      console.log("STATUS:", res.status);
      console.log("RESPONSE:", data);

      // ❌ HANDLE FAILURES
      if (!res.ok) {
        alert(data?.message || "Failed to send feedback");
        return;
      }

      // ✅ SUCCESS
      console.log("SUCCESS: Feedback submitted");

      setDone(true);
      setMessage("");
      setRating(5);

    } catch (err) {
      console.error("NETWORK ERROR:", err);
      alert("Network error (backend not reachable)");
    } finally {
      setLoading(false);
    }
  };

  if (done) return <p>Thanks for your feedback ❤️</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Feedback</h2>

      <textarea
        placeholder="Your feedback..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={5}
        style={{ width: "100%" }}
      />

      <select
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        style={{ marginTop: 10 }}
      >
        <option value={5}>⭐⭐⭐⭐⭐</option>
        <option value={4}>⭐⭐⭐⭐</option>
        <option value={3}>⭐⭐⭐</option>
        <option value={2}>⭐⭐</option>
        <option value={1}>⭐</option>
      </select>

      <br />

      <button
        onClick={submit}
        disabled={loading}
        style={{ marginTop: 10 }}
      >
        {loading ? "Sending..." : "Submit"}
      </button>
    </div>
  );
}

export default Feedback;