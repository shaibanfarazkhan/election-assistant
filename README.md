# 🇮🇳 Election Guide Assistant

## 📌 Problem Statement
Create an assistant that helps users understand the election process, timelines, and steps in an interactive and easy-to-follow way.

---

## 🎯 Project Overview
Election Guide Assistant is a lightweight full-stack web application designed to simplify the Indian election process, especially for first-time voters.

The application provides structured, easy-to-understand guidance on:
- Voter Registration
- Voting Process
- Election Timeline

---

## ⚙️ Tech Stack
- **Backend:** Node.js, Express.js  
- **Frontend:** HTML, CSS, Vanilla JavaScript  
- **Deployment:** Render  

---

## 🚀 Key Features
- 🤖 Interactive chat-based assistant  
- 📝 Step-by-step voter registration guidance  
- 🗳️ Clear explanation of voting process  
- 📅 Visual election timeline (UI-based)  
- 💡 Dynamic “Did You Know?” facts  
- ⌨️ Typing animation for better UX  
- 📱 Fully responsive modern UI  

---

## 🧠 Approach & Logic
The system uses a lightweight keyword-based intent detection mechanism.

### Intent Categories:
- Voter Registration  
- Voting Process  
- Election Timeline  
- General Queries  

### Response Structure:
Each response includes:
- Clear Title  
- Step-by-step Instructions  
- Helpful Tips (where applicable)  

---

## 🔄 Application Flow
1. User enters a query or selects a predefined option  
2. Frontend sends a request to `/ask` API  
3. Backend processes the query using intent detection  
4. Structured response is generated  
5. UI renders the response with typing animation  

---

## ⚠️ Assumptions
- Target users are beginners  
- Queries are simple and intent-driven  
- No authentication or personal data required  

---

## ☁️ Google Services Integration
- Designed to be deployable on **Google Cloud Run**  
- Architecture allows easy integration with:
  - Google Gemini API (for future intelligent responses)
  - Firebase (for scalability if extended)

---

## 🧪 Testing
- API endpoints tested using Postman  
- Core flows validated:
  - Registration guidance  
  - Voting process  
  - Timeline explanation  

### Edge Cases Handled:
- Empty inputs  
- Invalid queries  
- Long inputs  
- Network/API failures  

---

## 🔒 Security
- Input validation on both frontend and backend  
- Basic sanitization of user input  
- No storage of user data  
- Safe API response handling  

---

## ⚡ Efficiency
- Lightweight project (<10MB)  
- No heavy frameworks used  
- Optimized request handling  
- Fast load and response time  

---

## ♿ Accessibility
- Semantic HTML structure  
- ARIA labels for input elements  
- Readable UI with proper contrast  
- Mobile responsive design  

---

## 🌐 Live Demo
https://election-assistant-jj6b.onrender.com

---

## 📁 GitHub Repository
https://github.com/shaibanfarazkhan/election-assistant

---

## 👨‍💻 Author
**Shaiban Faraz Khan**  
ISE Student | Full Stack Developer
