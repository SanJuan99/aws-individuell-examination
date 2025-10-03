import React, { useEffect, useState } from "react";

// backend API URL 
const API_URL = "https://hxf34th7z6.execute-api.eu-north-1.amazonaws.com/dev/messages";

export default function MessageBoard() {
    // State för att lagra meddelanden som hämtas
    const [messages, setMessages] = useState([]);
    // State för formulär-input
    const [username, setUsername] = useState("");
    const [text, setText] = useState("");

    // hämtar meddelanden från backend
    useEffect(() => {
        fetch(API_URL)
            .then((res) => res.json())
            .then((data) => setMessages(data))
            .catch((err) => console.error("Error fetching messages:", err));
    }, []);

    // hanterar att posta nytt meddelande
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newMessage = { username, text };

        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newMessage),
        });

        if (res.ok) {
            const savedMessage = await res.json();
            // Uppdatera state med det nya meddelandet
            setMessages([...messages, savedMessage]);
            // Töm inputfälten
            setUsername("");
            setText("");
        } else {
            console.error("Failed to post message");
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
            <h1>📌 Anslagstavla</h1>

            {/* Formulär för nytt meddelande */}
            <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
                <input
                    placeholder="Användarnamn"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{ marginRight: "10px" }}
                />
                <input
                    placeholder="Skriv ett meddelande..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                    style={{ marginRight: "10px" }}
                />
                <button type="submit">Posta</button>
            </form>

            {/* Lista alla meddelanden */}
            <ul>
                {messages.map((msg) => (
                    <li key={msg.id}>
                        <strong>{msg.username}</strong>: {msg.text}{" "}
                        <em>({msg.createdAt})</em>
                    </li>
                ))}
            </ul>
        </div>
    );
}