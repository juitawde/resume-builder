import * as XLSX from 'xlsx';
import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Builds a multi-sheet XLSX buffer containing all portfolio categories
 * Each category has its own structured worksheet tab
 */
export function generatePortfolioWorkbook(portfolio) {
  const wb = XLSX.utils.book_new();

  // 1. Personal Info Sheet
  const personalData = [
    { Field: 'Full Name', Value: portfolio.personalInfo?.fullName || '' },
    { Field: 'Professional Title', Value: portfolio.personalInfo?.title || '' },
    { Field: 'Email', Value: portfolio.personalInfo?.email || '' },
    { Field: 'Phone', Value: portfolio.personalInfo?.phone || '' },
    { Field: 'Location', Value: portfolio.personalInfo?.location || '' },
    { Field: 'LinkedIn', Value: portfolio.personalInfo?.linkedIn || '' },
    { Field: 'GitHub', Value: portfolio.personalInfo?.github || '' },
    { Field: 'Website', Value: portfolio.personalInfo?.website || '' },
    { Field: 'Professional Summary', Value: portfolio.professionalSummary || '' }
  ];
  const wsPersonal = XLSX.utils.json_to_sheet(personalData);
  XLSX.utils.book_append_sheet(wb, wsPersonal, 'Personal Info');

  // 2. Skills Sheet
  const skillsData = (portfolio.skills || []).map(s => ({
    'Skill Name': s.name,
    'Category': s.category,
    'Proficiency Level': s.proficiencyLevel,
    'Years Experience': s.yearsOfExperience
  }));
  const wsSkills = XLSX.utils.json_to_sheet(skillsData.length ? skillsData : [{ 'Skill Name': 'None' }]);
  XLSX.utils.book_append_sheet(wb, wsSkills, 'Skills Matrix');

  // 3. Work Experience Sheet
  const expData = (portfolio.experience || []).map(e => ({
    'Company': e.company,
    'Role': e.role,
    'Employment Type': e.employmentType || 'Full-time',
    'Location': e.location || '',
    'Start Date': e.startDate || '',
    'End Date': e.endDate || '',
    'Is Current': e.isCurrent ? 'Yes' : 'No',
    'Description': e.description || '',
    'Technologies Used': (e.technologiesUsed || []).join(', '),
    'Highlights': (e.highlights || []).join(' | ')
  }));
  const wsExp = XLSX.utils.json_to_sheet(expData.length ? expData : [{ 'Company': 'None' }]);
  XLSX.utils.book_append_sheet(wb, wsExp, 'Work Experience');

  // 4. Projects Sheet
  const projData = (portfolio.projects || []).map(p => ({
    'Project Title': p.title,
    'Role': p.role || '',
    'Description': p.description || '',
    'Tech Stack': (p.techStack || []).join(', '),
    'Live Demo URL': p.liveUrl || '',
    'GitHub URL': p.githubUrl || '',
    'Start Date': p.startDate || '',
    'End Date': p.endDate || '',
    'Key Highlights': (p.highlights || []).join(' | ')
  }));
  const wsProj = XLSX.utils.json_to_sheet(projData.length ? projData : [{ 'Project Title': 'None' }]);
  XLSX.utils.book_append_sheet(wb, wsProj, 'Projects');

  // 5. Education Sheet
  const eduData = (portfolio.education || []).map(ed => ({
    'Institution': ed.institution,
    'Degree': ed.degree,
    'Field of Study': ed.fieldOfStudy || '',
    'Start Date': ed.startDate || '',
    'End Date': ed.endDate || '',
    'Grade / GPA': ed.gradeOrGpa || '',
    'Location': ed.location || '',
    'Highlights': (ed.highlights || []).join(' | ')
  }));
  const wsEdu = XLSX.utils.json_to_sheet(eduData.length ? eduData : [{ 'Institution': 'None' }]);
  XLSX.utils.book_append_sheet(wb, wsEdu, 'Education');

  // 6. Certifications Sheet
  const certData = (portfolio.certifications || []).map(c => ({
    'Certification Name': c.name,
    'Issuing Organization': c.issuingOrg,
    'Issue Date': c.issueDate || '',
    'Expiry Date': c.expiryDate || '',
    'Credential ID': c.credentialId || '',
    'Verification URL': c.credentialUrl || '',
    'Skills Covered': (c.skillsCovered || []).join(', ')
  }));
  const wsCert = XLSX.utils.json_to_sheet(certData.length ? certData : [{ 'Certification Name': 'None' }]);
  XLSX.utils.book_append_sheet(wb, wsCert, 'Certifications');

  // 7. Achievements Sheet
  const achData = (portfolio.achievements || []).map(a => ({
    'Achievement Title': a.title,
    'Issuer / Organization': a.issuer || '',
    'Date': a.date || '',
    'Description': a.description || ''
  }));
  const wsAch = XLSX.utils.json_to_sheet(achData.length ? achData : [{ 'Achievement Title': 'None' }]);
  XLSX.utils.book_append_sheet(wb, wsAch, 'Achievements');

  // 8. Languages & Publications Sheet
  const langData = (portfolio.languages || []).map(l => ({
    'Language': l.name,
    'Proficiency': l.proficiency
  }));
  const wsLang = XLSX.utils.json_to_sheet(langData.length ? langData : [{ 'Language': 'None' }]);
  XLSX.utils.book_append_sheet(wb, wsLang, 'Languages');

  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  return buffer;
}

/**
 * Sync portfolio data to Google Sheets via Google Apps Script Webhook
 * This allows real-time two-way synchronization without requiring GCP Service Account configuration
 */
export async function syncWithAppsScriptWebhook(portfolio, webhookUrl) {
  if (!webhookUrl) {
    throw new Error('Google Apps Script Webhook URL is missing');
  }

  const payload = {
    action: 'SYNC_PORTFOLIO',
    timestamp: new Date().toISOString(),
    personalInfo: portfolio.personalInfo,
    professionalSummary: portfolio.professionalSummary,
    skills: portfolio.skills,
    experience: portfolio.experience,
    projects: portfolio.projects,
    education: portfolio.education,
    certifications: portfolio.certifications,
    achievements: portfolio.achievements,
    languages: portfolio.languages
  };

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const txt = await response.text();
    throw new Error(`Apps Script returned status ${response.status}: ${txt}`);
  }

  return await response.json();
}

/**
 * Direct Google Sheets API v4 Sync using Service Account
 */
export async function syncWithGoogleSheetsAPI(portfolio, spreadsheetId) {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');

  if (!clientEmail || !privateKey || !spreadsheetId) {
    throw new Error('Google Service Account credentials or Spreadsheet ID not configured in server/.env');
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });

  const sheets = google.sheets({ version: 'v4', auth });

  // Update Overview/Personal Info
  const personalValues = [
    ['Full Name', portfolio.personalInfo?.fullName || ''],
    ['Title', portfolio.personalInfo?.title || ''],
    ['Email', portfolio.personalInfo?.email || ''],
    ['Phone', portfolio.personalInfo?.phone || ''],
    ['Location', portfolio.personalInfo?.location || ''],
    ['LinkedIn', portfolio.personalInfo?.linkedIn || ''],
    ['GitHub', portfolio.personalInfo?.github || ''],
    ['Summary', portfolio.professionalSummary || '']
  ];

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: 'Personal Info!A1:B8',
    valueInputOption: 'RAW',
    requestBody: { values: personalValues }
  });

  return { success: true, syncedAt: new Date().toISOString() };
}

/**
 * Generates an out-of-the-box Google Apps Script template code
 * that the user can paste into Google Sheets -> Extensions -> Apps Script
 */
export function getAppsScriptSnippet(serverOrigin = 'http://localhost:5000') {
  return `/**
 * Google Apps Script for ProFolio AI Live Sync
 * 1. Open your Google Sheet
 * 2. Click Extensions > Apps Script
 * 3. Replace all code with this script
 * 4. Click Deploy > New Deployment > Select type 'Web app'
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web App URL and paste it into ProFolio AI Google Sheets settings!
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. Personal Info Sheet
    var sheetPersonal = getOrCreateSheet(ss, "Personal Info");
    sheetPersonal.clear();
    sheetPersonal.appendRow(["Field", "Value"]);
    sheetPersonal.appendRow(["Full Name", data.personalInfo.fullName || ""]);
    sheetPersonal.appendRow(["Title", data.personalInfo.title || ""]);
    sheetPersonal.appendRow(["Email", data.personalInfo.email || ""]);
    sheetPersonal.appendRow(["Phone", data.personalInfo.phone || ""]);
    sheetPersonal.appendRow(["Location", data.personalInfo.location || ""]);
    sheetPersonal.appendRow(["LinkedIn", data.personalInfo.linkedIn || ""]);
    sheetPersonal.appendRow(["GitHub", data.personalInfo.github || ""]);
    sheetPersonal.appendRow(["Summary", data.professionalSummary || ""]);

    // 2. Skills Sheet
    var sheetSkills = getOrCreateSheet(ss, "Skills Matrix");
    sheetSkills.clear();
    sheetSkills.appendRow(["Skill Name", "Category", "Proficiency", "Years"]);
    (data.skills || []).forEach(function(s) {
      sheetSkills.appendRow([s.name, s.category, s.proficiencyLevel, s.yearsOfExperience]);
    });

    // 3. Work Experience Sheet
    var sheetExp = getOrCreateSheet(ss, "Work Experience");
    sheetExp.clear();
    sheetExp.appendRow(["Company", "Role", "Dates", "Location", "Technologies", "Highlights"]);
    (data.experience || []).forEach(function(exp) {
      sheetExp.appendRow([
        exp.company,
        exp.role,
        (exp.startDate || "") + " - " + (exp.endDate || "Present"),
        exp.location || "",
        (exp.technologiesUsed || []).join(", "),
        (exp.highlights || []).join(" | ")
      ]);
    });

    // 4. Projects Sheet
    var sheetProj = getOrCreateSheet(ss, "Projects");
    sheetProj.clear();
    sheetProj.appendRow(["Project Title", "Role", "Tech Stack", "Live URL", "Highlights"]);
    (data.projects || []).forEach(function(p) {
      sheetProj.appendRow([
        p.title,
        p.role,
        (p.techStack || []).join(", "),
        p.liveUrl || "",
        (p.highlights || []).join(" | ")
      ]);
    });

    // 5. Certifications & Education
    var sheetEdu = getOrCreateSheet(ss, "Education & Certs");
    sheetEdu.clear();
    sheetEdu.appendRow(["Type", "Name / Institution", "Detail", "Date / Grade"]);
    (data.education || []).forEach(function(ed) {
      sheetEdu.appendRow(["Education", ed.institution, ed.degree + " in " + ed.fieldOfStudy, ed.gradeOrGpa]);
    });
    (data.certifications || []).forEach(function(c) {
      sheetEdu.appendRow(["Certification", c.name, c.issuingOrg, c.issueDate]);
    });

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Portfolio successfully synced to Google Sheets!",
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}
`;
}
