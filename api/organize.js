export default async function handler(req, res) {
    // Enable CORS for frontend
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Get the user's text from the request
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const apiKey = process.env.local.CLAUDE_API_KEY;

        if (!apiKey) {
            throw new Error('Claude API key not found.');
        }

        const prompt = `I have ADD and captured these thoughts throughout the day. Please organize them into clear categories:
    
            1. **Widget Development Tasks** - anything related to coding projects or technical work
            2. **Content Ideas** - ideas for YouTube, TikTok, Twitch, or other content
            3. **Calendar/Schedule Items** - things with dates, deadlines, or time-sensitive tasks
            4. **Job Hunt Related** - applications, interview prep, portfolio work, networking
            5. **Miscellaneous Notes** - everything else that doesnt fit above categories
    
            Here are my thoughts:
            ${text}
    
            Please format the response with clear headers and bullet points. Be concise but capture the key points.`;


        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-5-20250929',
                max_tokens: 1024,
                messages: [{
                    role: 'user',
                    content: prompt
                }]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Claude API error: ', error);
            return res.status(response.status).json({
                error: error.error?.message || 'Failed to organize thoughts'
            });
        }

        const data = await response.json();
        const organizedText = data.content[0].text;

        return res.status(200).json({ organizedText });

    } catch (error) {
        console.error('Server error: ', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}