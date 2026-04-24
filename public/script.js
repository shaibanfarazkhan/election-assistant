async function sendMessage() {
    const input = document.getElementById("user-input");
    const text = input.value;

    if (!text) return;

    const chat = document.getElementById("chat-area");

    const userMsg = document.createElement("div");
    userMsg.innerText = "You: " + text;
    chat.appendChild(userMsg);

    input.value = "";

    const res = await fetch("/ask", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ question: text })
    });

    const data = await res.json();

    const botMsg = document.createElement("div");
    botMsg.innerText = "Bot: " + data.answer;
    chat.appendChild(botMsg);
}