const chat = document.getElementById('chat-area');
const input = document.getElementById('user-input');

function quick(text) {
    input.value = text;
    sendMessage();
}

async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addMsg("You: " + text);
    input.value = "";

    try {
        // ✅ FIXED (NO localhost)
        const res = await fetch('/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: text })
        });

        const data = await res.json();
        addMsg("Bot: " + data.answer);

    } catch (e) {
        addMsg("Error connecting to server");
    }
}

function addMsg(msg) {
    const p = document.createElement('p');
    p.innerText = msg;
    chat.appendChild(p);
}