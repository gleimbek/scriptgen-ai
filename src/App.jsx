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

    try {
      // The prompt and the API key live on the server (api/generate.js).
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        setError(data?.error || `Something went wrong (${response.status}). Try again.`)
        return
      }

      setScript(data)
    } catch (err) {
      setError('Could not reach the server. Check your connection and try again.')
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