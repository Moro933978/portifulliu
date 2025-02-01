document.addEventListener("DOMContentLoaded", loadMessages);

async function sendMessage() {
    let username = document.getElementById("username").value;
    let message = document.getElementById("message").value;
    
    if (username && message) {
        let newMessage = { username, message };
        
        try {
            let response = await fetch("http://localhost:3000/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newMessage)
            });
            
            if (response.ok) {
                loadMessages();
                document.getElementById("message").value = "";
            } else {
                alert("Error sending message");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    } else {
        alert("Please enter both name and message!");
    }
}

async function loadMessages() {
    try {
        let response = await fetch("http://localhost:3000/messages");
        let messages = await response.json();
        
        let chatBox = document.getElementById("chat");
        chatBox.innerHTML = "";
        
        messages.forEach(msg => {
            let newMessage = document.createElement("p");
            newMessage.textContent = `${msg.timestamp} - ${msg.username}: ${msg.message}`;
            chatBox.appendChild(newMessage);
        });
    } catch (error) {
        console.error("Error:", error);
    }
}

async function clearMessages() {
    let username = document.getElementById("username").value;
    if (!username) {
        alert("Please enter your name to delete your messages.");
        return;
    }

    try {
        let response = await fetch("http://localhost:3000/messages");
        let messages = await response.json();

        let filteredMessages = messages.filter(msg => msg.username !== username);

        // Send filtered messages back to server (overwrite file)
        await fetch("http://localhost:3000/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(filteredMessages)
        });

        loadMessages();
    } catch (error) {
        console.error("Error:", error);
    }
}