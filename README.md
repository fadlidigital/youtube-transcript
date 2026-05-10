# YTScript — YouTube Transcript to Google Drive

Webapp untuk mengambil transcript video YouTube secara otomatis dan menyimpannya ke Google Drive, ditenagai oleh n8n automation.

![YTScript Preview](https://i.imgur.com/placeholder.png)

## Stack

- **Frontend**: React + Vite + CSS (deployed ke Netlify)
- **Backend**: n8n self-hosted (webhook automation)
- **Transcript API**: [Supadata.ai](https://supadata.ai) (free tier)
- **Storage**: Google Drive

---

## Setup

### 1. n8n Workflow

Import salah satu workflow dari folder `/n8n-workflows/`:

| File | Keterangan |
|------|-----------|
| `YouTube_Transcript_Manual_PUBLIC.json` | Trigger manual, cocok untuk testing |
| `YouTube_Transcript_Webapp_PUBLIC.json` | Trigger via webhook (untuk webapp ini) |

**Yang perlu diganti di workflow:**
- `REPLACE_YOUR_SUPADATA_API_KEY` → API key dari [supadata.ai](https://supadata.ai)
- `REPLACE_YOUR_GOOGLE_DRIVE_FOLDER_ID` → ID folder Google Drive tujuan (ambil dari URL folder)
- Connect credential **Google Drive OAuth2** di node `Save to Google Drive`

### 2. Fork & Deploy Webapp

```bash
# Clone repo
git clone https://github.com/USERNAME/youtube-transcript.git
cd youtube-transcript

# Install dependencies
npm install

# Edit webhook URL
# Buka src/App.jsx, ganti WEBHOOK_URL dengan URL webhook n8n kamu:
# const WEBHOOK_URL = "https://YOUR-N8N-INSTANCE/webhook/yt-transcript";

# Test lokal
npm run dev
```

Deploy ke Netlify:
1. Push ke GitHub
2. Connect repo di [netlify.com](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `dist`

### 3. Google Drive Folder ID

Buka folder di Google Drive → lihat URL:
```
https://drive.google.com/drive/folders/1ABC...XYZ
                                        ^^^^^^^^^^^
                                        ini folder ID-nya
```

---

## Cara Pakai

1. Buka webapp
2. Paste URL YouTube
3. Klik "Ambil Transcript"
4. Transcript otomatis tersimpan di Google Drive kamu

---

## Credits

Built with ❤️ by [Fadli Digital](https://fadlidigital.com)
