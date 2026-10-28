# ProFolio AI — Intelligent Portfolio Management & Job-Specific Resume System

**ProFolio AI** is a full-stack application that helps users organize their professional information in one centralized portfolio and generate resumes tailored to specific job descriptions.

Instead of manually rewriting a resume for every job application, users can maintain a structured database of their skills, education, work experience, projects, certifications, and achievements. The application uses AI-assisted analysis to identify relevant information and create job-specific resumes in downloadable PDF and Microsoft Word formats.

It also includes Google Sheets integration for portfolio synchronization and spreadsheet exports, making professional information easier to maintain, organize, and reuse.

---

## ✨ Key Features

### 1. Centralized Professional Portfolio

Maintain a structured portfolio containing professional information in one place.

The portfolio is organized into the following categories:

- **Personal Information:** Name, email, phone number, location, professional title, LinkedIn, GitHub, and personal website.
- **Professional Summary:** Career objectives and professional introduction.
- **Education:** Institutions, degrees, fields of study, academic dates, grades, and honors.
- **Skills:** Technical and soft skills organized by categories such as frontend, backend, databases, cloud, AI/ML, programming languages, and tools.
- **Experience:** Employment history, internships, responsibilities, technology stacks, and measurable achievements.
- **Projects:** Project descriptions, repositories, live links, technologies, and implementation highlights.
- **Certifications:** Courses, credentials, verification links, and certification IDs.
- **Achievements:** Awards, hackathons, leadership experience, and other accomplishments.
- **Research and Publications:** Research papers, abstracts, publication details, and DOI links.
- **Languages and Competencies:** Language proficiency and additional professional competencies.

This centralized approach reduces repetitive data entry and allows the same portfolio to support multiple job applications.

### 2. AI-Powered Portfolio Parsing

The application integrates Google's Gemini API to help transform unstructured professional information into structured portfolio data.

Key capabilities include:

- Extracting information from raw biographies and professional summaries.
- Organizing extracted information into relevant portfolio categories.
- Reducing the amount of manual data entry required.
- Reusing structured information when generating customized resumes.

AI-generated content should always be reviewed before being used in a real job application.

### 3. Job Description Analysis

Analyze a target job description to understand what an employer is looking for.

The system is designed to identify:

- Required technical skills.
- Relevant technologies and tools.
- Important job-specific keywords.
- Core responsibilities and qualifications.
- Areas where the existing portfolio matches or does not match the role.

This analysis helps prioritize the most relevant qualifications instead of using the same generic resume for every application.

### 4. Job-Specific Resume Generation

Generate customized resumes from the centralized portfolio according to the target job description.

The resume tailoring workflow includes:

- Entering or reviewing the target job description.
- Identifying relevant skills, projects, and professional experiences.
- Selecting the information that should appear in the resume.
- Generating a tailored professional summary and experience descriptions.
- Reviewing the generated resume through a live preview.
- Exporting the final document.

The goal is to improve relevance while preserving the accuracy of the candidate's original information.

### 5. Accuracy-Focused AI Assistance

AI-generated resume content should be grounded in the information available in the portfolio.

The documented design includes safeguards intended to:

- Preserve original achievements and numerical metrics.
- Avoid inventing qualifications or professional experience.
- Highlight missing skills instead of falsely claiming proficiency.
- Improve the wording of experience bullets using relevant action verbs.
- Align the resume with a job description without misrepresenting the candidate.

These safeguards help support more responsible AI-assisted resume writing. Generated content should still be checked by the user.

### 6. Interactive Resume Tailoring Workspace

The application provides a split-screen workflow for working with a target job description and reviewing the resulting resume.

Users can work with:

- A job description input area.
- An interactive resume preview.
- Selection controls for relevant skills, projects, and experience.
- Job-specific content customization.
- Resume export actions.
- Previously generated resumes.

This workflow makes it easier to compare different versions of a resume while working from the same source portfolio.

### 7. PDF and Microsoft Word Export

Export customized resumes in two formats:

- **PDF:** For sharing, uploading to job portals, and maintaining a consistent document layout.
- **DOCX:** An editable Microsoft Word document that can be reviewed and modified before submission.

The backend uses document-generation libraries to support these export workflows.

### 8. Saved Resume History

Keep track of multiple resume versions generated from the same professional portfolio.

This is useful when applying to different positions because each job may prioritize a different combination of skills, projects, and experience.

For example, a full-stack engineering role and an AI engineering role may require different emphasis even when they use the same underlying portfolio.

### 9. Google Sheets Integration

ProFolio AI supports exporting and synchronizing structured portfolio information with Google Sheets.

The documented integration options include:

- **Google Apps Script webhook:** Synchronize portfolio information with a Google Sheet through a deployed Apps Script web application.
- **Google Sheets API:** Support direct spreadsheet updates using Google service-account credentials.
- **Excel workbook export:** Generate an `.xlsx` workbook containing eight worksheets for organized portfolio data.

Spreadsheet integration provides an additional way to maintain, review, and reuse professional information outside the application.

### 10. Modern User Interface

The frontend uses React and Vite with a custom CSS design system.

The visual design includes:

- DM Sans typography.
- A soft rose and neutral color palette.
- Modular application components.
- Interactive portfolio and resume workflows.
- Lucide icons.
- Consistent colors and styling across the interface.

The design aims to keep a feature-rich professional tool organized and easy to navigate.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, JavaScript, Vite |
| UI and styling | Vanilla CSS, CSS custom properties |
| Icons | Lucide React |
| Backend | Node.js, Express.js |
| Backend module system | ES Modules |
| Database | MongoDB |
| Database object modeling | Mongoose |
| AI integration | Google Gemini API |
| Word document generation | `docx` |
| Spreadsheet generation | `xlsx` |
| Google integrations | Google APIs, Google Apps Script |
| Configuration | dotenv |
| Cross-origin requests | CORS |

---

## Screenshots:

<img width="1600" height="1041" alt="image" src="https://github.com/user-attachments/assets/bb461d02-af89-45a6-a034-b8287d44479f" />

<img width="1600" height="1041" alt="image" src="https://github.com/user-attachments/assets/b095003c-3aee-4b1a-b6a0-71ce9be95070" />

<img width="1600" height="1041" alt="image" src="https://github.com/user-attachments/assets/0e99c90c-3bb2-4c94-bf08-09c27c1c9b30" />

<img width="1600" height="1041" alt="image" src="https://github.com/user-attachments/assets/fb6c1b4f-755b-474e-a15e-80949a906b7e" />


---

## 🏗️ Application Architecture

ProFolio AI follows a client-server architecture.

The frontend handles user interaction, portfolio editing, job description input, resume customization, and preview workflows. The backend provides the server-side functionality for data operations, AI integration, spreadsheet services, and document generation.

```text
                    USER
                     |
                     v
          +----------------------+
          |    React Frontend    |
          |                      |
          |  Portfolio Manager   |
          |  Resume Builder      |
          |  AI Parser           |
          |  Google Sheets Hub   |
          |  Saved Resumes       |
          +----------------------+
                     |
                     | HTTP Requests
                     v
          +----------------------+
          |   Express Backend    |
          |                      |
          |  API and Processing  |
          |  Portfolio Services  |
          |  AI Integration      |
          |  Sheets Integration  |
          |  Document Generation |
          +----------------------+
             |        |        |
             v        v        v
          MongoDB   Gemini   Google Sheets
                              |
                              v
                       Spreadsheet Export

                     |
                     v
             PDF / DOCX Output
```

**Data flow:** Users manage their professional information through the frontend. The backend processes relevant operations, stores portfolio data in MongoDB, communicates with configured external services, and supports generating downloadable documents.

The exact request flow depends on the particular feature and its implementation.

---

## 📁 Project Structure

The repository is divided into a React frontend, an Express backend, and root-level project configuration.

```text
resume-builder/
│
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── components/
│   │   │   ├── AIParserModal.jsx
│   │   │   ├── GoogleSheetsModal.jsx
│   │   │   ├── PortfolioManager.jsx
│   │   │   ├── ResumeBuilder.jsx
│   │   │   ├── SavedResumes.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── TopHeader.jsx
│   │   ├── ...
│   ├── vite.config.js
│   └── package.json
│
├── server/
│   ├── server.js
│   ├── services/
│   │   ├── docxService.js
│   │   ├── sheetsService.js
│   │   └── ...
│   ├── ...
│   └── package.json
│
├── package.json
└── README.md
```

*Note: The structure above highlights important files and modules. The ellipses represent other project files; this is not an exhaustive inventory of the repository.*

### Important Frontend Files

| File | Responsibility |
|---|---|
| `App.jsx` | Main application component and interface composition. |
| `index.css` | Global styles, typography, colors, and design-system rules. |
| `AIParserModal.jsx` | Interface for AI-assisted parsing of professional information. |
| `GoogleSheetsModal.jsx` | Interface for Google Sheets-related actions. |
| `PortfolioManager.jsx` | Portfolio management interface. |
| `ResumeBuilder.jsx` | Resume customization and generation workspace. |
| `SavedResumes.jsx` | Interface for reviewing saved resume versions. |
| `Sidebar.jsx` | Sidebar navigation. |
| `TopHeader.jsx` | Application header and top-level controls. |
| `vite.config.js` | Vite development and build configuration. |
| `package.json` | Frontend dependencies and npm scripts. |

### Important Backend Files

| File | Responsibility |
|---|---|
| `server.js` | Express backend entry point. |
| `services/docxService.js` | Microsoft Word document generation. |
| `services/sheetsService.js` | Google Sheets integration and related spreadsheet operations. |
| `package.json` | Backend dependencies, module configuration, and scripts. |

The remaining backend files implement the other application services and supporting functionality.

---

## ⚙️ Prerequisites

Before running the project, make sure you have:

- Node.js 18 or newer.
- npm.
- MongoDB running locally or a MongoDB Atlas connection string.
- A Google Gemini API key for AI functionality.
- Google Sheets configuration if spreadsheet synchronization is required.

Node.js 24 has also been documented as a tested development environment.

Check your installations:

```bash
node -v
npm -v
```

---

## 🚀 Installation and Setup

### Step 1: Clone the repository

```bash
git clone https://github.com/juitawde/resume-builder.git
cd resume-builder
```

### Step 2: Install all dependencies

From the root directory, run:

```bash
npm run install:all
```

This command installs the backend and frontend dependencies using the root package configuration.

If you prefer to install them separately:

```bash
cd server
npm install

cd ../client
npm install
```

### Step 3: Configure environment variables

Create a `.env` file inside the `server/` directory.

If an `.env.example` file is present in your local checkout, you can copy it:

```bash
cd server
cp .env.example .env
```

Otherwise, create the file manually.

Configure the following variables as required:

```env
PORT=5000

MONGODB_URI=mongodb://127.0.0.1:27017/portfolio_builder

GEMINI_API_KEY=your_gemini_api_key_here

GOOGLE_APPS_SCRIPT_WEBHOOK_URL=

GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_SPREADSHEET_ID=
```

Replace the example values with your own configuration. Do not commit real credentials to GitHub.

### Environment variable reference

| Variable | Purpose |
|---|---|
| `PORT` | Port used by the backend server. |
| `MONGODB_URI` | MongoDB connection string. |
| `GEMINI_API_KEY` | API key for Gemini-powered features. |
| `GOOGLE_APPS_SCRIPT_WEBHOOK_URL` | Deployed Apps Script web application URL. |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Google service-account email for direct API integration. |
| `GOOGLE_PRIVATE_KEY` | Private key associated with the configured service account. |
| `GOOGLE_SPREADSHEET_ID` | ID of the target Google spreadsheet. |

**Important:** The Google Apps Script webhook and direct Google Sheets API are alternative integration paths. Configure the option you intend to use.

### Step 4: Start MongoDB

If you are using a local MongoDB installation, ensure the MongoDB service is running.

The default local connection used in this example is:

```text
mongodb://127.0.0.1:27017/portfolio_builder
```

If you use MongoDB Atlas, replace this value with your Atlas connection string.

Ensure the database user has the required permissions and that your network configuration allows the connection.

### Step 5: Start the backend

Open a terminal in the repository root:

```bash
npm run server
```

The root script runs the backend development command.

Alternatively, run the backend directly:

```bash
cd server
npm run dev
```

The documented backend port is `5000`.

### Step 6: Start the frontend

Open a second terminal in the repository root:

```bash
npm run client
```

Or run the frontend directly:

```bash
cd client
npm run dev
```

The Vite development server is configured to use port `5180` in the documented setup.

Open:

**http://localhost:5180**

Keep both development servers running while using the application.

---

## 🤖 Gemini API Configuration

Gemini integration supports AI-assisted portfolio parsing and job-specific resume customization.

To configure it:

1. Visit [Google AI Studio](https://aistudio.google.com/).
2. Obtain a Gemini API key.
3. Add the key to `server/.env`:

   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Restart the backend after changing the environment file.

The documented design includes fallback heuristic matching when a Gemini key is not configured. This can help with basic testing of the interface and matching workflow, but fallback matching should not be assumed to provide the same capabilities as AI-powered generation.

---

## 📊 Google Sheets Integration

ProFolio AI documents two ways to integrate with Google Sheets.

### Option A: Google Apps Script Webhook

This option is intended to simplify spreadsheet synchronization without requiring the full service-account setup.

1. Create a spreadsheet using [Google Sheets](https://sheets.new).
2. Open **Extensions → Apps Script**.
3. Use the Apps Script integration code provided by the project's Sheets service.
4. Save the script.
5. Deploy it as a web app.
6. Configure its access settings according to your security requirements.
7. Copy the deployment URL.
8. Add the URL to `GOOGLE_APPS_SCRIPT_WEBHOOK_URL`.
9. Use the application's synchronization workflow.

Treat the webhook URL as a sensitive endpoint. Before making a deployment publicly accessible, review what data it accepts and how access is controlled.

### Option B: Google Sheets API

For direct API-based synchronization, configure:

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY=your_service_account_private_key
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id
```

You must also enable the appropriate Google API, configure the service account, and grant the required access to the target spreadsheet.

The private key must be supplied in the format expected by the backend. Preserve newline characters correctly when configuring it through a hosting provider.

### Export to Excel

The application also documents a multi-worksheet `.xlsx` export containing eight worksheets.

This is useful for opening portfolio data in Microsoft Excel or importing it into Google Sheets without relying on a live synchronization connection.

---

## 📝 How to Use ProFolio AI

### Step 1: Build your portfolio

Add your personal details, professional summary, education, skills, experience, projects, certifications, and achievements.

Keep the information accurate and up to date.

### Step 2: Import or organize existing information

Use the AI-assisted parsing workflow when you want to convert unstructured professional information into structured portfolio fields.

Review the extracted information and correct any errors before using it.

### Step 3: Select a target job

Paste the job description for the position you want to apply for.

The job description provides the context for identifying relevant qualifications and tailoring the resume.

### Step 4: Analyze the requirements

Review the skills, keywords, and qualifications relevant to the position.

Identify any gaps between the role's requirements and the information in your portfolio.

### Step 5: Customize the resume

Select the most relevant skills, projects, and experience for the target role.

Review the generated summary and bullet points to ensure they accurately represent your qualifications.

### Step 6: Preview and export

Review the generated resume and export it as a PDF or DOCX document.

Before submitting it to an employer, verify the formatting, contact details, dates, spelling, and factual accuracy.

### Step 7: Manage multiple versions

Keep separate resume versions for different roles so that each application highlights the most relevant professional experience.

---

## 🧪 Example Use Cases

The project documents two example job descriptions for demonstrating role-specific resume tailoring.

### Example 1: Senior Full Stack Cloud Engineer

**Relevant areas:**

- React and frontend development.
- Node.js and Express.
- MongoDB and API development.
- Cloud technologies and AWS.
- Microservices and scalable application architecture.

The generated resume should emphasize relevant full-stack projects, backend experience, cloud-related qualifications, and demonstrated engineering achievements where these are present in the portfolio.

### Example 2: Staff AI / Generative AI Engineer

**Relevant areas:**

- Generative AI and large language models.
- Gemini API integration.
- Retrieval-Augmented Generation (RAG).
- Vector databases.
- Python and AI engineering.
- AI pipeline development and reliability.

The generated resume should prioritize relevant AI projects, technical experience, research, and certifications when supported by the candidate's actual information.

These examples demonstrate how a single portfolio can support different application strategies without maintaining entirely separate copies of the candidate's professional history.

---

## 🏗️ Build and Development Commands

Run the following commands from the appropriate directory.

| Command | Purpose |
|---|---|
| `npm run install:all` | Install frontend and backend dependencies from the repository root. |
| `npm run server` | Start the backend development server. |
| `npm run client` | Start the Vite frontend development server. |
| `npm run dev` | Display instructions for running the frontend and backend concurrently in separate terminals. |
| `npm run build` | Build the frontend for production, when run inside `client/`. |
| `npm run preview` | Preview the built frontend locally, when run inside `client/`. |
| `npm start` | Start the backend directly, when run inside `server/`. |

For a frontend production build:

```bash
cd client
npm run build
```

The generated frontend build is placed in Vite's default `dist/` directory unless the Vite configuration specifies otherwise.

---

## 🔐 Security Considerations

Because the application handles personal information and external service credentials, security should be considered throughout development and deployment.

- Keep `.env` files out of version control.
- Never publish Gemini API keys, Google private keys, or other credentials.
- Use environment variables for secrets instead of hardcoding them.
- Restrict database access to authorized users and services.
- Grant Google service accounts only the permissions they need.
- Validate incoming requests on the backend.
- Review the access permissions of deployed Apps Script webhooks.
- Avoid storing unnecessary sensitive personal information.
- Review AI-generated content before using it professionally.
- Rotate credentials immediately if they are accidentally exposed.

**Important:** Removing a secret from the latest commit does not necessarily remove it from earlier Git history. If a real credential has been exposed, revoke or rotate it even if the affected file has subsequently been deleted.

---

## 🛠️ Troubleshooting

### Frontend does not start

Verify that frontend dependencies are installed:

```bash
cd client
npm install
npm run dev
```

If port `5180` is already in use, inspect the existing process or configure a different available port.

### Backend does not start

Verify that the backend dependencies are installed:

```bash
cd server
npm install
npm run dev
```

Check the terminal for missing dependencies, syntax errors, and environment configuration issues.

### MongoDB connection fails

Check that:

- MongoDB is running.
- `MONGODB_URI` is correct.
- Your database credentials are valid.
- Your Atlas network access rules allow the connection, if applicable.

### AI functionality is unavailable

Check that `GEMINI_API_KEY` is correctly configured in `server/.env` and that the key is valid.

Restart the backend after updating the environment file.

### Google Sheets synchronization fails

Verify the configured integration method, webhook URL or service-account credentials, spreadsheet ID, permissions, and API configuration.

### Resume export fails

Check the backend logs and confirm that the required document-generation dependencies are installed. Review the relevant input data and inspect any errors returned by the export operation.

---

## 🔮 Potential Future Improvements

Possible extensions for the project include:

- More customizable resume layouts and themes.
- Additional resume templates optimized for different industries.
- More detailed job-description match reports.
- Improved accessibility and mobile responsiveness.
- Stronger validation of imported portfolio data.
- Automated testing for resume generation and spreadsheet synchronization.
- More granular control over portfolio privacy and sharing.
- Improved error handling and reporting for external API failures.
- Deployment documentation and a production-ready configuration.
- Support for tracking job applications alongside saved resume versions.

These are potential future improvements, not claims that the features are already implemented.

---

## 🎯 Project Goals

ProFolio AI aims to make professional portfolio management and job-specific resume generation more efficient by combining structured data storage, AI-assisted writing, document generation, and spreadsheet integration.

Its central idea is simple: **maintain professional information once, then reuse it intelligently for different career opportunities.**

The project brings together full-stack development, database modeling, external API integration, AI-assisted content generation, and document automation in one application.

---

## 👩‍💻 Author

**Jui Tawde**

