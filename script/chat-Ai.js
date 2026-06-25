
document.addEventListener('DOMContentLoaded', () => {

    const chatInput =
        document.getElementById('chatInput');

    const chatMessages =
        document.getElementById('chatMessages');
const sendBtn =
    document.getElementById('sendBtn');

sendBtn.disabled = true;

chatInput.addEventListener('input', () => {

    const text =
        chatInput.value.trim();

    sendBtn.disabled =
        text.length === 0;

});
    if (!chatInput || !chatMessages || !sendBtn) {

        console.error("Chat Elements Not Found");
        return;
    }

    // تكبير الـ textarea تلقائياً
    chatInput.addEventListener('input', function () {

        this.style.height = 'auto';

        this.style.height =
            Math.min(this.scrollHeight, 140) + 'px';
    });

    // إرسال الرسالة عند الضغط على Enter
    chatInput.addEventListener('keydown', async (e) => {

        if (e.key === 'Enter' && !e.shiftKey) {

            e.preventDefault();

            await sendMessage();
        }
    });

    // إرسال عند الضغط على الزر
    sendBtn.addEventListener('click', async () => {

        await sendMessage();
    });

    async function sendMessage() {

        const text = chatInput.value.trim();

        if (!text) return;

        appendMessage(text, 'user');

        chatInput.value = '';
        chatInput.style.height = 'auto';

        sendBtn.disabled = true;

        showTyping();

        try {

            const response = await fetch(
                "https://ataa-charity-platform.vercel.app/ai/chat",
                {
                    method: "POST",

                    headers: {
                        Authorization: localStorage.getItem("token"),
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        message: text
                    })
                }
            );

            const data = await response.json();

            console.log("AI RESPONSE:", data);

            removeTyping();

            const aiMessage =
                data.message ||
                data.reply ||
                data.response ||
                data.data?.message ||
                data.data ||
                "لم يتم استلام رد من المساعد الذكي";

            appendMessage(aiMessage, 'ai');

        } catch (error) {

            console.log("AI ERROR:", error);

            removeTyping();

            appendMessage(
                "حدث خطأ أثناء الاتصال بالمساعد الذكي",
                "ai"
            );
        }

        sendBtn.disabled = false;

        chatInput.focus();
    }

    function appendMessage(text, sender) {

        const div = document.createElement('div');

        div.className = `message ${sender}`;

        div.innerHTML = `
            <div class="message-content">
                ${text}
            </div>
        `;

        chatMessages.appendChild(div);

        scrollToBottom();
    }

    function showTyping() {

        const div = document.createElement('div');

        div.className = 'message ai typing-indicator';

        div.innerHTML = `
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;

        chatMessages.appendChild(div);

        scrollToBottom();
    }

    function removeTyping() {

        const indicator =
            chatMessages.querySelector('.typing-indicator');

        if (indicator) {

            indicator.remove();
        }
    }

    function scrollToBottom() {

        chatMessages.scrollTop =
            chatMessages.scrollHeight;
    }
    const authNeeded =
    document.getElementById("authNeeded");

const chatWelcome =
    document.getElementById("chatWelcome");

const chatInputArea =
    document.getElementById("chatInputArea");

const token =
    localStorage.getItem("token");

if (!token) {

    authNeeded.style.display = "flex";

    chatWelcome.style.display = "none";

    chatInputArea.style.display = "none";

} else {

    authNeeded.style.display = "none";

    chatWelcome.style.display = "block";

    chatInputArea.style.display = "block";
}
});
window.fillSuggestion = function (text) {

    const chatInput =
        document.getElementById("chatInput");

    const sendBtn =
        document.getElementById("sendBtn");

    if (!chatInput) return;

    chatInput.value = text;

    chatInput.dispatchEvent(
        new Event("input")
    );

    // إرسال تلقائي
    if (sendBtn && !sendBtn.disabled) {

        sendBtn.click();
    }
};
