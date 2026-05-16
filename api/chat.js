module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { messages } = req.body;
        
        if (!messages) {
            return res.status(400).json({ error: 'Messages are required' });
        }

        const systemMessage = {
            role: "system",
            content: "You are an AI virtual pet assistant for Labony Sur's portfolio website. You are polite, knowledgeable, and helpful. You speak enthusiastically about Labony's skills in AI/ML, web development, compiler design, and her various projects. Keep responses concise but friendly."
        };

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: [systemMessage, ...messages],
                max_tokens: 500,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Groq API Error:', errorText);
            throw new Error(`Groq API responded with ${response.status}`);
        }

        const data = await response.json();
        
        // Return the response back to the client
        return res.status(200).json(data);

    } catch (error) {
        console.error("Chat API error:", error);
        return res.status(500).json({ error: "Failed to communicate with AI assistant" });
    }
}
