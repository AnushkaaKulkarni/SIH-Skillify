import InterviewSession from "../models/Interview.js";
import FacultyOralAttempt from "../models/FacultyOralAttempt.js";
import ExamAttempt from "../models/ExamAttempt.js";
import QuizAttempt from "../models/QuizAttempt.js";

export const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user._id;

    /* ================= EXAM & QUIZ ATTEMPTS ================= */
    // Fetch both formal exams and practice quizzes
    const examAttemptsData = await ExamAttempt.find({
      student: studentId,
      score: { $exists: true, $ne: null }
    }).populate("exam", "title subject");

    const quizAttemptsData = await QuizAttempt.find({
      student: studentId,
      isFinalized: true
    });

    // Merge and normalize both datasets
    const combinedAttempts = [
      ...examAttemptsData.map(a => ({
        type: 'Exam',
        score: a.score || 0,
        title: a.exam?.title || "Formal Exam",
        subject: a.exam?.subject || "General",
        date: a.submittedAt || a.createdAt
      })),
      ...quizAttemptsData.map(q => ({
        type: 'Quiz',
        score: typeof q.score === 'number' ? q.score : 0,
        title: q.quizType === 'CUSTOM' ? "Practice Quiz" : "Scheduled Quiz",
        subject: q.subject || "General",
        date: q.submittedAt || q.createdAt
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)); // Descending order

    const totalQuizzes = combinedAttempts.length;

    const avgQuizScore =
      totalQuizzes > 0
        ? combinedAttempts.reduce((sum, a) => sum + a.score, 0) / totalQuizzes
        : 0;

    // Create trend data with most recent attempts first (reverse for chronological display left to right on chart)
    const quizTrend = [...combinedAttempts].reverse().map((a, i) => ({
      attempt: i + 1,
      score: a.score || 0,
      title: a.title,
      subject: a.subject,
      date: a.date,
    }));

    /* ================= INTERVIEWS ================= */
    const interviews = await InterviewSession.find({
      student: studentId,
      status: "completed",
    }).sort({ createdAt: -1 });

    const totalInterviews = interviews.length;

    const avgInterviewScore =
      totalInterviews > 0
        ? interviews.reduce((sum, i) => sum + (i.overallScore || 0), 0) /
          totalInterviews
        : 0;

    const interviewTrend = [...interviews].reverse().map((i, index) => ({
      attempt: index + 1,
      score: i.overallScore || 0,
      subject: i.subject,
      date: i.createdAt,
    }));

    /* ================= FACULTY ORALS ================= */
    const facultyOrals = await FacultyOralAttempt.find({
      student: studentId,
      status: "completed",
    }).sort({ createdAt: -1 });

    const totalOrals = facultyOrals.length;

    const avgOralScore =
      totalOrals > 0
        ? facultyOrals.reduce(
            (sum, o) => sum + (o.overallScore || 0),
            0
          ) / totalOrals
        : 0;

    const oralTrend = [...facultyOrals].reverse().map((o, index) => ({
      attempt: index + 1,
      score: o.overallScore || 0,
      date: o.createdAt,
    }));

    /* ================= SUBJECT PERFORMANCE ================= */
    const subjectMap = {};

    combinedAttempts.forEach((a) => {
      const subject = a.subject;
      if (!subjectMap[subject]) subjectMap[subject] = [];
      subjectMap[subject].push(a.score || 0);
    });

    const subjectPerformance = Object.keys(subjectMap).map((sub) => ({
      subject: sub,
      score: Math.round(
        subjectMap[sub].reduce((a, b) => a + b, 0) / subjectMap[sub].length
      ),
      attempts: subjectMap[sub].length,
    }));

    /* ================= OVERALL ================= */
    // Only average the categories that actually have data
    let categoriesWithData = 0;
    let totalAverages = 0;

    if (totalQuizzes > 0) { totalAverages += avgQuizScore; categoriesWithData++; }
    if (totalInterviews > 0) { totalAverages += avgInterviewScore; categoriesWithData++; }
    if (totalOrals > 0) { totalAverages += avgOralScore; categoriesWithData++; }

    const overallAverage = categoriesWithData > 0 ? (totalAverages / categoriesWithData) : 0;

    /* ================= PASS RATE ================= */
    const passedCount = combinedAttempts.filter((a) => a.score >= 40).length;

    const passRate =
      totalQuizzes > 0
        ? Math.round((passedCount / totalQuizzes) * 100)
        : 0;

    /* ================= RECENT ACTIVITY ================= */
    const recentActivity = [
      ...combinedAttempts.map((a) => ({
        type: a.type, // 'Exam' or 'Quiz'
        title: a.title,
        subject: a.subject,
        score: a.score,
        date: a.date,
      })),
      ...interviews.map((i) => ({
        type: "Interview",
        title: i.subject || "Interview",
        subject: i.type || "Technical",
        score: i.overallScore || 0,
        date: i.createdAt,
      })),
      ...facultyOrals.map((o) => ({
        type: "Oral",
        title: "Faculty Oral",
        subject: "Oral Examination",
        score: o.overallScore || 0,
        date: o.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6);

    /* ================= RESPONSE ================= */
    res.json({
      totalQuizzes,
      totalInterviews,
      totalOrals,
      avgQuizScore: Math.round(avgQuizScore),
      avgInterviewScore: Math.round(avgInterviewScore),
      avgOralScore: Math.round(avgOralScore),
      overallAverage: Math.round(overallAverage),
      passRate,
      streak: totalQuizzes > 0 ? 1 : 0, // Simplified streak representation based on active exams
      quizTrend,
      interviewTrend,
      oralTrend,
      subjectPerformance,
      recentActivity,
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ message: "Dashboard error" });
  }
};

