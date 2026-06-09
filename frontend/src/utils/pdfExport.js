export const exportNotesPdf = ({ topic, notes, jsPDF }) => {
  const doc = new jsPDF();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("EduGenie X", 10, 20);
  doc.setFontSize(14);
  doc.text(`Study Notes: ${topic || "General"}`, 10, 30);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 10, 38);
  doc.line(10, 42, 200, 42);
  
  const splitText = doc.splitTextToSize(notes, 180);
  doc.text(splitText, 10, 50);
  doc.save("EduGenieX_Notes.pdf");
};

export const exportQuizPdf = ({ topic, quiz, jsPDF }) => {
  const doc = new jsPDF();
  doc.setFont("helvetica", "bold");
  doc.text("EduGenie X - Revision Quiz", 10, 20);
  doc.setFontSize(12);
  doc.text(`Topic: ${topic || "General"}`, 10, 30);
  doc.line(10, 35, 200, 35);

  let y = 45;
  const questions = Array.isArray(quiz?.questions) ? quiz.questions : [];
  questions.forEach((q, i) => {
    if (y > 270) { doc.addPage(); y = 20; }
    doc.setFont("helvetica", "bold");
    doc.text(`${i + 1}. ${q.question}`, 10, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.text(`Answer: ${q.correct_answer}`, 10, y);
    y += 10;
  });
  doc.save("EduGenieX_Quiz.pdf");
};

export const exportStudyPlanPdf = ({ topic, plan, jsPDF }) => {
  const doc = new jsPDF();
  doc.setFont("helvetica", "bold");
  doc.text("EduGenie X - Study Roadmap", 10, 20);
  doc.text(`Goal: ${topic}`, 10, 30);

  let y = 45;
  const weeks = Array.isArray(plan?.weeks) ? plan.weeks : [];
  weeks.forEach((w) => {
    doc.setFont("helvetica", "bold");
    doc.text(`Week ${w.week}: ${w.topics}`, 10, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.text(`Practice: ${w.practice}`, 15, y);
    y += 10;
  });
  doc.save("EduGenieX_Plan.pdf");
};

export const exportCareerRoadmapPdf = ({ interest, roadmap, jsPDF }) => {
  const doc = new jsPDF();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("EduGenie X - Career Roadmap", 10, 20);
  doc.setFontSize(12);
  doc.text(`Interest Area: ${interest || "General"}`, 10, 30);
  doc.line(10, 35, 200, 35);

  let y = 45;

  const sections = [
    { title: "Skills", items: roadmap?.skills || [] },
    { title: "Projects", items: roadmap?.projects || [] },
    { title: "Timeline", items: roadmap?.timeline || [] },
    { title: "Interview Preparation", items: roadmap?.interview_prep || [] },
  ];

  sections.forEach((section) => {
    if (y > 260) { doc.addPage(); y = 20; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(section.title, 10, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    section.items.forEach((item) => {
      if (y > 270) { doc.addPage(); y = 20; }
      const lines = doc.splitTextToSize(`- ${item}`, 180);
      doc.text(lines, 15, y);
      y += lines.length * 5 + 2;
    });
    y += 5;
  });

  doc.save("EduGenieX_Career_Roadmap.pdf");
};

export const exportResearchPdf = ({ topic, output, jsPDF }) => {
  const doc = new jsPDF();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("EduGenie X - Research Assistant", 10, 20);
  doc.setFontSize(12);
  doc.text(`Topic: ${topic || "General"}`, 10, 30);
  doc.line(10, 35, 200, 35);

  let y = 45;

  const sections = [
    { title: "Problem Statement", content: output?.problem_statement || "" },
    { title: "Methodology", content: output?.methodology || "" },
    { title: "Tools", items: output?.tools || [] },
    { title: "Expected Outcomes", items: output?.expected_outcomes || [] },
    { title: "Next Steps", items: output?.next_steps || [] },
  ];

  sections.forEach((section) => {
    if (y > 260) { doc.addPage(); y = 20; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(section.title, 10, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    if (section.content) {
      const lines = doc.splitTextToSize(section.content, 180);
      doc.text(lines, 15, y);
      y += lines.length * 5 + 2;
    }
    if (section.items) {
      section.items.forEach((item) => {
        if (y > 270) { doc.addPage(); y = 20; }
        const lines = doc.splitTextToSize(`- ${item}`, 180);
        doc.text(lines, 15, y);
        y += lines.length * 5 + 2;
      });
    }
    y += 5;
  });

  doc.save("EduGenieX_Research.pdf");
};