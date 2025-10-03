import React, { useState, useMemo } from "react";

export default function MessageList({ messages, onSwitch, onEdit }) {
    const [sortOrder, setSortOrder] = useState("desc"); // "desc" = nyast först

    // sortera baserat på sortOrder
    const sortedMessages = useMemo(() => {
        const arr = [...messages];
        arr.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
        });
        return arr;
    }, [messages, sortOrder]);

    const formatDate = (iso) => {
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return iso;
        return d.toLocaleString();
    };

    return (
        <div style={{ maxWidth: "600px", margin: "auto" }}>
            <h2>Meddelanden</h2>

            {/* Dropdown för sorteringsordning */}
            <label>
                Sortera efter:
                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    style={{ marginLeft: "10px", marginBottom: "20px" }}
                >
                    <option value="desc">Nyast först</option>
                    <option value="asc">Äldst först</option>
                </select>
            </label>

            {/* Om listan är tom */}
            {messages.length === 0 ? (
                <p>Du har inga meddelanden att visa.</p>
            ) : (
                // Annars rendera listan
                <ul>
                    {sortedMessages.map((msg) => (
                        <li key={msg.id} style={{ marginBottom: "15px" }}>
                            <strong>{msg.username}</strong>: {msg.text} <br />
                            <small>{formatDate(msg.createdAt)}</small>
                            <br />
                            <button onClick={() => onEdit(msg)} style={{ marginTop: "5px" }}>
                                Redigera
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {/* Knapp för att byta vy till formuläret */}
            <button onClick={onSwitch} style={{ marginTop: "10px" }}>
                Skriv nytt meddelande
            </button>
        </div>
    );
}