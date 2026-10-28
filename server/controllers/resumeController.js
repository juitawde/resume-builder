import { CustomResume } from '../models/CustomResume.js';
import { Portfolio } from '../models/Portfolio.js';
import { generateResumeDocx } from '../services/docxService.js';

export async function saveResume(req, res) {
  try {
    const resumeData = req.body;
    const userId = resumeData.userId || 'default_user';

    const newResume = await CustomResume.create({
      ...resumeData,
      userId
    });

    res.json({ success: true, resume: newResume, message: 'Customized resume saved successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function getResumes(req, res) {
  try {
    const userId = req.query.userId || 'default_user';
    const resumes = await CustomResume.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, resumes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function exportDocx(req, res) {
  try {
    const { resumeData, personalInfo } = req.body;
    if (!resumeData) {
      return res.status(400).json({ success: false, error: 'Resume data is required' });
    }

    const docxBuffer = await generateResumeDocx(resumeData, personalInfo || {});

    const cleanTitle = (resumeData.targetRole || 'Tailored_Resume').replace(/[^a-zA-Z0-9_-]/g, '_');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename=Resume_${cleanTitle}.docx`);
    res.send(docxBuffer);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
