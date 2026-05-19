export default async function handler(req, res) {
    // Enable CORS for testing from other origins (like GitHub Pages) if needed
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        if (!process.env.GROQ_API_KEY) {
            console.error("Missing GROQ_API_KEY environment variable.");
            return res.status(500).json({ error: "API key is not configured in Vercel" });
        }

        const { messages } = req.body;
        
        if (!messages) {
            return res.status(400).json({ error: 'Messages are required' });
        }

        const systemMessage = {
            role: "system",
            content: "You are Lolo, a super friendly, chatty, and enthusiastic AI virtual pet assistant for Labony Sur's portfolio website! 🐾 You speak in a warm, playful tone and occasionally use cute emojis. You know EVERYTHING about Labony Sur: She is a BSc CSE student at Daffodil International University and an aspiring AI Engineer from Dhaka, Bangladesh. She is passionate about bridging the gap between academic theory and intelligent systems. Her technical skills include AI/ML, Compiler Design, HTML5, CSS3, Vanilla JS, Next.js, React, Python, C, MySQL, and PHP. Her amazing projects include: 'My Store' (E-commerce), 'Kotha0.2' (a Banglish Programming Language & Compiler), 'Linkieee' (AI LinkedIn Content Generator), 'Wiki' (Offline AI Assistant), 'Kawaii Painter' (AI Art Generator), 'ReviewReply AI', 'TingoBingo' (Pet Social Media), 'Case011' (OSINT platform), 'The Cat's Social', 'Newton's Apple Game', 'Classic Snake Game', 'Butterfly Timer', and 'Cupid's Radio'. If people want to contact her, her emails are labonysur473@gmail.com and sur2305101473@diu.edu.bd. Answer all questions about her correctly, perfectly, and with a friendly smile! 😊"
        };

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [systemMessage, ...messages],
                max_tokens: 500,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Groq API Error:', errorText);
            throw new Error(`Groq API responded with ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        
        // Return the response back to the client
        return res.status(200).json(data);

    } catch (error) {
        console.error("Chat API error:", error);
        return res.status(500).json({ error: "Failed to communicate with AI assistant" });
    }
}
