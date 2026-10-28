import { parseUnstructuredPortfolio, analyzeJobDescriptionAndMatch, enhanceBulletPoint } from '../services/geminiService.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sampleJDsPath = path.join(__dirname, '../data/sampleJDs.json');
let sampleJDs = [];
try {
  sampleJDs = JSON.parse(fs.readFileSync(sampleJDsPath, 'utf-8'));
} catch (e) {
  console.warn('Could not read sampleJDs.json:', e.message);
}

export async function parseUnstructured(req, res) {
  try {
    const { rawText } = req.body;
    if (!rawText || !rawText.trim()) {
      return res.status(400).json({ success: false, error: 'Raw text is required' });
    }

    const structuredData = await parseUnstructuredPortfolio(rawText);
    res.json({ success: true, structuredData, message: 'Unstructured portfolio parsed successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function analyzeJD(req, res) {
  try {
    const { jobDescription, portfolio } = req.body;
    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({ success: false, error: 'Job description is required' });
    }
    if (!portfolio) {
      return res.status(400).json({ success: false, error: 'Portfolio data is required' });
    }

    const analysis = await analyzeJobDescriptionAndMatch(jobDescription, portfolio);
    res.json({ success: true, analysis });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function enhanceBullet(req, res) {
  try {
    const { bulletText, targetKeywords, roleTitle } = req.body;
    if (!bulletText) {
      return res.status(400).json({ success: false, error: 'Bullet text is required' });
    }

    const enhanced = await enhanceBulletPoint(bulletText, targetKeywords || [], roleTitle || '');
    res.json({ success: true, enhancedBullet: enhanced });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export function getSampleJDs(req, res) {
  res.json({ success: true, sampleJDs });
}
