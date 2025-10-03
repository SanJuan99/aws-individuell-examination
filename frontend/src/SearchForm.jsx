import React, { useState } from "react";

export default function SearchForm({ onSearch }) {
    const [input, setInput] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(input.trim()); // skicka användarnamn till App.jsx
    };

    const handleReset = () => {
        setInput("");
        onSearch(""); // töm filtret
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
            <input
                type="text"
                placeholder="Sök efter användare"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ marginRight: "10px" }}
            />
            <button type="submit">Sök</button>

            {/* knapp för att nollställa filtret */}
            <button
                type="button"
                onClick={handleReset}
                style={{ marginLeft: "10px" }}
            >
                Visa alla
            </button>
        </form>
    );
}

