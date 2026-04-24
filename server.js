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
    
    // Array of interesting facts to append randomly
    const facts = [
        "💡 Did you know? The Election Commission of India was established in 1950.",
        "💡 Did you know? India has over 900 million eligible voters, making it the world's largest democracy.",
        "💡 Did you know? Electronic Voting Machines (EVMs) were first used in Kerala in 1982.",
        "💡 Did you know? NOTA (None of the Above) was introduced as a voting option in 2013.",
        "💡 Did you know? The voting age was lowered from 21 to 18 years in 1989."
    ];
    
    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    let responseText = "";

    // Intent 1: Voter Registration
    if (q.includes('register') || q.includes('voter id') || q.includes('enroll') || q.includes('apply')) {
        responseText = `**How to Register to Vote in India**
1. Visit the official Voters' Service Portal online (voters.eci.gov.in)
2. Click on "New Registration for General Electors" (Form 6)
3. Fill in your personal details carefully (name, DOB, address)
4. Upload a passport-size photo, valid age proof, and address proof
5. Submit the form and keep the reference number safe to track it
6. Once verified by officials, your Voter ID will be issued and mailed

*Tip: Apply at least a few months before an election to ensure your name makes it onto the final voter list!*`;
    }

    // Intent 2: Voting Process
    else if (q.includes('vote') || q.includes('voting process') || q.includes('booth') || q.includes('how to')) {
        responseText = `**The Voting Process (Election Day)**
1. Check your name on the voter list online to find your assigned polling booth
2. Go to the booth carrying a valid ID (Aadhaar, Voter ID, PAN card, etc.)
3. Show your ID to the first polling officer to verify your identity
4. The second officer will put a special ink mark on your left index finger
5. Proceed to the Electronic Voting Machine (EVM) inside the private compartment
6. Press the blue button next to your chosen candidate's symbol until you hear a beep

*Tip: The indelible ink mark proves you have voted and is a proud symbol of democracy!*`;
    }

    // Intent 3: Election Timeline
    else if (q.includes('timeline') || q.includes('date') || q.includes('schedule') || q.includes('phase')) {
        responseText = `**Understanding the Election Timeline**
1. Announcement: The Election Commission declares the voting schedule
2. Nominations: Candidates officially file their papers to run for office
3. Campaigning: Political parties hold rallies and share their manifestos
4. Polling: Citizens cast their votes (often in multiple phases across India)
5. Counting: Votes are counted and the final results are officially declared

*Tip: All public campaigning must strictly stop 48 hours before polling begins!*`;
    }

    // Default response (Intent 4: General Info)
    else {
        responseText = `**General Election Information**
1. I can guide you through the voter registration steps
2. I can explain the exact voting process on election day
3. I can provide the typical timeline of a general election
4. All national and state elections are managed by the Election Commission of India (ECI)
5. Any Indian citizen who is 18 years or older is eligible to vote

*Tip: You can use the quick action buttons below to easily explore these topics!*`;
    }

    // Combine structured response with a random fact
    return responseText + "\n\n" + randomFact;
}

app.post('/ask', (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ error: "Question is required" });
        }

        const answer = generateAnswer(question);

        // Minimal delay just for realism, front-end typing effect handles the rest
        setTimeout(() => {
            res.json({ answer });
        }, 400);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});