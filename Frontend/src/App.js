import { useState } from "react";
import axios from "axios";
import "./App.css"; // Import CSS file

function App() {
    const [prompt, setPrompt] = useState("");
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleQuery = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await axios.post("http://localhost:5000/query", { prompt });
            setQuery(response.data.query);
            setResults(response.data.results);
        } catch (err) {
            setError("Failed to fetch results. Please try again.");
            console.error("Error:", err);
        }
        setLoading(false);
    };

    return (
        <div className="container">
            <div className="card">
                <h1>Natural Language to SQL Translator</h1>

                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter your query in natural language..."
                    className="textarea"
                    rows="3"
                />

                <button onClick={handleQuery} disabled={loading} className="btn">
                    {loading ? "Generating SQL..." : "Generate SQL"}
                </button>

                {error && <p className="error">{error}</p>}

                {query && (
                    <div className="query-box">
                        <p><b>Generated SQL:</b></p>
                        <pre>{query}</pre>
                    </div>
                )}

                {results.length > 0 && (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    {Object.keys(results[0]).map((key) => (
                                        <th key={key}>{key}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((row, index) => (
                                    <tr key={index}>
                                        {Object.values(row).map((val, i) => (
                                            <td key={i}>{val}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
