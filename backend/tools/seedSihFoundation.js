import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Role from "../models/Role.js";
import Competency from "../models/Competency.js";
import CompetencyDomain from "../models/CompetencyDomain.js";

 dotenv.config();

const domains = [
  ["Statistical Competencies", "Official statistics and data quality practice."],
  ["Technical Competencies", "Data, software, cloud, and analytical capabilities."],
  ["Digital Governance", "Secure and responsible digital public infrastructure."],
  ["Behavioural and Managerial", "Leadership, communication, and organizational capabilities."],
];

const competencies = [
  ["Survey Design", "STAT_SURVEY_DESIGN", "Statistical Competencies"],
  ["Sampling", "STAT_SAMPLING", "Statistical Competencies"],
  ["National Accounts", "STAT_NATIONAL_ACCOUNTS", "Statistical Competencies"],
  ["Price Statistics", "STAT_PRICE_STATISTICS", "Statistical Competencies"],
  ["Labour Statistics", "STAT_LABOUR_STATISTICS", "Statistical Competencies"],
  ["Agricultural Statistics", "STAT_AGRICULTURAL_STATISTICS", "Statistical Competencies"],
  ["Industrial Statistics", "STAT_INDUSTRIAL_STATISTICS", "Statistical Competencies"],
  ["SDG Indicators", "STAT_SDG_INDICATORS", "Statistical Competencies"],
  ["Metadata Standards", "STAT_METADATA_STANDARDS", "Statistical Competencies"],
  ["Data Quality Frameworks", "STAT_DATA_QUALITY", "Statistical Competencies"],
  ["Python", "TECH_PYTHON", "Technical Competencies"],
  ["R", "TECH_R", "Technical Competencies"],
  ["SQL", "TECH_SQL", "Technical Competencies"],
  ["Stata", "TECH_STATA", "Technical Competencies"],
  ["SPSS", "TECH_SPSS", "Technical Competencies"],
  ["SAS", "TECH_SAS", "Technical Competencies"],
  ["GIS", "TECH_GIS", "Technical Competencies"],
  ["Data Visualization", "TECH_DATA_VISUALIZATION", "Technical Competencies"],
  ["AI/ML", "TECH_AI_ML", "Technical Competencies"],
  ["Cloud Computing", "TECH_CLOUD", "Technical Competencies"],
  ["APIs", "TECH_APIS", "Technical Competencies"],
  ["Open Data", "TECH_OPEN_DATA", "Technical Competencies"],
  ["Cybersecurity", "GOV_CYBERSECURITY", "Digital Governance"],
  ["Data Privacy", "GOV_DATA_PRIVACY", "Digital Governance"],
  ["Digital Signatures", "GOV_DIGITAL_SIGNATURES", "Digital Governance"],
  ["Government Cloud", "GOV_CLOUD", "Digital Governance"],
  ["Digital Public Infrastructure", "GOV_DPI", "Digital Governance"],
  ["Leadership", "BEH_LEADERSHIP", "Behavioural and Managerial"],
  ["Communication", "BEH_COMMUNICATION", "Behavioural and Managerial"],
  ["Project Management", "BEH_PROJECT_MANAGEMENT", "Behavioural and Managerial"],
  ["Ethics", "BEH_ETHICS", "Behavioural and Managerial"],
  ["Decision Making", "BEH_DECISION_MAKING", "Behavioural and Managerial"],
  ["Change Management", "BEH_CHANGE_MANAGEMENT", "Behavioural and Managerial"],
];

const seed = async () => {
  await connectDB();

  const domainMap = new Map();
  for (const [name, description] of domains) {
    const domain = await CompetencyDomain.findOneAndUpdate(
      { name },
      { name, description },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    domainMap.set(name, domain._id);
  }

  for (const [name, code, domainName] of competencies) {
    await Competency.findOneAndUpdate(
      { code },
      { name, code, domain: domainMap.get(domainName) },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  for (const name of ["Statistical Officer", "Data Analyst", "Training Officer", "Administrator"]) {
    await Role.findOneAndUpdate(
      { name },
      { name },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  const password = await bcrypt.hash("ChangeMe123!", 10);
  const samples = [
    { fullName: "Sample Learner", email: "learner@example.gov.in", role: "learner", officialId: "SAMPLE-OFFICIAL-001", designation: "Statistical Officer" },
    { fullName: "Sample Trainer", email: "trainer@example.gov.in", role: "trainer", employeeId: "SAMPLE-TRAINER-001", designation: "Training Officer" },
    { fullName: "Sample Administrator", email: "admin@example.gov.in", role: "admin", employeeId: "SAMPLE-ADMIN-001", designation: "Administrator" },
  ];

  for (const sample of samples) {
    await User.findOneAndUpdate(
      { email: sample.email },
      { ...sample, password, phone: "0000000000" },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  console.log("SIH foundation data seeded");
};

seed().finally(async () => {
  await mongoose.disconnect();
});
