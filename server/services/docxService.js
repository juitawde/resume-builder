import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';

/**
 * Builds a professional .docx Word document for the tailored resume
 */
export async function generateResumeDocx(resumeData, personalInfo = {}) {
  const themeColors = {
    'modern-blue': { primary: '1D4ED8', text: '0F172A' },
    'executive-clean': { primary: '18181B', text: '18181B' },
    'modern-rose': { primary: '98546B', text: '382B32' },
    'compact-tech': { primary: '0D9488', text: '134E4A' }
  };
  const currentTheme = themeColors[resumeData.templateStyle] || themeColors['modern-blue'];
  const primaryColor = currentTheme.primary;
  const darkInk = currentTheme.text;

  const children = [];

  // 1. Header: Name & Contact
  const fullName = personalInfo.fullName || 'Candidate Name';
  const roleTitle = resumeData.targetRole || personalInfo.title || 'Professional';

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: fullName,
          bold: true,
          size: 36, // 18pt
          color: darkInk
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: roleTitle,
          bold: true,
          size: 24, // 12pt
          color: primaryColor
        })
      ]
    })
  );

  // Contact line
  const contactParts = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.linkedIn,
    personalInfo.github
  ].filter(Boolean);

  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: contactParts.join('  |  '),
            size: 18,
            color: '666666'
          })
        ]
      })
    );
  }

  // Helper for Section Heading
  function addSectionHeader(title) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 120 },
        border: {
          bottom: {
            color: primaryColor,
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6
          }
        },
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: 22,
            color: primaryColor
          })
        ]
      })
    );
  }

  // 2. Professional Summary
  if (resumeData.customizedSummary) {
    addSectionHeader('Professional Summary');
    children.push(
      new Paragraph({
        spacing: { after: 140 },
        children: [
          new TextRun({
            text: resumeData.customizedSummary,
            size: 20,
            color: darkInk
          })
        ]
      })
    );
  }

  // 3. Technical Skills
  if (resumeData.selectedSkills && resumeData.selectedSkills.length > 0) {
    addSectionHeader('Technical Competencies & Skills');
    children.push(
      new Paragraph({
        spacing: { after: 140 },
        children: [
          new TextRun({
            text: resumeData.selectedSkills.join('  •  '),
            size: 20,
            bold: true,
            color: darkInk
          })
        ]
      })
    );
  }

  // 4. Experience
  if (resumeData.selectedExperiences && resumeData.selectedExperiences.length > 0) {
    addSectionHeader('Professional Experience');
    resumeData.selectedExperiences.forEach(exp => {
      // Company & Role Line
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 40 },
          children: [
            new TextRun({
              text: `${exp.role}`,
              bold: true,
              size: 22,
              color: darkInk
            }),
            new TextRun({
              text: ` — ${exp.company}`,
              bold: true,
              size: 22,
              color: primaryColor
            }),
            new TextRun({
              text: `\t${exp.startDate || ''} – ${exp.endDate || 'Present'}`,
              size: 20,
              color: '777777'
            })
          ]
        })
      );

      // Bullets
      const bullets = exp.tailoredBullets || [];
      bullets.forEach(b => {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: b,
                size: 20,
                color: darkInk
              })
            ]
          })
        );
      });
    });
  }

  // 5. Projects
  if (resumeData.selectedProjects && resumeData.selectedProjects.length > 0) {
    addSectionHeader('Featured Projects');
    resumeData.selectedProjects.forEach(proj => {
      const techText = (proj.techStack && proj.techStack.length) ? ` [${proj.techStack.join(', ')}]` : '';
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 40 },
          children: [
            new TextRun({
              text: proj.title,
              bold: true,
              size: 22,
              color: darkInk
            }),
            new TextRun({
              text: techText,
              italics: true,
              size: 18,
              color: primaryColor
            })
          ]
        })
      );

      const bullets = proj.tailoredBullets || [];
      bullets.forEach(b => {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: b,
                size: 20,
                color: darkInk
              })
            ]
          })
        );
      });
    });
  }

  // 6. Education
  if (resumeData.selectedEducation && resumeData.selectedEducation.length > 0) {
    addSectionHeader('Education');
    resumeData.selectedEducation.forEach(ed => {
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 40 },
          children: [
            new TextRun({
              text: `${ed.degree} in ${ed.fieldOfStudy || ''}`,
              bold: true,
              size: 20,
              color: darkInk
            }),
            new TextRun({
              text: ` | ${ed.institution}`,
              size: 20,
              color: primaryColor
            }),
            new TextRun({
              text: ed.endDate ? ` (${ed.endDate})` : '',
              size: 18,
              color: '777777'
            })
          ]
        })
      );
    });
  }

  // 7. Certifications
  if (resumeData.selectedCertifications && resumeData.selectedCertifications.length > 0) {
    addSectionHeader('Certifications');
    resumeData.selectedCertifications.forEach(cert => {
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 40 },
          children: [
            new TextRun({
              text: `${cert.name}`,
              bold: true,
              size: 20,
              color: darkInk
            }),
            new TextRun({
              text: ` — ${cert.issuingOrg}${cert.issueDate ? ` (${cert.issueDate})` : ''}`,
              size: 20,
              color: '666666'
            })
          ]
        })
      );
    });
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,
              bottom: 720,
              left: 720,
              right: 720
            }
          }
        },
        children
      }
    ]
  });

  return await Packer.toBuffer(doc);
}
