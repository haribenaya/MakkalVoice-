# MakkalVoice — Voice-First Public Grievance & Civic Drafting Platform for Bharat

**Theme:** Public Infrastructure and Civic Services (**Scaler × Wispr Flow — Build for Bharat**)

MakkalVoice enables everyday Indian citizens across **13 languages** (Tamil, Hindi, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati, Punjabi, Odia, Assamese, Urdu, and English) to simply **speak** their civic, utility, consumer, RTI, or escalation problem naturally—and automatically converts it into an official, ready-to-submit complaint letter matched to verified government portals.

---

## End-to-End Voice-First Core Flow

1. **Hands-Free Live Voice Flow:** Speak naturally in any Indian language or mix (e.g., Tamil/Tanglish, Hindi/Hinglish). MakkalVoice replies in a warm, respectful regional voice, asks short clarifying questions, and auto-fills category, area/location, and details on the dashboard without typing.
2. **Formal Official Drafting (Complaint, RTI Act 2005, or Escalation):** Generates a structured letter keeping citizen personal details private on-device until final preview.
3. **Verified Government Portal Matching:** Automatically matches verified Indian Central, State, and Municipal grievance portals (CPGRAMS, NCH, RailMadad, RBI CMS, CyberCrime, State CM Grievance Cells, Municipal portals).
4. **Permission-First Dispatch & Citizen Tracker:**
   - Prepares pre-filled **Gmail** (To, Subject, Body) and **Official WhatsApp** drafts only after explicit user confirmation.
   - Exports formal **A4 PDF / TXT** and saves complaints locally in **My Saved Complaints** for tracking and escalation.

---

## Quick Start (Starts Without Any Secret Keys)

No secret API keys are required to clone, boot, and test the end-to-end MakkalVoice flow locally:

```bash
npm install
npm run dev
```

Open **http://localhost:3000** in your browser.

### Optional: Full Live Gemini AI Mode
By default, if `GEMINI_API_KEY` is not configured in `.env`, MakkalVoice automatically runs with its built-in **Local Demo Fallback** (browser speech recognition/synthesis + deterministic Indian civic extraction & portal routing) so the full flow works immediately with zero secrets.

To enable full **Gemini Live API** real-time regional audio conversation, multimodal photo/bill scanning, and AI translation locally:

1. Copy `.env.example` to `.env`
2. Add your `GEMINI_API_KEY`
3. Restart `npm run dev`

---

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Lucide Icons, jsPDF
- **Backend:** Express + WebSocket (`server.ts`, `serverLiveVoice.ts`)
- **AI & Voice:** Google `@google/genai` (Gemini Live Audio, Multimodal Transcription & Drafting, Neural TTS) with clean no-key local fallback (`serverDemoFallback.ts`)
- **Privacy:** Citizen name, phone number, and saved complaint history stay on the user's device; Gmail/WhatsApp actions require explicit user permission.
