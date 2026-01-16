import { useEffect, useState } from "react";
import api from "../services/api";

export default function ChatBox() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [sessionId, setSessionId] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const startChat = async () => {
    const res = await api.post("/chat/start", {
      user_id: user.user_id,
      supporter_id: 1
    });
    setSessionId(res.data.session_id);
  };

  const sendMessage = async () => {
    await api.post("/chat/message", {
      session_id: sessionId,
      sender_id: user.user_id,
      message
    });
    setMessage("");
    loadMessages();
  };

  const loadMessages = async () => {
    if (!sessionId) return;
    const res = await api.get(`/chat/${sessionId}`);
    setMessages(res.data);
  };

  return (
  <div>
    <h3>Support Chat</h3>

    {!sessionId && <button onClick={startChat}>Start Chat</button>}

    <div style={{
      height:220,
      overflowY:"auto",
      background:"#f8fafc",
      padding:10,
      borderRadius:8,
      margin:"12px 0"
    }}>
      {messages.map((m,i) => (
        <p key={i}><b>{m.sender_id == user.user_id ? "You" : "Supporter"}:</b> {m.message}</p>
      ))}
    </div>

    {sessionId && (
      <>
        <input value={message} onChange={e=>setMessage(e.target.value)} />
        <button onClick={sendMessage}>Send</button>
      </>
    )}
  </div>
);

}
