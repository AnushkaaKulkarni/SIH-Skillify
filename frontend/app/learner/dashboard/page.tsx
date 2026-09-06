"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import {
  Target,
  Flame,
  TrendingUp,
  MessageSquare,
  Mic,
  Brain,
  ClipboardList,
  Activity,
  Award,
  BookOpen,
} from "lucide-react";

export default function LearnerDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

  const COLORS = ["#4F46E5", "#06B6D4", "#10B981", "#F59E0B", "#EF4444"];

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/learner/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const data = await res.json();
        console.log("DASHBOARD DATA:", data);
        setDashboardData(data);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
        // Keep loading false even on error to show error state
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <Activity className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Unable to load dashboard</h2>
            <p className="text-muted-foreground">Please check your connection and try again.</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const performanceDistribution = [
    { name: "Quiz", value: dashboardData.avgQuizScore || 0 },
    { name: "Interview", value: dashboardData.avgInterviewScore || 0 },
    { name: "Oral", value: dashboardData.avgOralScore || 0 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Learner / Official Dashboard</h1>
              <p className="text-muted-foreground mt-1">Complete AI Performance Analytics</p>
            </div>
          </div>
        </div>

        {/* KPI SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Card className="p-6 glass-morphism hover-lift group">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Overall Avg</p>
                <p className="text-2xl font-bold text-foreground">
                  {dashboardData.overallAverage || 0}%
                </p>
                <p className="text-xs text-muted-foreground">From {dashboardData.totalQuizzes || 0} exams</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 glass-morphism hover-lift group">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <ClipboardList className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Exam Attempts</p>
                <p className="text-2xl font-bold text-foreground">
                  {dashboardData.totalQuizzes || 0}
                </p>
                <p className="text-xs text-muted-foreground">Total taken</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 glass-morphism hover-lift group">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Interviews</p>
                <p className="text-2xl font-bold text-foreground">
                  {dashboardData.totalInterviews || 0}
                </p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 glass-morphism hover-lift group">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Faculty Orals</p>
                <p className="text-2xl font-bold text-foreground">
                  {dashboardData.totalOrals || 0}
                </p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 glass-morphism hover-lift group">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Pass Rate</p>
                <p className="text-2xl font-bold text-foreground">{dashboardData.passRate || 0}%</p>
                <p className="text-xs text-muted-foreground">Score ≥40%</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 glass-morphism hover-lift group">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Streak</p>
                <p className="text-2xl font-bold text-foreground">
                  {dashboardData.streak || 0} days
                </p>
                <p className="text-xs text-muted-foreground">Consecutive</p>
              </div>
            </div>
          </Card>
        </div>

        {/* TREND CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 glass-morphism hover-lift">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-purple-600" />
              <h2 className="font-semibold text-foreground">Exam Trend</h2>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dashboardData.quizTrend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="attempt" stroke="#6b7280" />
                <YAxis domain={[0, 100]} stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#4F46E5"
                  strokeWidth={3}
                  dot={{ fill: '#4F46E5', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 glass-morphism hover-lift">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <h2 className="font-semibold text-foreground">Interview Trend</h2>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dashboardData.interviewTrend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="attempt" stroke="#6b7280" />
                <YAxis domain={[0, 100]} stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#06B6D4"
                  strokeWidth={3}
                  dot={{ fill: '#06B6D4', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 glass-morphism hover-lift">
            <div className="flex items-center gap-2 mb-4">
              <Mic className="w-5 h-5 text-green-600" />
              <h2 className="font-semibold text-foreground">Oral Trend</h2>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dashboardData.oralTrend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="attempt" stroke="#6b7280" />
                <YAxis domain={[0, 100]} stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: '#10B981', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* DISTRIBUTION + SUBJECT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 glass-morphism hover-lift">
            <div className="flex items-center gap-2 mb-4">
              <BarChart className="w-5 h-5 text-purple-600" />
              <h2 className="font-semibold text-foreground">Average Score Distribution</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis domain={[0, 100]} stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Bar dataKey="value" fill="#4F46E5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 glass-morphism hover-lift">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-purple-600" />
              <h2 className="font-semibold text-foreground">Subject Performance</h2>
            </div>

            {dashboardData.subjectPerformance?.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dashboardData.subjectPerformance}
                    dataKey="score"
                    nameKey="subject"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={3}
                    label={({ subject, score }) => `${subject}: ${score}%`}
                  >
                    {dashboardData.subjectPerformance.map((_: any, i: number) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No subject data available</p>
              </div>
            )}
          </Card>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 glass-morphism hover-lift">
            <h2 className="font-semibold text-foreground mb-4">Profile and Readiness</h2>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Learner:</span> {dashboardData.profile?.fullName || "Not available"}</p>
              <p><span className="font-medium">Designation:</span> {dashboardData.profile?.designation || "Not specified"}</p>
              <p><span className="font-medium">Target role:</span> {dashboardData.profile?.targetRole || "Not configured"}</p>
              <p><span className="font-medium">Competencies:</span> {dashboardData.competencyOverview?.competencies?.length || 0}</p>
              <p><span className="font-medium">Open gaps:</span> {(dashboardData.competencyOverview?.competencies || []).filter((item: any) => item.gap?.status === "open").length}</p>
            </div>
          </Card>

          <Card className="p-6 glass-morphism hover-lift">
            <h2 className="font-semibold text-foreground mb-4">Assigned Assessments</h2>
            {dashboardData.scheduledAssessments?.length ? (
              <div className="space-y-3">
                {dashboardData.scheduledAssessments.slice(0, 4).map((assessment: any) => (
                  <div key={assessment._id} className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{assessment.title}</p>
                      <p className="text-xs text-muted-foreground">{assessment.subject}</p>
                    </div>
                    <Button size="sm" onClick={() => router.push(`/learner/quiz/take/${assessment._id}`)}>Open</Button>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-muted-foreground">No assessments assigned yet.</p>}
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 glass-morphism hover-lift">
            <h2 className="font-semibold text-foreground mb-4">Competency Status</h2>
            {dashboardData.competencyOverview?.competencies?.length ? (
              <div className="space-y-3">
                {dashboardData.competencyOverview.competencies.slice(0, 6).map((item: any) => (
                  <div key={item.competency._id} className="border-b border-border pb-2">
                    <div className="flex justify-between gap-3 text-sm">
                      <span>{item.competency.name}</span>
                      <span className="font-medium">{item.current?.score == null ? "Not Assessed" : `${item.current.score}%`}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Required: Level {item.requiredLevel} | Status: {item.current?.score == null ? "Not Assessed" : item.gap?.status === "open" ? "Gap" : "Ready"}</p>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-muted-foreground">Competencies will appear when a target-role mapping is configured.</p>}
          </Card>

          <Card className="p-6 glass-morphism hover-lift">
            <h2 className="font-semibold text-foreground mb-4">Recommendations and Training</h2>
            {dashboardData.recommendations?.length ? dashboardData.recommendations.slice(0, 4).map((item: any) => (
              <div key={item._id} className="border-b border-border py-2 text-sm">
                <p className="font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">Recommended from {item.sourceType === "igot" ? "iGOT" : item.sourceType || "internal"} | {item.status}</p>
              </div>
            )) : <p className="text-sm text-muted-foreground">Recommendations will appear after an assessed gap is identified.</p>}
            <p className="text-xs text-muted-foreground mt-3">Training history: {dashboardData.trainingHistory?.length || 0} records</p>
          </Card>
        </div>

        <Card className="p-6 glass-morphism hover-lift">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-purple-600" />
            <h2 className="font-semibold text-foreground">Recent Activity</h2>
          </div>

          {(dashboardData.recentActivity || []).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Activity className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-4">
              {dashboardData.recentActivity
                .slice(0, 6)
                .map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-secondary/30 rounded-xl border border-border/50 hover:bg-secondary/50 transition-colors duration-200">
                    <div>
                      <p className="font-medium text-foreground">
                        {item.type} • {item.subject}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.title}
                      </p>
                    </div>

                    <span className="font-semibold text-primary bg-primary/10 px-3 py-1 rounded-lg">
                      {item.score || 0}%
                    </span>
                  </div>
                ))}
            </div>
          )}
        </Card>

        {/* ACTION BUTTONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Button 
            onClick={() => router.push("/learner/quiz")}
            variant="gradient"
            size="lg"
            className="shadow-lg hover:shadow-xl group"
          >
            <ClipboardList className="w-4 h-4 mr-2" />
            Practice Exams
            <Target className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push("/learner/interview")}
            className="border-2 hover:bg-accent/50 group"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Practice Interviews
            <Target className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => router.push("/learner/oral")}
            className="border-2 hover:bg-accent/50 group"
          >
            <Mic className="w-4 h-4 mr-2" />
            Faculty Orals
            <Target className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </Button>
        </div>
      </div>
    </div>
  );
}
