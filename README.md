# ProFolio AI — Intelligent Portfolio Management & Job-Specific Resume System

ProFolio AI is an end-to-end, full-stack portfolio database and dynamic resume generation system designed to maintain all professional information in one centralized source of truth, synchronize with Google Sheets, and leverage the **Gemini API** to generate tailored, ATS-optimized, downloadable resumes customized for any target Job Description (JD).

---

## 🎨 Color Palette & Aesthetic Tokens
The application is styled with modern typography (**'DM Sans'**) and adheres strictly to the custom palette:

```css
:root {
    font-family: 'DM Sans', sans-serif;
    color: #382b32;
    background: #fffaf7;
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    --rose: #bd7289;
    --rose-dark: #98546b;
    --ink: #382b32;
    --muted: #94858c;
    --line: #f0e5e7;
    --panel: #fffefd;
    --lilac: #eee7fa;
    --sage: #e5f1e9;
}
```

---

## 🚀 Key Functional Modules & Architecture

### 1. Centralized Portfolio Database (MongoDB + Mongoose)
Stores and organizes verified candidate information across 10 structured categories:
- **Personal & Contact Info**: Full Name, Email, Phone, Location, Title, LinkedIn, GitHub, Website.
- **Career Objective / Professional Summary**: High-impact career summaries.
- **Educational Qualifications**: Institutions, Degrees, Field of Study, Dates, GPA/Honors, Location.
- **Technical & Soft Skills Matrix**: Categorized into Frontend, Backend, Database, Cloud & DevOps, AI & ML, Languages, Tools, and Soft Skills with proficiency levels.
- **Work Experience & Internships**: Companies, Roles, Dates, Tech Stack, Quantifiable Highlights.
- **Featured Projects**: Repositories, Live URLs, Tech Stacks, Architecture Highlights.
- **Certifications & Courses**: AWS, Google Cloud, MongoDB licenses, Verification URLs, Credential IDs.
- **Achievements & Awards**: Hackathons, engineering awards, leadership honors.
- **Research Papers & Publications**: Conference publications, DOI links, abstracts.
- **Languages & Competencies**: Multi-lingual proficiencies and cross-functional competencies.

### 2. Gemini API Integration
- **Unstructured Bio Parser**: Automatically extracts and organizes raw text (resumes, LinkedIn summaries) into clean structured portfolio fields.
- **Job Description Analysis**: Extracts core requirements, required keywords, and must-have skills from target JDs.
- **Zero-Hallucination Guardrails**: Evaluates match percentage and tailors summary and experience bullets **strictly grounded in candidate facts**. Never invents fake degrees or missing skills; unmatched requirements are flagged transparently as missing skills.
- **Bullet Point Polisher**: Enhances phrasing with action verbs and targeted keywords while strictly preserving original metrics.

### 3. Google Sheets Integration
- **Multi-Tab Structured Export**: Generates an 8-sheet Excel/Google Sheets workbook (`.xlsx`) mapping each portfolio category to its own clean worksheet.
- **Live Google Apps Script Webhook Sync**: Pushes portfolio updates in real-time straight to any Google Sheet via an easy-to-deploy script.
- **Google Sheets API v4**: Supports direct Service Account batch updates.

### 4. Dynamic Resume Tailorer
- **Split-Screen Interactive Workspace**: Target JD input on the left; real-time ATS live resume preview on the right.
- **Two Pre-Configured Test Roles**:
  - **Role 1**: *Senior Full Stack Cloud Engineer (React, Node.js, Express, AWS, Microservices)*
  - **Role 2**: *Staff AI / Generative AI Engineer (Gemini API, LangChain, RAG, Vector DBs, Python)*
- **Interactive Checklists**: Select/deselect specific skills, projects, and work experiences to tailor document length and relevance.
- **Dual Export Formats**:
  - **Download PDF**: High-fidelity vector print-ready PDF formatted to ATS standards.
  - **Download Word (.docx)**: Native Microsoft Word document generated via `docx`.
- **Saved Resumes History**: Side-by-side comparison of multiple customized resumes generated from the same core portfolio.

---

## 🛠️ Technology Stack
- **Frontend**: React 18, Vite, Lucide Icons, Vanilla CSS Design System with `:root` tokens.
- **Backend**: Node.js, Express.js (ES Modules).
- **Database**: MongoDB (via Mongoose ODM).
- **AI Engine**: Google Gemini API (`gemini-2.5-flash` / `gemini-1.5-flash`).
- **File & Export Engines**: `xlsx` (Google Sheets Multi-Tab Workbook) & `docx` (Word Document Generation).

---

## ⚙️ Configuration & Setup Guide

### 1. Prerequisites
- **Node.js**: v18+ (tested on v24)
- **MongoDB**: Running locally on `mongodb://127.0.0.1:27017` or via MongoDB Atlas URI.

### 2. Environment Variables Configuration
In the `server/` directory, create or edit `.env` (a template `.env.example` is provided):

```bash
cd server
cp .env.example .env
```

Edit `server/.env` with your settings:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/portfolio_builder

# 1. Google Gemini API Key
# Obtain free from https://aistudio.google.com/
GEMINI_API_KEY=your_gemini_api_key_here

# 2. Google Sheets Integration (Option A: Recommended & Instant)
# Google Apps Script Webhook URL (see instructions below)
GOOGLE_APPS_SCRIPT_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

# 3. Google Sheets Integration (Option B: Google Cloud Service Account)
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_SPREADSHEET_ID=
```

> **Note on Fallbacks**: If `GEMINI_API_KEY` is not provided, the application automatically uses built-in heuristic matching so the full UI, JD analysis, and resume customization remain 100% testable out of the box.

---

### 3. Setting Up Google Sheets Integration

#### Option A: Google Apps Script (Recommended — 30 Seconds, No GCP IAM Setup)
1. Open [Google Sheets](https://sheets.new) and create a new blank spreadsheet.
2. Click **Extensions > Apps Script**.
3. In ProFolio AI, go to the **Google Sheets Hub** tab and click **Setup Script** (or copy from `server/services/sheetsService.js`).
4. Paste the code into the Apps Script editor and click **Save**.
5. Click **Deploy > New deployment**:
   - **Select type**: `Web app`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
6. Click **Deploy**, copy the generated **Web App URL**, and paste it into ProFolio AI's Webhook field. Click **Sync to Google Sheets Now**!

#### Option B: Direct 1-Click Multi-Tab Export
Click the **Export Sheets (.xlsx)** button in the navbar or in the Google Sheets Hub. An 8-worksheet spreadsheet will immediately download and can be opened in Google Sheets or Excel.

---

## 🏃 Running the Application

### Method 1: Run Concurrently from Root
```bash
# 1. Install all dependencies
npm run install:all

# 2. Start the Backend Server (Port 5000)
npm run server

# 3. In a second terminal, start the React Client (Port 5180)
npm run client
```

### Method 2: Run Separately

**Terminal 1 — Backend:**
```bash
cd server
npm install
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm install
npm run dev
# React Vite UI runs on http://localhost:5180
```

Open your browser at **http://localhost:5180** to use the application!

---

## 🧪 Testing with 2 Different Job Descriptions

The application comes pre-loaded with two distinct Job Descriptions to test customized resumes from the same portfolio:

1. **Job Description 1: Senior Full Stack Cloud Engineer**
   - Focus: React, Node.js, Express, MongoDB, AWS microservices, high-traffic APIs.
   - Result: Emphasizes full-stack scalability, microservice uptime, and cloud architecture certifications.
2. **Job Description 2: Staff AI / Generative AI Engineer**
   - Focus: Gemini API, LangChain, RAG, vector databases (Pinecone), Python, hallucination guardrails.
   - Result: Prioritizes LLM pipeline projects (DocuSense), AI certifications, and research publications.

In the **Saved Resumes** tab, you can compare both customized resumes side-by-side!

---

## 📄 License
MIT License. Created for AI-Powered Portfolio Management & Dynamic Resume Generation.
