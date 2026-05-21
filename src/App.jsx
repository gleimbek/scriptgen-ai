import { useState } from 'react'
import Header from './components/Header.jsx'
import ScriptForm from './components/ScriptForm.jsx'
import ScriptOutput from './components/ScriptOutput.jsx'
import './App.css'

export default function App() {
  const [script, setScript] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const generateScript = async (formData) => {
    setLoading(true)
    setError(null)
    setScript(null)

    const { topic, platform, duration, tone, hook, language } = formData

    const durationMap = {
      '15': '15 seconds (approx 35-40 words spoken)',
      '30': '30 seconds (approx 70-80 words spoken)',
      '60': '60 seconds (approx 140-160 words spoken)',
      '90': '90 seconds (approx 200-220 words spoken)',
    }

    const contentSeconds = Math.max(5, parseInt(duration) - 15)

    const systemPrompt = `You are an expert short-form video scriptwriter specializing in viral TikTok and Instagram Reels content. Always respond with a valid JSON object and nothing else. No markdown, no backticks, just pure JSON.`

    const userPrompt = `Write a short video script.
Topic: ${topic}
Platform: ${platform}
Duration: ${durationMap[duration]}
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

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1500,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
        }),
      })

      if (!response.ok) {
        const errData = await response.json()
        console.error('API Error:', errData)
        setError(`API Error: ${errData.error?.message || response.status}`)
        return
      }

      const data = await response.json()
      const raw = data.content?.[0]?.text || ''
      const clean = raw.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
      setScript(parsed)
    } catch (err) {
      setError('Failed to generate script. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <Header />
      <main className="main">
        <ScriptForm onGenerate={generateScript} loading={loading} />
        {error && <div className="error-msg">{error}</div>}
        {(loading || script) && (
          <ScriptOutput script={script} loading={loading} />
        )}
      </main>
      <footer className="footer">
        <span>ScriptGen AI</span>
        <span>Built with React + Claude API</span>
        <a href="https://github.com/gleimbek/scriptgen-ai" target="_blank" rel="noreferrer">GitHub ↗</a>
      </footer>
    </div>
  )
}