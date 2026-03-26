import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = import.meta.env.VITE_API_URL;

function App() {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [editId, setEditId] = useState(null);

  const fetchContacts = async () => {
    const res = await axios.get(API);
    setContacts(res.data);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleSubmit = async () => {
    if (!form.name) return alert("Name is required");

    if (editId) {
      await axios.put(`${API}/${editId}`, form);
      setEditId(null);
    } else {
      await axios.post(API, form);
    }

    setForm({ name: "", email: "", phone: "" });
    fetchContacts();
  };

  const handleEdit = (contact) => {
    setForm(contact);
    setEditId(contact._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchContacts();
  };

  return (
    <div className="app-container">
      <div className="card">
        <h1>📇 Contact Manager</h1>

        <div className="form">
          <input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <button className="primary-btn" onClick={handleSubmit}>
            {editId ? "Update Contact" : "Add Contact"}
          </button>
        </div>
      </div>

      <div className="list-container">
        {contacts.length === 0 ? (
          <p className="empty">No contacts yet</p>
        ) : (
          contacts.map((c) => (
            <div key={c._id} className="contact-card">
              <div className="contact-info">
                <h3>{c.name}</h3>
                <p>{c.email}</p>
                <p>{c.phone}</p>
              </div>

              <div className="actions">
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(c)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(c._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;