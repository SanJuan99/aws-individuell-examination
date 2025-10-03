import React, { useState } from "react";

export default function NewMessageForm({ onSubmit, onSwitch }) {

    // Local state för inputfälten
    const [username, setUsername] = useState("");
    const [text, setText] = useState("");

    // Hantera submit av formuläret
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(username, text);
        setUsername("");
        setText("");
    };

    return (
        <div style={{ maxWidth: "500px", margin: "auto" }}>
            <h2>Skriv ett nytt meddelande</h2>

            {/* Formuläret för att posta nytt meddelande */}
            <form onSubmit={handleSubmit}>
                <textarea
                    placeholder="Ditt meddelande..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                    style={{ width: "100%", height: "100px", marginBottom: "10px" }}
                />
                <input
                    placeholder="Användarnamn"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{ width: "100%", marginBottom: "10px" }}
                />
                <button type="submit">Publicera</button>
            </form>

            {/* Knapp för att byta vy */}
            <button onClick={onSwitch} style={{ marginTop: "10px" }}>
                Visa meddelanden
            </button>
        </div>
    );
}