/**
 * REGISTER
 */
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { generateRoleId } from "../utils/generateUserId.js";
import { generateCompetencyProfile } from "../services/competencyProfileService.js";


export const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      role,
      educationLevel,
      employeeId,
      officialId,
      designation,
      department,
      organization,
      currentAssignment,
      qualification,
      yearsOfExperience,
      targetRole,
      previousTraining,
    } = req.body;

    const roleAliases = { student: "learner", faculty: "trainer" };
    const normalizedRole = roleAliases[role] || role;
    if (!["learner", "trainer", "admin"].includes(normalizedRole)) {
      return res.status(400).json({ message: "Role must be learner, trainer, or admin" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 Generate Role ID
    const roleId = generateRoleId(normalizedRole);

    const userData = {
      fullName,
      email,
      phone,
      password: hashedPassword,
      role: normalizedRole,
      employeeId,
      officialId,
      designation,
      department,
      organization,
      currentAssignment,
      qualification,
      yearsOfExperience,
      targetRole,
      previousTraining,
    };

    // 🔹 Attach role-specific fields
    if (normalizedRole === "learner") {
      userData.studentId = roleId;
      userData.officialId = officialId || roleId;
      userData.educationLevel = educationLevel;
      userData.faceVerified = false;
    }

    if (normalizedRole === "trainer") {
      userData.facultyId = roleId;
    }

    if (role === "admin") {
      // Admin doesn't need a specific ID field
    }

    const user = await User.create(userData);

    // Generate competency profile from registration data (non-blocking)
    if (normalizedRole === "learner") {
      setImmediate(async () => {
        try {
          await generateCompetencyProfile(user);
        } catch (profileError) {
          console.error("Competency profile generation failed during registration:", profileError.message);
        }
      });
    }

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        role: user.role,
        officialId: user.officialId,
        employeeId: user.employeeId,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * LOGIN
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        officialId: user.officialId || null,
        employeeId: user.employeeId || null,
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/*
============================
GET PROFILE
============================
*/
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

/*
============================
UPDATE PROFILE
============================
*/
export const updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      educationLevel,
      employeeId,
      officialId,
      designation,
      department,
      organization,
      currentAssignment,
      qualification,
      yearsOfExperience,
      targetRole,
      previousTraining,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    if (user.role === "student" || user.role === "learner") {
      user.educationLevel =
        educationLevel || user.educationLevel;
    }

    Object.assign(user, {
      employeeId: employeeId || user.employeeId,
      officialId: officialId || user.officialId,
      designation: designation || user.designation,
      department: department || user.department,
      organization: organization || user.organization,
      currentAssignment: currentAssignment || user.currentAssignment,
      qualification: qualification || user.qualification,
      yearsOfExperience: yearsOfExperience ?? user.yearsOfExperience,
      targetRole: targetRole || user.targetRole,
      previousTraining: previousTraining || user.previousTraining,
    });

    await user.save();

    // Regenerate competency profile on profile update (non-blocking)
    if (user.role === "learner" || user.role === "student") {
      setImmediate(async () => {
        try {
          await generateCompetencyProfile(user);
        } catch (profileError) {
          console.error("Competency profile regeneration failed during profile update:", profileError.message);
        }
      });
    }

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};
