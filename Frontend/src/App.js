import { useState } from "react";
import axios from "axios";

function App() {
    const [prompt, setPrompt] = useState("");
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    const handleQuery = async () => {
        try {
            const response = await axios.post("http://localhost:5000/query", { prompt });
            setQuery(response.data.query);
            setResults(response.data.results);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div>
            <h1>Natural Language to SQL Translator</h1>
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your query in natural language..."
            />
            <button onClick={handleQuery}>Generate SQL</button>

            {query && <p><b>Generated SQL:</b> {query}</p>}

            {results.length > 0 && (
                <table border="1">
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
            )}
        </div>
    );
}

export default App;
