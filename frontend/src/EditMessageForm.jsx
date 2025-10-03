import React, { useState } from "react";

export default function EditMessageForm({ message, onSave, onCancel }) {
    const [text, setText] = useState(message.text);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(message.id, text); // skicka tillbaka id + ny text
    };

    return (
        <div style={{ maxWidth: "500px", margin: "auto" }}>
            <h2>Redigera meddelande</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                    style={{ width: "100%", height: "100px", marginBottom: "10px" }}
                />
                <button type="submit">Spara ändring</button>
                <button type="button" onClick={onCancel} style={{ marginLeft: "10px" }}>
                    Avbryt
                </button>
            </form>
        </div>
    );
}