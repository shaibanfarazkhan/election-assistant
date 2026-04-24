const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// ✅ IMPORTANT for Render
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ✅ FIXED static path
app.use(express.static('public'));

// ===== AI Logic =====
function generateAnswer(question) {
    const q = question.toLowerCase();

    if (q.includes('register') || q.includes('voter id')) {
        return `📝 How to Register:

1. Go to voters.eci.gov.in
2. Fill Form 6
3. Upload documents
4. Submit

✔ You will get your voter ID after verification`;
    }

    if (q.includes('vote')) {
        return `🗳️ Voting Process:

1. Go to polling booth
2. Show ID
3. Ink mark
4. Use EVM

✔ Done!`;
    }

    if (q.includes('timeline')) {
        return `📅 Election Timeline:

1. Announcement
2. Nominations
3. Campaign
4. Voting
5. Results`;
    }

    return `🤖 Ask me about:
• Registration
• Voting
• Timeline`;
}

// ===== API =====
app.post('/ask', (req, res) => {
    const { question } = req.body;

    if (!question) {
        return res.status(400).json({ error: "Question required" });
    }

    const answer = generateAnswer(question);
    res.json({ answer });
});

// ===== START =====
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});