import { useState } from "react";
import "./App.css";

const WEBHOOK_URL = "https://n8n-kvbeqesulcin.budi.sumopod.my.id/webhook/yt-transcript";

function isValidYouTubeUrl(url) {
  return /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/.test(url);
}

export default function App() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValidYouTubeUrl(url)) {
      setErrorMsg("URL YouTube tidak valid. Contoh: https://www.youtube.com/watch?v=xxxxx");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setResult(null);
    setErrorMsg("");

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ youtube_url: url }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.error || "Terjadi kesalahan di server.");
      }

      setResult(data);
      setStatus("success");
    } catch (err) {
      setErrorMsg(err.message || "Gagal terhubung ke server.");
      setStatus("error");
    }
  }

  function reset() {
    setUrl("");
    setStatus("idle");
    setResult(null);
    setErrorMsg("");
  }

  return (
    <div className="app">
      <div className="noise" />

      <header className="header">
        <div className="logo">
          <span className="logo-icon">▶</span>
          <span className="logo-text">YT<em>Script</em></span>
        </div>
        <p className="tagline">Ambil transcript YouTube. Simpan ke Drive. Otomatis.</p>
      </header>

      <main className="main">
        {status === "idle" && (
          <form className="form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="label">YouTube URL</label>
              <div className="input-wrap">
                <span className="input-prefix">🔗</span>
                <input
                  type="text"
                  className="input"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            <button type="submit" className="btn-submit">
              <span>Ambil Transcript</span>
              <span className="btn-arrow">→</span>
            </button>
          </form>
        )}

        {status === "loading" && (
          <div className="state-box loading-box">
            <div className="spinner" />
            <p className="state-title">Memproses...</p>
            <p className="state-sub">Mengambil transcript & menyimpan ke Google Drive</p>
            <div className="progress-steps">
              {["Fetch metadata", "Ambil transcript", "Format markdown", "Simpan ke Drive"].map(
                (step, i) => (
                  <div key={i} className="step" style={{ animationDelay: `${i * 0.6}s` }}>
                    <span className="step-dot" />
                    <span>{step}</span>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {status === "success" && result && (
          <div className="state-box success-box">
            <div className="success-icon">✓</div>
            <p className="state-title">Transcript Tersimpan</p>
            <div className="result-card">
              <div className="result-row">
                <span className="result-label">Judul</span>
                <span className="result-value">{result.title}</span>
              </div>
              <div className="result-row">
                <span className="result-label">Bahasa</span>
                <span className="result-value">{result.language}</span>
              </div>
              <div className="result-row">
                <span className="result-label">Segmen</span>
                <span className="result-value">{result.line_count} baris</span>
              </div>
              <div className="result-row">
                <span className="result-label">File</span>
                <span className="result-value filename">{result.filename}</span>
              </div>
              {result.drive_url && (
                <div className="result-row">
                  <span className="result-label">Drive</span>
                  <a
                    className="result-value result-link"
                    href={result.drive_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Buka file →
                  </a>
                </div>
              )}
            </div>
            <button className="btn-reset" onClick={reset}>
              + Transcript Baru
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="state-box error-box">
            <div className="error-icon">✕</div>
            <p className="state-title">Terjadi Kesalahan</p>
            <p className="state-sub">{errorMsg}</p>
            <button className="btn-reset" onClick={reset}>
              Coba Lagi
            </button>
          </div>
        )}
      </main>

      <footer className="footer">
        Powered by <strong>Fadli Digital</strong> × n8n × Supadata
      </footer>
    </div>
  );
}
