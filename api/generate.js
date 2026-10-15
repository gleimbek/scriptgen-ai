// Vercel serverless function: POST /api/generate
//
// The Anthropic API key lives only here, read from the ANTHROPIC_API_KEY
// environment variable on the server. The browser sends the form fields;
// this function validates them, builds the prompt and calls Claude.
import { PLATFORMS, DURATIONS, TONES, HOOKS, LANGUAGES, TOPIC_MAX_LENGTH } from '../src/options.js'

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5-5'

const DURATION_TEXT = {
  '15': '15 seconds (approx 35-40 words spoken)',
  '30': '30 seconds (approx 70-80 words spoken)',
  '60': '60 seconds (approx 140-160 words spoken)',
  '90': '90 seconds (approx 200-220 words spoken)',
}

const SYSTEM_PROMPT =
  'You are an expert short-form video scriptwriter specializing in viral TikTok and Instagram Reels content. ' +
  'Always respond with a valid JSON object and nothing else. No markdown, no backticks, just pure JSON.'

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function validate(body) {
  if (!body || typeof body !== 'object') return 'Send the form fields as JSON.'
  const topic = typeof body.topic === 'string' ? body.topic.trim() : ''
  if (!topic) return 'Write a topic for the video.'
  if (topic.length > TOPIC_MAX_LENGTH) return `Keep the topic under ${TOPIC_MAX_LENGTH} characters.`
  if (!PLATFORMS.includes(body.platform)) return 'Choose a platform from the list.'
  if (!DURATIONS.includes(String(body.duration))) return 'Choose a duration from the list.'
  if (!TONES.includes(body.tone)) return 'Choose a tone from the list.'
  if (!HOOKS.includes(body.hook)) return 'Choose a hook style from the list.'
  if (!LANGUAGES.includes(body.language)) return 'Choose a language from the list.'
  return null
}

function buildUserPrompt({ topic, platform, duration, tone, hook, language }) {
  const contentSeconds = Math.max(5, parseInt(duration, 10) - 15)
  return `Write a short video script.
Topic: ${topic.trim()}
Platform: ${platform}
Duration: ${DURATION_TEXT[String(duration)]}
Tone: ${tone}
Hook style: ${hook}
Language: ${language}

Return ONLY this JSON structure:
{
  "hook": "opening line to stop the scroll",
  "sections": [
    { "label": "HOOK", "text": "...", "seconds": 3 },
    { "label": "SETUP", "text": "...", "seconds": 8 },
    { "label": "CONTENT", "text": "...", "seconds": ${contentSeconds} },
    { "label": "CTA", "text": "...", "seconds": 4 }
  ],
  "fullScript": "complete script as one text",
  "caption": "caption with hashtags",
  "tips": ["tip1", "tip2", "tip3"],
  "estimatedViralScore": 85,
  "viralReason": "why this will perform well"
}`
}

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY is not set')
    return json(500, { error: 'The server is missing its API key. Add ANTHROPIC_API_KEY in the Vercel project settings.' })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return json(400, { error: 'Send the form fields as JSON.' })
  }

  const problem = validate(body)
  if (problem) return json(400, { error: problem })

  let response
  try {
    response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 4000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: buildUserPrompt(body) }],
      }),
    })
  } catch (err) {
    console.error('Could not reach the Anthropic API:', err)
    return json(502, { error: 'Could not reach the AI service. Try again in a moment.' })
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    console.error('Anthropic API error:', response.status, data)
    const reason = typeof data?.error?.message === 'string' ? `: ${data.error.message}` : '.'
    return json(502, { error: `The AI service returned an error (${response.status})${reason}` })
  }

  // Newer models can return thinking blocks before the answer, so pick the text block.
  const text = (data?.content || []).filter(block => block.type === 'text').map(block => block.text).join('')
  const clean = text.replace(/```json|```/g, '').trim()

  try {
    return json(200, JSON.parse(clean))
  } catch {
    console.error('Model did not return valid JSON:', clean.slice(0, 500))
    return json(502, { error: 'The script came back in an unexpected format. Generate it again.' })
  }
}
