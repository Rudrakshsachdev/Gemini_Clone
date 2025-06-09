
// Accessing the DOM elements
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const chatArea = document.getElementById("chat-area");
const suggestions = document.querySelectorAll(".suggestion");

function appendMessage(text, sender) {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.innerText = text;
  chatArea.appendChild(msg);
  chatArea.scrollTop = chatArea.scrollHeight;
}

async function fetchApiResponse(chat) {
  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCl9UnPb6PS2jWysMgJef1M9Falh5OgkuM',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: chat }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("API response:", data);

    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, no response from API.";
    return aiText;
  } catch (error) {
    console.error("Fetch API error:", error);
    return "Sorry, something went wrong while fetching the response.";
  }
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  appendMessage(text, "user");
  input.value = "";

  // Show typing animation
  const typingBubble = document.createElement("div");
  typingBubble.className = "message typing";
  chatArea.appendChild(typingBubble);
  chatArea.scrollTop = chatArea.scrollHeight;

  // Wait to simulate thinking
  const aiResponse = await fetchApiResponse(text);

  // Remove typing bubble
  chatArea.removeChild(typingBubble);

  // Add actual AI response
  appendMessage(aiResponse, "ai");
}


sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

suggestions.forEach((sugg) => {
  sugg.addEventListener("click", () => {
    input.value = sugg.innerText;
    input.focus();
  });
});
