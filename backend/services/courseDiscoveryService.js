import axios from "axios";
import CourseSearchCache from "../models/CourseSearchCache.js";

const catalogue = [
  ["Survey Design Fundamentals", "Survey Design", "NSSTA-style prototype catalogue", "https://mospi.gov.in"],
  ["Sampling Methods for Official Statistics", "Sampling", "NSSTA-style prototype catalogue", "https://mospi.gov.in"],
  ["Python for Statistical Analysis", "Python", "NPTEL/SWAYAM discovery fallback", "https://swayam.gov.in"],
  ["SQL for Government Data", "SQL", "Prototype learning catalogue", "https://www.igotkarmayogi.gov.in"],
  ["Data Quality in Official Statistics", "Data Quality", "NSSTA-style prototype catalogue", "https://mospi.gov.in"],
  ["Privacy and Secure Data Exchange", "Data Privacy", "Prototype learning catalogue", "https://www.igotkarmayogi.gov.in"],
];

export const discoverCourses = async ({ competency, role, gap = 1 }) => {
  const query = `${competency} ${role || "official statistics"} training India`.toLowerCase();
  const cached = await CourseSearchCache.findOne({ query, expiresAt: { $gt: new Date() } }).lean();
  if (cached) return { source: "cache", results: cached.results };
  let results = [];
  if (process.env.COURSE_SEARCH_ENABLED === "true" && process.env.SERPAPI_KEY) {
    try {
      const response = await axios.get("https://serpapi.com/search.json", { params: { q: query, engine: "google", api_key: process.env.SERPAPI_KEY }, timeout: 8000 });
      results = (response.data.organic_results || []).slice(0, 6).map((item) => ({ title: item.title, url: item.link, platform: /igot/i.test(`${item.title} ${item.link}`) ? "iGOT" : /nssta|mospi/i.test(`${item.title} ${item.link}`) ? "NSSTA/MoSPI" : "External learning resource", competency, relevanceReason: `Recommended for a Level ${gap} ${competency} gap.` }));
    } catch { /* the local catalogue below is the explicit failure-safe fallback */ }
  }
  if (!results.length) results = catalogue.filter(([title, topic]) => `${title} ${topic}`.toLowerCase().includes(String(competency).toLowerCase()) || String(competency).toLowerCase().includes(topic.toLowerCase())).map(([title, _topic, platform, url]) => ({ title, url, platform, competency, relevanceReason: `Recommended for a Level ${gap} ${competency} gap.`, prototype: true }));
  if (!results.length) results = catalogue.slice(0, 3).map(([title, _topic, platform, url]) => ({ title, url, platform, competency, relevanceReason: `Foundational resource while addressing your ${competency} gap.`, prototype: true }));
  await CourseSearchCache.findOneAndUpdate({ query }, { query, results, expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000) }, { upsert: true });
  return { source: results[0]?.prototype ? "prototype catalogue" : "SerpAPI", results };
};
