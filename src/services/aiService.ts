export async function requestAIFeedback(
  messages: { role: 'system' | 'user'; content: string }[],
  config: { apiKey: string; model?: string }
): Promise<string> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model ?? 'openai/gpt-4.1-mini',
      messages,
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`AI request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
