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

    // Intent 1: Voter Registration
    if (q.includes('register') || q.includes('voter id') || q.includes('enroll') || q.includes('apply')) {
        return `**How to Register to Vote in India**
• Step 1: Visit the Voters' Service Portal (voters.eci.gov.in)
• Step 2: Click on "New Registration for General Electors" (Form 6)
• Step 3: Fill in your details (name, DOB, address)
• Step 4: Upload photo, age proof, and address proof
• Step 5: Submit the form and note reference number
• Step 6: After verification, your Voter ID will be issued`;
    }

    // Intent 2: Voting Process
    if (q.includes('vote') || q.includes('voting process') || q.includes('booth')) {
        return `**Voting Process (Election Day)**
• Step 1: Check your name in the voter list
• Step 2: Visit your assigned polling booth
• Step 3: Show a valid ID (Aadhaar / Voter ID / PAN)
• Step 4: Get an ink mark on your left index finger
• Step 5: Use the EVM machine to cast your vote
• Step 6: Confirm your vote when you hear the beep sound`;
    }

    // Intent 3: Election Timeline
    if (q.includes('timeline') || q.includes('date') || q.includes('schedule') || q.includes('phase')) {
        return `**Election Timeline**
• Phase 1: Announcement of election dates
• Phase 2: Nomination filing by candidates
• Phase 3: Campaigning period (stops 48 hours before voting)
• Phase 4: Polling (voting days across regions)
• Phase 5: Counting of votes and final results`;
    }

    // Default response (Intent 4: General Info)
    return `**General Election Information**
• I can help you with voter registration steps
• I can explain the voting process
• I can provide the election timeline
• Elections are conducted by the Election Commission of India (ECI)
• Any citizen 18+ can vote!`;
}

app.post('/ask', (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ error: "Question is required" });
        }

        const answer = generateAnswer(question);

        // Minimal delay just for realism, typing effect handles the rest
        setTimeout(() => {
            res.json({ answer });
        }, 500);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});