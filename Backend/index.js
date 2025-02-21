const express = require("express");
const sql = require("mssql");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(express.json());
app.use(cors());

// Database Configuration
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: "northwinddb",
    options: { encrypt: true, trustServerCertificate: true },
};

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/query", async (req, res) => {
    const { prompt } = req.body;

    try {
        // Step 1: Convert natural language to SQL using Gemini API
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(`Convert this to a SQL query for the Northwind database: ${prompt}`);
        let sqlQuery = result.response.candidates[0].content.parts[0].text;

        console.log("Generated SQL:", sqlQuery);
        sqlQuery = sqlQuery.replace(/^```sql|```$/g, "").trim();

        // Step 2: Execute SQL query in SQL Server
        const pool = await sql.connect(config);
        const dbResult = await pool.request().query(sqlQuery);

        res.json({ query: sqlQuery, results: dbResult.recordset });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));
