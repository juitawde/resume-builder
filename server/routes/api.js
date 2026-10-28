import express from 'express';
import { getPortfolio, savePortfolio, loadSample, addCategoryItem, deleteCategoryItem } from '../controllers/portfolioController.js';
import { parseUnstructured, analyzeJD, enhanceBullet, getSampleJDs } from '../controllers/aiController.js';
import { exportWorkbook, syncGoogleSheets, getScriptCode } from '../controllers/sheetsController.js';
import { saveResume, getResumes, exportDocx } from '../controllers/resumeController.js';

const router = express.Router();

// Portfolio Routes
router.get('/portfolio', getPortfolio);
router.post('/portfolio', savePortfolio);
router.post('/portfolio/load-sample', loadSample);
router.post('/portfolio/item', addCategoryItem);
router.delete('/portfolio/item/:category/:itemId', deleteCategoryItem);

// AI & Gemini Routes
router.post('/ai/parse-portfolio', parseUnstructured);
router.post('/ai/analyze-jd', analyzeJD);
router.post('/ai/enhance-bullet', enhanceBullet);
router.get('/ai/sample-jds', getSampleJDs);

// Google Sheets Routes
router.get('/sheets/export', exportWorkbook);
router.post('/sheets/sync', syncGoogleSheets);
router.get('/sheets/script-code', getScriptCode);

// Resume Routes
router.post('/resumes', saveResume);
router.get('/resumes', getResumes);
router.post('/resumes/export-docx', exportDocx);

export default router;
