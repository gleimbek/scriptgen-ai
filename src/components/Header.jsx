import './Header.css'

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-left">
          <div className="logo-mark">SG</div>
          <div className="logo-text">
            <span className="logo-title">ScriptGen</span>
            <span className="logo-sub">AI</span>
          </div>
        </div>
        <div className="header-badge">
          <span className="badge-dot" />
          <span>Powered by Claude</span>
        </div>
      </div>
      <div className="hero">
        <div className="hero-label">SHORT VIDEO SCRIPT GENERATOR</div>
        <h1 className="hero-title">
          WRITE VIRAL<br />
          <span className="hero-accent">SCRIPTS</span><br />
          IN SECONDS
        </h1>
        <p className="hero-sub">
          Drop your idea. Get a ready-to-shoot TikTok or Reels script — with hook, structure, caption and viral tips.
        </p>
        <div className="hero-platforms">
          <span>TikTok</span>
          <span>Instagram Reels</span>
          <span>YouTube Shorts</span>
        </div>
      </div>
    </header>
  )
}
