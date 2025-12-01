// Vercel Serverless Function for OpenAI API calls
// This keeps your API key secret on the server

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query, exercisesSummary, themes, numResults } = req.body;

    // Validate input
    if (!query || !exercisesSummary || !numResults) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get API key from environment variable
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    // Build prompt
    const prompt = `You are a facilitation expert. A user needs help finding the right exercises for their situation.

User's request: "${query}"

Available themes: ${themes.join(', ')}

Here are the available exercises (${exercisesSummary.length} total). Each has a title, tags, and preview:

${JSON.stringify(exercisesSummary.slice(0, 100), null, 2)}

Please analyze the user's request and return the ${numResults} most relevant exercise IDs that would best match their needs. Consider:
1. The specific problem or goal they're trying to address
2. The themes/tags that align with their needs
3. The context (team size, setting, etc.) if mentioned

Return a JSON object with a "matches" key containing an array of exercises:
{
  "matches": [
    {
      "id": <exercise_id>,
      "relevance_score": <0-100>,
      "reason": "<brief explanation of why this is a good match>",
      "estimated_time": "<estimate like '15-20 min' or '45-60 min'>"
    }
  ]
}

Base the estimated time on the exercise description and complexity.`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful facilitation expert. Always respond with valid JSON only. Do not include markdown formatting, explanations, or any text outside the JSON object.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API request failed');
    }

    const data = await response.json();
    let content = data.choices[0].message.content;

    // Extract JSON from markdown code blocks if present
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      content = jsonMatch[1];
    }

    // Clean up and parse
    content = content.trim();
    const parsed = JSON.parse(content);

    // Extract matches array from response
    let matches;
    if (Array.isArray(parsed)) {
      matches = parsed;
    } else if (parsed.matches && Array.isArray(parsed.matches)) {
      matches = parsed.matches;
    } else if (parsed.results && Array.isArray(parsed.results)) {
      matches = parsed.results;
    } else {
      throw new Error('AI response was not in the expected format');
    }

    // Return matches
    return res.status(200).json({ matches });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: error.message || 'An error occurred while processing your request'
    });
  }
}
