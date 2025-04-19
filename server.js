const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

function isIdentityQuestion(message) {
    const identityKeywords = [
        "qui t’a créé", "qui t'a créé", "qui est ton créateur", "qui t’a développé",
        "par qui as-tu été créé", "par qui as-tu été développé", "qui est derrière toi",
        "qui t’a programmé", "qui t'a codé", "ton développeur", "développé par qui",
        "qui t’a conçu", "qui est ton auteur", "qui a fait cette ia", "créateur de cette ia",
        "développeur du chatbot", "qui est stanley", "c'est toi stanley",
        "t’es fait par stanley", "qui t'a imaginé", "qui est à l’origine de cette ia"
    ];
    return identityKeywords.some(keyword => message.toLowerCase().includes(keyword));
}

app.post("/api/chat", async (req, res) => {
    const userInput = req.body.message;

    if (!userInput) {
        return res.status(400).json({ error: "Message requis." });
    }

    if (isIdentityQuestion(userInput)) {
        const identityResponse = `Je suis une intelligence artificielle développée par Stanley, un développeur passionné par les technologies d'IA.`;
        return res.json({
            response: identityResponse
        });
    }

    try {
        const encodedMessage = encodeURIComponent(userInput);
        const apiUrl = `https://kaiz-apis.gleeze.com/api/you-ai?ask=${encodedMessage}&uid=1`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        const botReply = data.response || "Je n'ai pas compris.";
        const intro = "Je suis une intelligence artificielle développée par Stanley.";
        const fullResponse = `${intro}\n\n${botReply}`;

        res.json({
            response: fullResponse
        });

    } catch (error) {
        console.error("Erreur API:", error);
        res.status(500).json({ error: "Erreur interne." });
    }
});

app.listen(PORT, () => {
    console.log(`API IA en écoute sur http://localhost:${PORT}`);
});
