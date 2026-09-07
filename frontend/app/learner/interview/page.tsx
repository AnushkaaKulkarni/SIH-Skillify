"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function InterviewPracticePage() {
  useEffect(() => {
    redirect("/learner/dashboard");
  }, []);

  return null;
}

interface InterviewSession {
  _id: string;
  type: string;
  subject: string;
  difficulty: string;
  duration: number;
  status: string;
  overallScore: number;
}

export default function InterviewPracticePage() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

  const [interviewType, setInterviewType] = useState("");
  const [subject, setSubject] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [timeLimit, setTimeLimit] = useState("30");
  const [isStarting, setIsStarting] = useState(false);
  const [previousInterviews, setPreviousInterviews] = useState<
    InterviewSession[]
  >([]);
  const [loading, setLoading] = useState(true);

  /* ================= START INTERVIEW ================= */

  const handleStartInterview = async () => {
    if (!interviewType || !subject || !timeLimit) return;

    try {
      setIsStarting(true);

      // ✅ ENTER FULLSCREEN FIRST (direct user gesture)
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }

      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/interviews/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          type: interviewType,
          subject,
          difficulty,
          duration: Number(timeLimit),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create interview session");
      }

      router.push(`/learner/interview/session/${data.sessionId}`);
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsStarting(false);
    }
  };

  /* ================= FETCH PREVIOUS ================= */

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/interviews`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        const data = await res.json();

        if (res.ok) {
          setPreviousInterviews(data);
        }
      } catch (error) {
        console.error("Error fetching interviews:", error);
      } finally {
        setLoading(false);
      }
    };

    if (API_URL) fetchInterviews();
  }, [API_URL]);

  return (
    <div className="p-8 space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Interview Practice
        </h1>
        <p className="text-muted-foreground mt-2">
          Prepare for real interviews with AI-powered mock interviews
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <Card className="p-8 border border-border space-y-6">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              {/* Interview Type */}
              <div className="space-y-2">
                <Label>Interview Type *</Label>
                <Select value={interviewType} onValueChange={setInterviewType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select interview type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hr">HR Interview</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="behavioral">Behavioral</SelectItem>
                    <SelectItem value="case">Case Study</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <Label>Subject / Position *</Label>
                <Input
                  placeholder="e.g., Software Engineer"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              {/* Difficulty */}
              <div className="space-y-2">
                <Label>Difficulty *</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label>Interview Duration *</Label>
                <Select value={timeLimit} onValueChange={setTimeLimit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="20">20 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Start Button */}
              <Button
                type="button"
                onClick={handleStartInterview}
                disabled={!interviewType || !subject || isStarting}
                className="w-full h-11 gap-2"
              >
                <Play className="w-4 h-4" />
                {isStarting ? "Starting..." : "Start Interview"}
              </Button>
            </form>
          </Card>
        </div>

        {/* Info Section */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold">Interview Flow</h3>
            <ol className="space-y-2 text-sm text-muted-foreground mt-3">
              <li>1. AI Generates Questions</li>
              <li>2. You Answer Each Question</li>
              <li>3. Final Evaluation</li>
              <li>4. Detailed Feedback & Analytics</li>
            </ol>
          </Card>
        </div>
      </div>

      {/* Previous Interviews */}
      <section className="space-y-6 border-t border-border pt-8">
        <h2 className="text-2xl font-semibold">Previous Interviews</h2>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : previousInterviews.length === 0 ? (
          <Card className="p-12 text-center">
            <Briefcase className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">
              No interviews yet. Start your first mock interview!
            </p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {previousInterviews.map((session) => (
              <Card
                key={session._id}
                className="p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{session.subject}</p>
                  <p className="text-sm text-muted-foreground">
                    {session.type} • {session.difficulty} • {session.duration}{" "}
                    mins
                  </p>
                  <p className="text-xs mt-1">
                    Status: {session.status} • Score:{" "}
                    {session.overallScore ?? 0}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() =>
                    router.push(`/learner/interview/results/${session._id}`)
                  }
                >
                  View Report
                </Button>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
