const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function generateAnswer(question) {
    const q = question.toLowerCase();

    if (q.includes('register')) {
        return `How to Register:

- Go to voters.eci.gov.in
- Fill Form 6
- Submit details`;
    }

    if (q.includes('vote')) {
        return `Voting Process:

- Go to booth
- Show ID
- Vote using EVM`;
    }

    if (q.includes('timeline')) {
        return `Election Timeline:

- Announcement
- Nomination
- Campaign
- Voting
- Results`;
    }

    return "Ask about register, vote, or timeline.";
}

app.post('/ask', (req, res) => {
    const { question } = req.body;
    res.json({ answer: generateAnswer(question) });
});

app.listen(PORT, () => {
    console.log("Server running...");
});