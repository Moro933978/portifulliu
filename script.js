const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const FILE_PATH = "user.json";

// Load messages from JSON file
app.get("/messages", (req, res) => {
    fs.readFile(FILE_PATH, "utf8", (err, data) => {
        if (err) return res.status(500).send("Error reading file");
        res.json(JSON.parse(data));
    });
});

// Save new message to JSON file
app.post("/messages", (req, res) => {
    const { username, message } = req.body;
    if (!username || !message) {
        return res.status(400).send("Username and message are required");
    }

    const timestamp = new Date().toLocaleString();
    const newMessage = { username, message, timestamp };

    fs.readFile(FILE_PATH, "utf8", (err, data) => {
        let messages = [];
        if (!err && data) {
            try {
                messages = JSON.parse(data);
            } catch (error) {
                return res.status(500).send("Error parsing JSON");
            }
        }

        messages.push(newMessage);

        fs.writeFile(FILE_PATH, JSON.stringify(messages, null, 2), (err) => {
            if (err) return res.status(500).send("Error saving message");
            res.status(201).json(newMessage);
        });
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
