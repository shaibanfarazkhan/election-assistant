const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Environment variable for Gemini API Key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Election Guide Assistant is running",
    timestamp: new Date()
  });
});

// Array of interesting facts to append randomly
const facts = [
    "💡 Did you know? The Election Commission of India was established in 1950.",
    "💡 Did you know? India has over 900 million eligible voters, making it the world's largest democracy.",
    "💡 Did you know? Electronic Voting Machines (EVMs) were first used in Kerala in 1982.",
    "💡 Did you know? NOTA (None of the Above) was introduced as a voting option in 2013.",
    "💡 Did you know? The voting age was lowered from 21 to 18 years in 1989."
];

// Fallback logic when Gemini API is unavailable or disabled
function generateFallbackAnswer(question) {
    const q = question.toLowerCase();
    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    let responseText = "";

    // Simple keyword mapping for intent detection to avoid repeated processing
    if (q.includes('register') || q.includes('voter id') || q.includes('enroll') || q.includes('apply')) {
        responseText = `**How to Register to Vote in India**\n1. Visit the official Voters' Service Portal online (voters.eci.gov.in)\n2. Click on "New Registration for General Electors" (Form 6)\n3. Fill in your personal details carefully (name, DOB, address)\n4. Upload a passport-size photo, valid age proof, and address proof\n5. Submit the form and keep the reference number safe to track it\n6. Once verified by officials, your Voter ID will be issued and mailed\n\n*Tip: Apply at least a few months before an election to ensure your name makes it onto the final voter list!*`;
    }
    else if (q.includes('vote') || q.includes('voting process') || q.includes('booth') || q.includes('how to')) {
        responseText = `**The Voting Process (Election Day)**\n1. Check your name on the voter list online to find your assigned polling booth\n2. Go to the booth carrying a valid ID (Aadhaar, Voter ID, PAN card, etc.)\n3. Show your ID to the first polling officer to verify your identity\n4. The second officer will put a special ink mark on your left index finger\n5. Proceed to the Electronic Voting Machine (EVM) inside the private compartment\n6. Press the blue button next to your chosen candidate's symbol until you hear a beep\n\n*Tip: The indelible ink mark proves you have voted and is a proud symbol of democracy!*`;
    }
    else if (q.includes('timeline') || q.includes('date') || q.includes('schedule') || q.includes('phase')) {
        responseText = `**Understanding the Election Timeline**\n1. Announcement: The Election Commission declares the voting schedule\n2. Nominations: Candidates officially file their papers to run for office\n3. Campaigning: Political parties hold rallies and share their manifestos\n4. Polling: Citizens cast their votes (often in multiple phases across India)\n5. Counting: Votes are counted and the final results are officially declared\n\n*Tip: All public campaigning must strictly stop 48 hours before polling begins!*`;
    }
    else if (q.includes('general') || q.includes('info')) {
        responseText = `**General Election Information**\n1. I can guide you through the voter registration steps\n2. I can explain the exact voting process on election day\n3. I can provide the typical timeline of a general election\n4. All national and state elections are managed by the Election Commission of India (ECI)\n5. Any Indian citizen who is 18 years or older is eligible to vote\n\n*Tip: You can use the quick action buttons below to easily explore these topics!*`;
    }
    // Fallback response for unmatched intent
    else {
        responseText = `**I'm not sure about that!**\nI'm specifically trained to help you with:\n1. Voter Registration\n2. The Voting Process\n3. Election Timelines\n4. General Election Info\n\n*Tip: Please try asking about one of the topics above, or use the quick action buttons!*`;
    }

    return responseText + "\n\n" + randomFact;
}

// Generate smart response using Google Gemini API
async function generateGeminiAnswer(question) {
    if (!GEMINI_API_KEY) return null;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const prompt = `You are a helpful, beginner-friendly Election Guide Assistant for India. 
Please answer the following user question about the Indian election process: "${question}".
Ensure the response is formatted exactly with:
- A bold Title (like **Title**)
- Bullet points or numbered lists for steps
- Simple beginner-friendly language
- A helpful tip at the end starting with "*Tip: ...*"
Keep it concise and clear, no more than 150 words. Do not use markdown headers (# or ##), just bold text for the title.`;

    try {
        // Using global fetch available in Node.js 18+
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) {
            console.warn("Gemini API returned an error status:", await response.text());
            return null; // Fallback will handle it
        }

        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (text) {
            const randomFact = facts[Math.floor(Math.random() * facts.length)];
            return text.trim() + "\n\n" + randomFact;
        }
        return null;
    } catch (error) {
        console.error("Gemini API call failed:", error);
        return null; // Fallback will handle it
    }
}

app.post('/ask', async (req, res) => {
    try {
        let { question } = req.body;

        // Security & Validation: Check empty or missing input
        if (!question || typeof question !== 'string') {
            return res.status(400).json({ answer: "Question is required and must be text" });
        }

        // Security & Validation: Trim input
        question = question.trim();
        
        if (question.length === 0) {
            return res.status(400).json({ answer: "Question cannot be empty" });
        }

        // Security & Validation: Limit question length to 300 chars
        if (question.length > 300) {
            return res.status(400).json({ answer: "Question is too long (max 300 characters)" });
        }

        // Try using Google Gemini API first
        let answer = await generateGeminiAnswer(question);

        // Fallback to local rule-based logic if API fails or key is missing
        if (!answer) {
            answer = generateFallbackAnswer(question);
        }

        res.json({ answer });

    } catch (error) {
        console.error("Error in /ask route:", error);
        res.status(500).json({ answer: "Server error occurred while processing the request" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});