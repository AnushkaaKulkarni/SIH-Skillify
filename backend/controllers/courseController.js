import axios from "axios";
import Course from "../models/Course.js";

export const searchCourses = async (req, res) => {
  try {
    const { keyword, type } = req.query;

    if (!keyword) {
      return res.status(400).json({ message: "Keyword required" });
    }

    // Difficulty detection function
    const detectDifficulty = (text) => {
      text = text.toLowerCase();

      const easyWords = [
        "beginner",
        "basic",
        "introduction",
        "intro",
        "fundamentals",
        "for beginners",
      ];

      const hardWords = [
        "advanced",
        "expert",
        "masterclass",
        "deep dive",
        "professional",
        "bootcamp",
      ];

      if (easyWords.some((word) => text.includes(word))) return "Easy";
      if (hardWords.some((word) => text.includes(word))) return "Hard";

      return "Medium";
    };

    // 🔵 WEB COURSES
    if (type === "web") {
      const response = await axios.get("https://serpapi.com/search.json", {
        params: {
          q: `${keyword} course`,
          engine: "google",
          api_key: process.env.SERP_API_KEY,
        },
      });

      const results =
        response.data.organic_results?.map((item) => {
          const link = item.link;

          let platform = "Website";
          if (link.includes("udemy")) platform = "Udemy";
          else if (link.includes("coursera")) platform = "Coursera";
          else if (link.includes("edx")) platform = "edX";
          else if (link.includes("pluralsight")) platform = "Pluralsight";

          const difficulty = detectDifficulty(item.title + " " + item.snippet);

          return {
            title: item.title,
            link: item.link,
            snippet: item.snippet,
            platform,
            difficulty,
            type: "web",
          };
        }) || [];

      return res.json(results);
    }

    // 🔴 YOUTUBE VIDEOS
    // 🔴 YOUTUBE VIDEOS
    if (type === "youtube") {
      const response = await axios.get("https://serpapi.com/search.json", {
        params: {
          search_query: `${keyword} course`,
          engine: "youtube",
          api_key: process.env.SERP_API_KEY,
        },
      });

      const results =
        response.data.video_results?.map((video) => {
          const difficulty = detectDifficulty(
            video.title + " " + video.description,
          );

          return {
            title: video.title,
            link: video.link,
            snippet: video.description,
            platform: "YouTube",
            difficulty,
            thumbnail: video.thumbnail?.static || null, // ✅ FIXED
            type: "youtube",
          };
        }) || [];

      return res.json(results);
    }

    res.status(400).json({ message: "Invalid type" });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: "Error fetching results" });
  }
};

export const saveCourse = async (req, res) => {
  try {
    const {
      title,
      link,
      snippet,
      platform,
      difficulty,
      thumbnail,
      type,
    } = req.body;

    const course = await Course.create({
      user: req.user.id,
      title,
      link,
      snippet,
      platform,
      difficulty,
      thumbnail,
      type,
    });

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Error saving course" });
  }
};


export const getSavedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ user: req.user.id });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching saved courses" });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    await Course.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    res.json({ message: "Course removed" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting course" });
  }
};
