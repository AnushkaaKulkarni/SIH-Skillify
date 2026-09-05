import QuizAttempt from "../models/QuizAttempt.js"
import User from "../models/User.js"
import { isFaceMatch } from "../services/faceMatchService.js"
import { updateCompetencyFromAssessment } from "../services/competencyEngine.js"

export const faceCheck = async (req, res) => {
  try {
    const { attemptId, embedding, answers } = req.body
    const attempt = await QuizAttempt.findById(attemptId)

    if (!attempt || attempt.isFinalized) {
      return res.json({ autoSubmitted: true })
    }

    const now = Date.now()

    let facePresent = true

    // 🫥 NO FACE CASE
    if (!embedding || embedding.length === 0) {
      facePresent = false
    } else {
      const user = await User.findById(attempt.student)
      if (
        user?.faceData?.embedding?.length &&
        !isFaceMatch(user.faceData.embedding, embedding)
      ) {
        facePresent = false
      }
    }

    // 🙂 FACE IS PRESENT
    if (facePresent) {
      attempt.noFaceSince = null
      attempt.lastFaceWarningAt = null
      await attempt.save()

      return res.json({
        faceMismatch: false,
        warnings: attempt.warnings,
        autoSubmitted: false,
      })
    }

    // 🫥 FACE NOT PRESENT
    if (!attempt.noFaceSince) {
      attempt.noFaceSince = new Date(now)
    }

    const noFaceDuration = now - new Date(attempt.noFaceSince).getTime()

    // ⚠️ first warning at 2 sec
    if (noFaceDuration >= 2000) {
      const lastWarn = attempt.lastFaceWarningAt
        ? new Date(attempt.lastFaceWarningAt).getTime()
        : 0

      // ⏳ cooldown: 8 sec between warnings
      if (!attempt.lastFaceWarningAt || now - lastWarn >= 8000) {
        attempt.warnings.face += 1
        attempt.lastFaceWarningAt = new Date(now)
      }
    }

    const totalWarnings =
      Number(attempt.warnings.tab || 0) +
      Number(attempt.warnings.face || 0)

    if (totalWarnings >= 3) {
      if (Array.isArray(answers)) {
        attempt.answers = answers
      }

      attempt.status = "AUTO_SUBMITTED"
      attempt.submittedAt = new Date()
      attempt.isFinalized = true
      attempt.submitReason = "PROCTOR_VIOLATION"
      attempt.submissionType = "AUTO"
    }

    await attempt.save()

    if (attempt.isFinalized) {
      try {
        const user = await User.findById(attempt.student)
        await updateCompetencyFromAssessment({
          user,
          questions: attempt.questions,
          answers: attempt.answers,
          source: "proctored-quiz",
        })
      } catch (competencyError) {
        console.error("Competency evidence update failed:", competencyError.message)
      }
    }

    return res.json({
      faceMismatch: true,
      warnings: attempt.warnings,
      autoSubmitted: attempt.isFinalized,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Proctoring failed" })
  }
}