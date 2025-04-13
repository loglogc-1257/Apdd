const express = require("express");
const fetch = require("node-fetch");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

app.use(express.json());

function isDateQuestion(message) {
    const keywords = [
        "quelle est la date",
        "quel jour sommes-nous",
        "quelle date sommes-nous",
        "c'est quoi la date",
        "donne-moi la date",
        "on est quel jour",
        "today's date",
        "what's the date",
        "quelle année sommes-nous"
    ];
    return keywords.some(keyword => message.toLowerCase().includes(keyword));
}

function isIdentityQuestion(message) {
    const identityKeywords = [
        "qui t’a créé", "qui t'a créé", "qui est ton créateur", "qui t’a développé",
        "par qui as-tu été créé", "par qui as-tu été développé", "qui est derrière toi",
        "qui t’a programmé", "qui t'a codé", "ton développeur", "développé par qui",
        "qui t’a conçu", "qui est ton auteur", "qui a fait cette ia", "créateur de cette ia",
        "développeur du chatbot", "qui est messie osango", "c'est toi messie osango",
        "t’es fait par messie", "qui t'a imaginé", "qui est à l’origine de cette ia"
    ];
    return identityKeywords.some(keyword => message.toLowerCase().includes(keyword));
}

function getFormattedDate() {
    const now = new Date();
    return now.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

app.post("/api/chat", async (req, res) => {
    const userInput = req.body.message;
    const currentYear = new Date().getFullYear();

    if (!userInput) {
        return res.status(400).json({ error: "Message requis." });
    }

    if (isDateQuestion(userInput)) {
        const dateResponse = `Nous sommes le ${getFormattedDate()}.`;
        const fullResponse = `Je suis un modèle linguistique développé par MESSIE Osango. Je réponds à vos questions.\n\n${dateResponse}`;
        return res.json({
            response: fullResponse,
            year: currentYear
        });
    }

    if (isIdentityQuestion(userInput)) {
        const identityResponse = `Je suis un modèle linguistique développé par MESSIE Osango, ingénieur en intelligence artificielle. Je suis conçu pour répondre à vos questions de manière intelligente et personnalisée.`;
        return res.json({
            response: identityResponse,
            year: currentYear
        });
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userInput }] }]
            }),
        });

        const data = await response.json();
        const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Je n'ai pas compris.";
        const intro = "Je suis un modèle linguistique développé par MESSIE Osango. Je réponds à vos questions.";
        const fullResponse = `${intro}\n\n${botReply}`;

        res.json({
            response: fullResponse,
            year: currentYear
        });

    } catch (error) {
        console.error("Erreur API:", error);
        res.status(500).json({ error: "Erreur interne." });
    }
});

app.listen(PORT, () => {
    console.log(`API IA en écoute sur http://localhost:${PORT}`);
});
