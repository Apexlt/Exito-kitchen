import {
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
} from "react-icons/fa";

function Contact() {
  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <h1>Contact Us</h1>
        <p>We’re always here to help you</p>
      </div>

      <div style={styles.grid}>
        {/* LEFT: CONTACT OPTIONS */}
        <div style={styles.card}>
          <h2>Reach Us</h2>

          <div style={styles.list}>
            <a href="https://wa.me/2349128981662" target="_blank" rel="noopener noreferrer" style={styles.link}>
              <FaWhatsapp /> WhatsApp
            </a>

            <a href="tel:+2349128981662" style={styles.link}>
              <FaPhone /> Call Us
            </a>

            <a href="mailto:exitokitchen965@gmail.com" style={styles.link}>
              <FaEnvelope /> Email Us
            </a>
          </div>

          <h3 style={{ marginTop: 20 }}>Socials</h3>

          <div style={styles.socials}>
            <a href="https://facebook.com/yourusername" target="_blank" rel="noopener noreferrer" style={styles.socialBtn}>
              <FaFacebook />
            </a>

            <a href="https://instagram.com/yourusername" target="_blank" rel="noopener noreferrer" style={styles.socialBtn}>
              <FaInstagram />
            </a>

            <a href="https://x.com/yourusername" target="_blank" rel="noopener noreferrer" style={styles.socialBtn}>
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* RIGHT: LOCATION */}
        <div style={styles.card}>
          <h2 style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <FaMapMarkerAlt /> Our Location
          </h2>

          <a
            href="https://www.google.com/maps?q=Lagos+Mainland+Lagos+Nigeria"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.mapBtn}
          >
            Open in Google Maps
          </a>

          <iframe
            src="https://www.google.com/maps?q=Lagos+Mainland+Lagos+Nigeria&output=embed"
            width="100%"
            height="260"
            style={styles.map}
            loading="lazy"
            title="Lagos Mainland Map"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default Contact;

/* ================= STYLES ================= */

const styles = {
  page: {
    padding: "30px",
    background: "#f4f6f9",
    minHeight: "100vh",
  },

  header: {
    marginBottom: 25,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
  },

  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginTop: 10,
  },

  link: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px",
    borderRadius: 8,
    background: "#f9fafb",
    textDecoration: "none",
    color: "#111",
    fontWeight: 500,
  },

  socials: {
    display: "flex",
    gap: 10,
    marginTop: 10,
  },

  socialBtn: {
    width: 45,
    height: 45,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    background: "#111827",
    color: "#fff",
    fontSize: 18,
    textDecoration: "none",
  },

  mapBtn: {
    display: "inline-block",
    marginTop: 10,
    marginBottom: 15,
    padding: "10px 14px",
    borderRadius: 8,
    background: "#4f46e5",
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
  },

  map: {
    borderRadius: 10,
    border: "none",
  },
};