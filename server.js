const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function generateAnswer(question) {
    const q = question.toLowerCase();

    // Intent 1: Voter Registration
    if (q.includes('register') || q.includes('voter id') || q.includes('enroll') || q.includes('apply')) {
        return `📝 How to Register to Vote in India:

Here is a simple step-by-step guide:

• Step 1: Visit the Voters' Service Portal (voters.eci.gov.in)
• Step 2: Click on "New Registration for General Electors" (Form 6)
• Step 3: Fill in your details (name, DOB, address)
• Step 4: Upload photo, age proof, and address proof
• Step 5: Submit the form and note reference number
• Step 6: After verification, your Voter ID will be issued

👉 Tip: Apply early before elections`;
    }

    // Intent 2: Voting Process
    if (q.includes('voting process') || q.includes('how to vote') || q.includes('booth') || q.includes('vote')) {
        return `🗳️ Voting Process (Election Day):

Follow these simple steps:

• Step 1: Check your name in voter list
• Step 2: Visit your polling booth
• Step 3: Show valid ID (Aadhaar / Voter ID / PAN)
• Step 4: Get ink mark on your finger
• Step 5: Use EVM machine to vote
• Step 6: Confirm your vote (beep sound)

👉 Tip: Carry valid ID proof`;
    }

    // Intent 3: Election Timeline
    if (q.includes('timeline') || q.includes('date') || q.includes('schedule') || q.includes('when') || q.includes('phase')) {
        return `📅 Election Timeline:

Indian elections follow these phases:

• Phase 1: Announcement of election dates
• Phase 2: Nomination filing by candidates
• Phase 3: Campaigning period
• Phase 4: Polling (voting days)
• Phase 5: Counting and results

👉 Tip: Follow news for exact dates`;
    }

    // Intent 4: General Info
    if (q.includes('what is') || q.includes('election commission') || q.includes('general election') || q.includes('mla') || q.includes('mp')) {
        return `📘 General Election Information:

• Conducted by Election Commission of India (ECI)
• National elections every 5 years
• State elections choose MLAs
• Eligible voters: 18+ citizens

👉 Elections ensure democracy`;
    }

    // Default response
    return `🤖 Election Guide Assistant:

I can help you with:

• Voter registration
• Voting process
• Election timeline
• General election questions

👉 Try asking: "How to register to vote"`;
}

app.post('/ask', (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ error: "Question is required" });
        }

        const answer = generateAnswer(question);

        setTimeout(() => {
            res.json({ answer });
        }, 500);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});