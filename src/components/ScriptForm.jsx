import { useState } from 'react'
import './ScriptForm.css'

const PLATFORMS = ['TikTok', 'Instagram Reels', 'YouTube Shorts']
const DURATIONS = ['15', '30', '60', '90']
const TONES = ['Funny & Entertaining', 'Educational & Informative', 'Inspirational', 'Dramatic & Emotional', 'Controversial & Bold', 'Casual & Authentic']
const HOOKS = ['Question Hook', 'Shocking Fact', 'Bold Statement', 'Story Opening', 'Challenge/Dare', 'Relatability Hook']
const LANGUAGES = ['English', 'Spanish', 'Portuguese', 'French']

export default function ScriptForm({ onGenerate, loading }) {
  const [form, setForm] = useState({
    topic: '',
    platform: 'TikTok',
    duration: '30',
    tone: 'Funny & Entertaining',
    hook: 'Question Hook',
    language: 'English',
  })

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.topic.trim()) return
    onGenerate(form)
  }

  return (
    <form className="script-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <label className="form-label">
          <span className="label-num">01</span>
          WHAT'S YOUR VIDEO ABOUT?
        </label>
        <textarea
          className="form-textarea"
          placeholder="e.g. 5 facts about Mexico City that will blow your mind..."
          value={form.topic}
          onChange={e => set('topic', e.target.value)}
          rows={3}
          required
        />
      </div>

      <div className="form-grid">
        <div className="form-section">
          <label className="form-label">
            <span className="label-num">02</span>
            PLATFORM
          </label>
          <div className="pill-group">
            {PLATFORMS.map(p => (
              <button
                key={p}
                type="button"
                className={`pill ${form.platform === p ? 'active' : ''}`}
                onClick={() => set('platform', p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="form-section">
          <label className="form-label">
            <span className="label-num">03</span>
            DURATION
          </label>
          <div className="pill-group">
            {DURATIONS.map(d => (
              <button
                key={d}
                type="button"
                className={`pill ${form.duration === d ? 'active' : ''}`}
                onClick={() => set('duration', d)}
              >
                {d}s
              </button>
            ))}
          </div>
        </div>

        <div className="form-section">
          <label className="form-label">
            <span className="label-num">04</span>
            TONE
          </label>
          <div className="pill-group">
            {TONES.map(t => (
              <button
                key={t}
                type="button"
                className={`pill ${form.tone === t ? 'active' : ''}`}
                onClick={() => set('tone', t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="form-section">
          <label className="form-label">
            <span className="label-num">05</span>
            HOOK STYLE
          </label>
          <div className="pill-group">
            {HOOKS.map(h => (
              <button
                key={h}
                type="button"
                className={`pill ${form.hook === h ? 'active' : ''}`}
                onClick={() => set('hook', h)}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        <div className="form-section">
          <label className="form-label">
            <span className="label-num">06</span>
            LANGUAGE
          </label>
          <div className="pill-group">
            {LANGUAGES.map(l => (
              <button
                key={l}
                type="button"
                className={`pill ${form.language === l ? 'active' : ''}`}
                onClick={() => set('language', l)}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className={`generate-btn ${loading ? 'loading' : ''}`}
        disabled={loading || !form.topic.trim()}
      >
        {loading ? (
          <>
            <span className="spinner" />
            GENERATING SCRIPT...
          </>
        ) : (
          <>
            <span className="btn-icon">⚡</span>
            GENERATE SCRIPT
          </>
        )}
      </button>
    </form>
  )
}
