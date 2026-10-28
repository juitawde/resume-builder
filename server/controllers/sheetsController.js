import { generatePortfolioWorkbook, syncWithAppsScriptWebhook, syncWithGoogleSheetsAPI, getAppsScriptSnippet } from '../services/sheetsService.js';
import { Portfolio } from '../models/Portfolio.js';

export async function exportWorkbook(req, res) {
  try {
    const userId = req.query.userId || 'default_user';
    let portfolio = await Portfolio.findOne({ userId });

    if (!portfolio) {
      return res.status(404).json({ success: false, error: 'Portfolio not found to export' });
    }

    const buffer = generatePortfolioWorkbook(portfolio.toObject ? portfolio.toObject() : portfolio);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Portfolio_${portfolio.personalInfo?.fullName?.replace(/\s+/g, '_') || 'Export'}.xlsx`);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function syncGoogleSheets(req, res) {
  try {
    const { userId = 'default_user', syncType = 'webhook', webhookUrl, spreadsheetId } = req.body;
    let portfolio = await Portfolio.findOne({ userId });

    if (!portfolio) {
      return res.status(404).json({ success: false, error: 'Portfolio not found' });
    }

    const portfolioObj = portfolio.toObject ? portfolio.toObject() : portfolio;
    let result = null;

    if (syncType === 'webhook') {
      const targetUrl = webhookUrl || process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL;
      if (!targetUrl) {
        return res.status(400).json({ 
          success: false, 
          error: 'Please provide a Google Apps Script Webhook URL or configure it in server/.env' 
        });
      }
      result = await syncWithAppsScriptWebhook(portfolioObj, targetUrl);
    } else {
      const targetSpreadsheetId = spreadsheetId || process.env.GOOGLE_SPREADSHEET_ID;
      result = await syncWithGoogleSheetsAPI(portfolioObj, targetSpreadsheetId);
    }

    portfolio.lastSyncedWithSheets = new Date();
    await portfolio.save();

    res.json({ 
      success: true, 
      result, 
      lastSyncedWithSheets: portfolio.lastSyncedWithSheets,
      message: 'Portfolio successfully synchronized with Google Sheets!' 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export function getScriptCode(req, res) {
  const code = getAppsScriptSnippet();
  res.json({ success: true, scriptCode: code });
}
