const BASE_URL = '/api';

export const api = {
  // Health & Config
  getHealth: async () => {
    const res = await fetch(`${BASE_URL}/health`);
    return await res.json();
  },

  // Portfolio
  getPortfolio: async (userId = 'default_user') => {
    const res = await fetch(`${BASE_URL}/portfolio?userId=${userId}`);
    return await res.json();
  },

  savePortfolio: async (portfolioData) => {
    const res = await fetch(`${BASE_URL}/portfolio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(portfolioData)
    });
    return await res.json();
  },

  loadSample: async (userId = 'default_user') => {
    const res = await fetch(`${BASE_URL}/portfolio/load-sample`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return await res.json();
  },

  addCategoryItem: async (category, item, userId = 'default_user') => {
    const res = await fetch(`${BASE_URL}/portfolio/item`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, item, userId })
    });
    return await res.json();
  },

  deleteCategoryItem: async (category, itemId, userId = 'default_user') => {
    const res = await fetch(`${BASE_URL}/portfolio/item/${category}/${itemId}?userId=${userId}`, {
      method: 'DELETE'
    });
    return await res.json();
  },

  // AI & Gemini
  parseUnstructured: async (rawText) => {
    const res = await fetch(`${BASE_URL}/ai/parse-portfolio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rawText })
    });
    return await res.json();
  },

  analyzeJD: async (jobDescription, portfolio) => {
    const res = await fetch(`${BASE_URL}/ai/analyze-jd`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobDescription, portfolio })
    });
    return await res.json();
  },

  enhanceBullet: async (bulletText, targetKeywords, roleTitle) => {
    const res = await fetch(`${BASE_URL}/ai/enhance-bullet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bulletText, targetKeywords, roleTitle })
    });
    return await res.json();
  },

  getSampleJDs: async () => {
    const res = await fetch(`${BASE_URL}/ai/sample-jds`);
    return await res.json();
  },

  // Google Sheets
  getExportUrl: (userId = 'default_user') => `${BASE_URL}/sheets/export?userId=${userId}`,

  syncGoogleSheets: async (payload) => {
    const res = await fetch(`${BASE_URL}/sheets/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  },

  getAppsScriptCode: async () => {
    const res = await fetch(`${BASE_URL}/sheets/script-code`);
    return await res.json();
  },

  // Custom Resumes
  saveResume: async (resumeData) => {
    const res = await fetch(`${BASE_URL}/resumes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resumeData)
    });
    return await res.json();
  },

  getResumes: async (userId = 'default_user') => {
    const res = await fetch(`${BASE_URL}/resumes?userId=${userId}`);
    return await res.json();
  },

  exportDocx: async (resumeData, personalInfo) => {
    const res = await fetch(`${BASE_URL}/resumes/export-docx`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeData, personalInfo })
    });
    if (!res.ok) throw new Error('DOCX export failed');
    return await res.blob();
  }
};
