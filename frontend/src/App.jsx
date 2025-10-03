import React, { useState, useEffect } from "react";
import MessageList from "./MessageList";
import NewMessageForm from "./NewMessageForm";
import EditMessageForm from "./EditMessageForm";
import SearchForm from "./SearchForm";
import "./App.css";

const API_URL = "https://hxf34th7z6.execute-api.eu-north-1.amazonaws.com/dev/messages";

function App() {
  const [messages, setMessages] = useState([]);
  const [mode, setMode] = useState("form"); // "form", "list", "edit"
  const [editingMessage, setEditingMessage] = useState(null);
  const [searchUser, setSearchUser] = useState("");

  // hämta meddelanden (alla eller filtrerade)
  useEffect(() => {
    if (mode === "list") {
      let url = API_URL;
      if (searchUser) {
        url += `?username=${encodeURIComponent(searchUser)}`;
      }

      fetch(url)
        .then((res) => res.json())
        .then((data) => setMessages(data))
        .catch((err) => console.error("Error fetching messages:", err));
    }
  }, [mode, searchUser]);

  // posta nytt meddelande
  const handleNewMessage = async (username, text) => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, text }),
    });

    if (res.ok) {
      setMode("list");
    }
  };

  const handleUpdateMessage = async (id, newText) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newText }),
    });

    if (res.ok) {
      const updated = await res.json();

      // uppdatera lokala listan
      setMessages((prev) =>
        prev.map((msg) => (msg.id === updated.id ? updated : msg))
      );
      setMode("list");
      setEditingMessage(null);
    }
  };

  return (
    <div className="container">
      {/* samma mode-växling som innan */}
      {mode === "form" && (
        <NewMessageForm onSubmit={handleNewMessage} onSwitch={() => setMode("list")} />
      )}
      {mode === "list" && (
        <>
          <SearchForm onSearch={setSearchUser} />
          <MessageList
            messages={messages}
            onSwitch={() => setMode("form")}
            onEdit={(msg) => {
              setEditingMessage(msg);
              setMode("edit");
            }}
          />
        </>
      )}
      {mode === "edit" && editingMessage && (
        <EditMessageForm
          message={editingMessage}
          onSave={handleUpdateMessage}
          onCancel={() => setMode("list")}
        />
      )}
    </div>
  );
}

export default App;