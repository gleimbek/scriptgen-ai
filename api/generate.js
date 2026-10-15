// Vercel serverless function: POST /api/generate
//
// The Anthropic API key lives only here, read from the ANTHROPIC_API_KEY
// environment variable on the server. The browser sends the form fields;
// this function validates them, builds the prompt and calls Claude.
//
// Demo mode: with no ANTHROPIC_API_KEY set, or if the AI call fails, the
// function returns a template-based sample script (src/demoScript.js) marked
// with demo: true, so the public site works without spending anything.
import { PLATFORMS, DURATIONS, TONES, HOOKS, LANGUAGES, TOPIC_MAX_LENGTH } from '../src/options.js'
import { buildDemoScript } from '../src/demoScript.js'

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
  let body
  try {
    body = await request.json()
  } catch {
    return json(400, { error: 'Send the form fields as JSON.' })
  }

  const problem = validate(body)
  if (problem) return json(400, { error: problem })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return json(200, buildDemoScript(body))

  try {
    return json(200, await generateWithClaude(apiKey, body))
  } catch (err) {
    // Billing, outage or a malformed answer: log the reason, show the sample instead.
    console.error('AI generation failed, serving demo script:', err.message)
    return json(200, buildDemoScript(body))
  }
}

async function generateWithClaude(apiKey, body) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
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

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(`Anthropic API ${response.status}: ${data?.error?.message || 'no details'}`)
  }

  // Newer models can return thinking blocks before the answer, so pick the text block.
  const text = (data?.content || []).filter(block => block.type === 'text').map(block => block.text).join('')
  const clean = text.replace(/```json|```/g, '').trim()

  try {
    return JSON.parse(clean)
  } catch {
    throw new Error(`Model did not return valid JSON: ${clean.slice(0, 200)}`)
  }
}
