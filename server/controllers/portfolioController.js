import { Portfolio } from '../models/Portfolio.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read sample portfolio data
const samplePortfolioPath = path.join(__dirname, '../data/samplePortfolio.json');
let samplePortfolioData = {};
try {
  samplePortfolioData = JSON.parse(fs.readFileSync(samplePortfolioPath, 'utf-8'));
} catch (e) {
  console.warn('Could not read samplePortfolio.json:', e.message);
}

// In-memory fallback if MongoDB connection is pending or offline
let memoryPortfolio = { ...samplePortfolioData, userId: 'default_user' };

export async function getPortfolio(req, res) {
  try {
    const userId = req.query.userId || 'default_user';
    let portfolio = null;

    try {
      portfolio = await Portfolio.findOne({ userId });
    } catch (dbErr) {
      console.warn('MongoDB query warning (using in-memory):', dbErr.message);
    }

    if (!portfolio) {
      // If DB has no portfolio yet, initialize with sample data
      try {
        portfolio = await Portfolio.create({ userId, ...samplePortfolioData });
      } catch (createErr) {
        portfolio = memoryPortfolio;
      }
    }

    res.json({ success: true, portfolio });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, portfolio: memoryPortfolio });
  }
}

export async function savePortfolio(req, res) {
  try {
    const userId = req.body.userId || 'default_user';
    const updateData = req.body;

    let updated = null;
    try {
      updated = await Portfolio.findOneAndUpdate(
        { userId },
        { ...updateData, userId },
        { new: true, upsert: true }
      );
    } catch (dbErr) {
      console.warn('MongoDB update warning (updating memory):', dbErr.message);
      memoryPortfolio = { ...memoryPortfolio, ...updateData };
      updated = memoryPortfolio;
    }

    res.json({ success: true, portfolio: updated, message: 'Portfolio saved successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function loadSample(req, res) {
  try {
    const userId = req.body.userId || 'default_user';
    let portfolio = null;

    try {
      await Portfolio.deleteMany({ userId });
      portfolio = await Portfolio.create({ userId, ...samplePortfolioData });
    } catch (dbErr) {
      memoryPortfolio = { ...samplePortfolioData, userId };
      portfolio = memoryPortfolio;
    }

    res.json({ 
      success: true, 
      portfolio, 
      message: 'Comprehensive sample portfolio loaded successfully!' 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function addCategoryItem(req, res) {
  try {
    const { category, item, userId = 'default_user' } = req.body;
    let portfolio = await Portfolio.findOne({ userId });

    if (!portfolio) {
      portfolio = new Portfolio({ userId, ...memoryPortfolio });
    }

    if (!portfolio[category] || !Array.isArray(portfolio[category])) {
      return res.status(400).json({ success: false, error: `Invalid category: ${category}` });
    }

    portfolio[category].push(item);
    await portfolio.save();

    res.json({ success: true, portfolio, message: `Added item to ${category}` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function deleteCategoryItem(req, res) {
  try {
    const { category, itemId } = req.params;
    const userId = req.query.userId || 'default_user';

    let portfolio = await Portfolio.findOne({ userId });
    if (!portfolio) {
      return res.status(404).json({ success: false, error: 'Portfolio not found' });
    }

    if (portfolio[category] && Array.isArray(portfolio[category])) {
      portfolio[category] = portfolio[category].filter(it => it._id?.toString() !== itemId);
      await portfolio.save();
    }

    res.json({ success: true, portfolio, message: `Deleted item from ${category}` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
