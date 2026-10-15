import { useState } from 'react'
import './ScriptOutput.css'

function SkeletonLoader() {
  return (
    <div className="skeleton-wrap">
      <div className="skeleton-header">
        <div className="sk-block sk-title" />
        <div className="sk-block sk-badge" />
      </div>
      <div className="sk-block sk-line" />
      <div className="sk-block sk-line short" />
      <div className="sk-sections">
        {[1,2,3,4].map(i => (
          <div key={i} className="sk-section">
            <div className="sk-block sk-label" />
            <div className="sk-block sk-text" />
            <div className="sk-block sk-text short" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ScriptOutput({ script, loading }) {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('sections')

  const copyScript = () => {
    if (!script) return
    navigator.clipboard.writeText(script.fullScript)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const copyCaption = () => {
    if (!script) return
    navigator.clipboard.writeText(script.caption)
  }

  if (loading) return (
    <div className="output-wrap">
      <SkeletonLoader />
    </div>
  )

  if (!script) return null

  const score = script.estimatedViralScore || 80
  const scoreColor = score >= 80 ? '#00e676' : score >= 60 ? '#ffcc00' : '#ff3c00'

  return (
    <div className="output-wrap" style={{ animation: 'slide-up 0.5s ease forwards' }}>

      {/* Top bar */}
      <div className="output-topbar">
        <div className="output-title">
          <span className="out-label">{script.demo ? 'SAMPLE SCRIPT' : 'GENERATED SCRIPT'}</span>
        </div>
        {!script.demo && (
          <div className="viral-score" style={{ '--score-color': scoreColor }}>
            <span className="score-num">{score}</span>
            <span className="score-label">VIRAL SCORE</span>
          </div>
        )}
      </div>

      {script.demo && (
        <p className="demo-note" role="note">
          Demo mode: this sample is built from a template using your topic. Live AI generation is turned off on this site.
          To run it with Claude, clone the <a href="https://github.com/gleimbek/scriptgen-ai" target="_blank" rel="noreferrer">repo</a> and add your own API key.
        </p>
      )}

      {/* Hook highlight */}
      <div className="hook-banner">
        <div className="hook-tag">⚡ HOOK</div>
        <p className="hook-text">"{script.hook}"</p>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'sections' ? 'active' : ''}`}
          onClick={() => setActiveTab('sections')}
        >
          BREAKDOWN
        </button>
        <button
          className={`tab ${activeTab === 'full' ? 'active' : ''}`}
          onClick={() => setActiveTab('full')}
        >
          FULL SCRIPT
        </button>
        <button
          className={`tab ${activeTab === 'tips' ? 'active' : ''}`}
          onClick={() => setActiveTab('tips')}
        >
          TIPS
        </button>
      </div>

      {/* Tab content */}
      {activeTab === 'sections' && (
        <div className="sections-grid">
          {script.sections?.map((sec, i) => (
            <div key={i} className="section-card">
              <div className="section-header">
                <span className="section-label">{sec.label}</span>
                <span className="section-time">{sec.seconds}s</span>
              </div>
              <p className="section-text">{sec.text}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'full' && (
        <div className="full-script">
          <p>{script.fullScript}</p>
          <button className="copy-btn" onClick={copyScript}>
            {copied ? '✓ COPIED!' : 'COPY SCRIPT'}
          </button>
        </div>
      )}

      {activeTab === 'tips' && (
        <div className="tips-section">
          <div className="viral-reason">
            <span className="tips-icon">🎯</span>
            <p>{script.viralReason}</p>
          </div>
          <ul className="tips-list">
            {script.tips?.map((tip, i) => (
              <li key={i} className="tip-item">
                <span className="tip-num">0{i+1}</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Caption */}
      <div className="caption-section">
        <div className="caption-header">
          <span className="out-label">SUGGESTED CAPTION</span>
          <button className="copy-btn-sm" onClick={copyCaption}>COPY</button>
        </div>
        <p className="caption-text">{script.caption}</p>
      </div>

    </div>
  )
}
