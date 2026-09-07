"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function OralPracticePage() {
  useEffect(() => {
    redirect("/learner/dashboard");
  }, []);

  return null;
}

export default function OralPracticePage() {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [timeLimit, setTimeLimit] = useState("10");
  const [isStarting, setIsStarting] = useState(false);
  const [difficulty, setDifficulty] = useState("intermediate");

  const [sessions, setSessions] = useState<any[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  const [scheduledExams, setScheduledExams] = useState<any[]>([]);
  const [loadingScheduled, setLoadingScheduled] = useState(true);

  const [facultyAttempts, setFacultyAttempts] = useState<any[]>([]);
  const [filter, setFilter] = useState("all"); // all | custom | faculty

  // 🔥 Fetch Previous Sessions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/oral`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch sessions");

        const data = await res.json();
        setSessions(data);
      } catch (error) {
        console.error("Session fetch error:", error);
      } finally {
        setLoadingSessions(false);
      }
    };

    fetchSessions();

    const fetchScheduledExams = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/oral/learner/oral/scheduled`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        const data = await res.json();
        setScheduledExams(data);
      } catch (error) {
        console.error("Scheduled fetch error:", error);
      } finally {
        setLoadingScheduled(false);
      }
    };

    fetchScheduledExams();

    const fetchFacultyAttempts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/learner/faculty-oral/attempts`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        const data = await res.json();
        setFacultyAttempts(data);
      } catch (error) {
        console.error("Faculty attempts fetch error:", error);
      }
    };

    fetchFacultyAttempts();
  }, []);

  const enterFullscreen = async () => {
    try {
      const elem = document.documentElement;

      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if ((elem as any).webkitRequestFullscreen) {
        await (elem as any).webkitRequestFullscreen();
      } else if ((elem as any).msRequestFullscreen) {
        await (elem as any).msRequestFullscreen();
      }
    } catch (error) {
      console.error("Fullscreen failed:", error);
    }
  };

  const handleStartSession = async () => {
    if (!subject) return;

    try {
      setIsStarting(true);

      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/oral/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            subject,
            duration: Number(timeLimit),
            difficulty,
          }),
        },
      );

      if (!res.ok) throw new Error("Failed to create session");

      const data = await res.json();

      router.push(`/learner/oral/session/${data.sessionId}`);
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
      setIsStarting(false);
    }
  };

  const isExamActive = (exam: any) => {
    const examStart = new Date(`${exam.date.split("T")[0]}T${exam.time}`);
    const examEnd = new Date(examStart.getTime() + 20 * 60000); // 20 mins active window

    const now = new Date();

    return now >= examStart && now <= examEnd;
  };

  return (
    <div className="p-8 space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Oral Practice</h1>
        <p className="text-muted-foreground mt-2">
          Practice speaking with AI and improve your communication skills
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <Card className="p-8 border border-border space-y-6">
            <form className="space-y-6">
              {/* Subject */}
              <div className="space-y-2">
                <Label
                  htmlFor="subject"
                  className="text-sm font-medium text-foreground"
                >
                  Subject/Topic <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="e.g., Operating System, Gravitation..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="h-10 border-border bg-background"
                />
              </div>

              {/* Time Limit */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  Session Duration
                </Label>
                <Select value={timeLimit} onValueChange={setTimeLimit}>
                  <SelectTrigger className="h-10 border-border bg-background">
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

              {/* Difficulty */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  Difficulty Level
                </Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger className="h-10 border-border bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Start Button */}
              <Button
                type="button"
                onClick={handleStartSession}
                disabled={!subject || isStarting}
                className="w-full bg-primary hover:bg-primary/90 h-11 gap-2 font-semibold"
              >
                <Mic2 className="w-4 h-4" />
                {isStarting ? "Starting..." : "Start Oral Session"}
              </Button>
            </form>
          </Card>
        </div>

        {/* Info Section */}
        <div className="space-y-6">
          <Card className="p-6 border border-border space-y-4">
            <h3 className="font-semibold text-foreground">How It Works</h3>
            <ol className="space-y-3 text-sm text-muted-foreground">
              <li>1. AI generates questions</li>
              <li>2. You answer verbally</li>
              <li>3. AI evaluates performance</li>
              <li>4. Get detailed feedback & analytics</li>
            </ol>
          </Card>
        </div>
      </div>

      {/* 🔥 Scheduled by Faculty Section */}
      <section className="space-y-6 border-t border-border pt-8">
        <h2 className="text-2xl font-semibold text-foreground">
          Scheduled by Faculty
        </h2>

        {loadingScheduled ? (
          <Card className="p-12 text-center">
            <p>Loading scheduled exams...</p>
          </Card>
        ) : scheduledExams.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">
              No exams scheduled by faculty.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {scheduledExams.map((exam) => {
              const active = isExamActive(exam);

              return (
                <Card
                  key={exam._id}
                  className="p-6 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold">{exam.topic}</h3>
                    <h3 className="font-semibold">
                      Faculty: {exam.faculty?.fullName}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      {new Date(exam.date).toLocaleDateString()} • {exam.time} •{" "}
                      {exam.duration} mins
                    </p>

                    <p className="text-sm mt-1">
                      Status:{" "}
                      <span
                        className={active ? "text-green-600" : "text-red-500"}
                      >
                        {active ? "Active" : "Not Active"}
                      </span>
                    </p>
                  </div>

                  <Button
                    disabled={!active}
                    onClick={() =>
                      router.push(
                        `/learner/oral/session/${exam._id}?type=faculty`,
                      )
                    }
                  >
                    Start Exam
                  </Button>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* 🔥 Previous Sessions Section */}
      <section className="space-y-6 border-t border-border pt-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-foreground">
            Previous Sessions
          </h2>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
            >
              All
            </Button>

            <Button
              size="sm"
              variant={filter === "custom" ? "default" : "outline"}
              onClick={() => setFilter("custom")}
            >
              Your Tests
            </Button>

            <Button
              size="sm"
              variant={filter === "faculty" ? "default" : "outline"}
              onClick={() => setFilter("faculty")}
            >
              Faculty Tests
            </Button>
          </div>
        </div>

        {loadingSessions ? (
          <Card className="p-12 text-center">
            <p>Loading sessions...</p>
          </Card>
        ) : sessions.length === 0 ? (
          <Card className="p-12 text-center">
            <Mic2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">
              No sessions yet. Start your first oral practice!
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {(() => {
              let customList = filter === "faculty" ? [] : sessions;

              let facultyList = filter === "custom" ? [] : facultyAttempts;

              if (filter === "all") {
                customList = sessions;
                facultyList = facultyAttempts;
              }

              const isEmpty =
                customList.length === 0 && facultyList.length === 0;

              if (isEmpty) {
                return (
                  <Card className="p-12 text-center">
                    <p className="text-muted-foreground">No sessions found.</p>
                  </Card>
                );
              }

              return (
                <div className="space-y-4">
                  {/* Custom Tests */}
                  {customList.map((session) => (
                    <Card
                      key={session._id}
                      className="p-6 flex justify-between items-center"
                    >
                      <div>
                        <h3 className="font-semibold">{session.subject}</h3>
                        <p className="text-sm text-muted-foreground">
                          {session.difficulty} • {session.duration} mins
                        </p>
                        <p className="text-sm mt-1">Status: {session.status}</p>

                        {session.status === "completed" && (
                          <p className="text-green-600 text-sm">
                            Score: {session.overallScore}%
                          </p>
                        )}
                      </div>

                      {session.status === "completed" && (
                        <Button
                          onClick={() =>
                            router.push(`/learner/oral/results/${session._id}`)
                          }
                        >
                          View Results
                        </Button>
                      )}
                    </Card>
                  ))}

                  {/* Faculty Tests */}
                  {facultyList.map((attempt) => (
                    <Card
                      key={attempt._id}
                      className="p-6 flex justify-between items-center"
                    >
                      <div>
                        <h3 className="font-semibold">{attempt.exam?.topic}</h3>
                        <p className="text-sm text-muted-foreground">
                          Faculty Test • {attempt.exam?.duration} mins
                        </p>
                        <p className="text-sm mt-1">Status: {attempt.status}</p>

                        {attempt.status === "completed" && (
                          <p className="text-green-600 text-sm">
                            Score: {attempt.overallScore}%
                          </p>
                        )}
                      </div>

                      {attempt.status === "completed" && (
                        <Button
                          onClick={() =>
                            router.push(
                              `/learner/oral/results/${attempt._id}?type=faculty`,
                            )
                          }
                        >
                          View Results
                        </Button>
                      )}
                    </Card>
                  ))}
                </div>
              );
            })()}
          </div>
        )}
      </section>
    </div>
  );
}
